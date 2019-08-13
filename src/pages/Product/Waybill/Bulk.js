import React from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Form, Row, Select, Button, message, Modal } from 'antd';
import { autobind } from 'core-decorators';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { get, isEmpty } from 'lodash';
import router from 'umi/router';
import styles from './WaybillManager.less';

const selectStyle = {
  width: '102px',
  height: '32px',
};

const { Option } = Select;
@connect(({ waybill, loading }) => ({
  waybill,
  loading,
}))
@Form.create({})
@autobind
class Bulk extends React.Component {
  state = {
    page: 1,
    size: 10,
    mirrorData: [],
    bulkSettingRequire: false,
    extraField: 'postage, orderDetail, orderAddress',
    visibleModal: false,
    repeatWaybills: [],
    repeatWaybillsFormat: [],
  };

  componentDidMount() {
    this.getWaybills();
    this.getExpressCompanies();
  }

  async onPageChange(current, size) {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'waybill/getWaybills',
      payload: {
        page: current,
        size,
        extraField: get(this.state, ['extraField']),
      },
    });
    const { data } = res;
    if(!isEmpty(data)){
      const next = get(data, ['records']).map(v => ({
        ...v,
        key: get(v, ['id']),
        expressCompany: `${get(v, ['expressCompany']) ? get(v, ['expressCompany']) : '1'}`,
        paymentMethod: '2',
        num: get(v, ['orderDetail', '0', 'num']),
      }));
      this.setState({mirrorData: next});
    }
  }

  async getWaybills() {
    const { dispatch } = this.props;
    const { page, size } = this.state;
    const res = await dispatch({
      type: 'waybill/getWaybills',
      payload: { page, size, shippingStatus: 1, extraField: get(this.state, ['extraField']) },
    });
    const next = get(res, ['data', 'records'], []).map(v => ({
      ...v,
      key: get(v, ['id']),
      expressCompany: `${get(v, ['expressCompany']) ? get(v, ['expressCompany']) : '1'}`,
      // paymentMethod: `${get(v, ['paymentMethod']) ? get(v, ['paymentMethod']) : '1'}`,
      paymentMethod: '2',
      num: get(v, ['orderDetail', '0', 'num']),
    }));
    this.setState({ mirrorData: next });
  }

  getExpressCompanies() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waybill/getExpressCompanies',
    });
  }

  setD = (key, direct) => e => this.setState({ [key]: direct ? e : e.target.value });

  handleGoBack = () => router.push('/order/b2cOrder/waybills');

  handleBulkSet = () => {
    const { form } = this.props;
    const { mirrorData } = this.state;
    const chosen = mirrorData.filter(v => get(v, ['chosen']));
    if (chosen.length < 1) {
      return message.error('批量设置必须选择运单！');
    }
    if (chosen.length >= 1) {
      form.validateFields((err, values) => {
        if (err) return message.error('表单填写信息有误！');
        const { expressCompany, paymentMethod, fee } = values;
        if (isEmpty(expressCompany)) return message.error('批量设置，快递公司必须填写！');
        if (isEmpty(paymentMethod)) return message.error('批量设置，支付方式必须填写！');
        if (paymentMethod === '1' && isEmpty(fee)) return message.error('批量设置，单比支付运费必须填写！');
        const target = { expressCompany, paymentMethod, fee: paymentMethod === '1' ? fee : 15 };
        const next = mirrorData.slice().map(v => {
          if (get(v, ['chosen'])) {
            return { ...v, ...target };
          }
          return v;
        });
        this.setState({ mirrorData: next });
      });
    }
  };

  handleModal = type => () => this.setState({ visibleModal: type === 'ok' });

  async handleBulk(check = true) {
    const { mirrorData } = this.state;
    const chosen = mirrorData.filter(v => get(v, ['chosen']));
    if (chosen.length < 1) {
      return message.info('请选择运单！');
    }
    if (chosen.length >= 1) {
      for (let i = 0; i < chosen.length; i += 1) {
        const { paymentMethod, expressCompany, expressNumber, fee } = chosen[i];
        if (isEmpty(paymentMethod)) return message.error('支付方式不能为空');
        if (isEmpty(expressCompany)) return message.error('快递公司不能为空');
        if (isEmpty(expressNumber)) return message.error('快递单号不能为空');
        if (paymentMethod === '1' && isEmpty(fee)) return message.error('单比发货费用不能为空');
      }

      const repeat = check && (await this.checkRepeat(chosen));
      if (repeat && get(repeat, ['data', 'length']) > 0) {
        const obj = {};
        const tagRepeatData = mirrorData.slice();

        get(repeat, ['data']).map(v => {
          const key = get(v, ['expressNumber']);
          if (Reflect.has(obj, key)) {
            obj[key].push(v);
          } else {
            obj[key] = [v];
          }

          tagRepeatData.forEach((val, i) => {
            if (get(val, 'chosen') && get(val, 'expressNumber') === get(v, ['expressNumber'])) {
              tagRepeatData[i].repeat = true;
            }
          });
        });

        tagRepeatData.filter(v => v.repeat && v.chosen).map(v => obj[get(v, 'expressNumber')].push(v));

        // 把重复的运单打标签
        this.setState({ mirrorData: tagRepeatData });

        const repeatWaybillsFormat = Object.entries(obj).map(v => {
          const key = get(v, ['0']);
          const value = get(v, ['1']);
          return {
            key,
            expressNumber: key,
            orderCode: value,
            info: value,
            spu: value,
            consignee: value,
            address: value,
            shippingStatusName: value,
            shippingTime: value,
          };
        });

        return this.setState({
          repeatWaybills: get(repeat, ['data']).map(v => ({ ...v, key: get(v, ['id']) })),
          visibleModal: true,
          repeatWaybillsFormat,
        });
      }
      this.bulk();
    }
  }

  async checkRepeat(chosen) {
    const { dispatch } = this.props;
    const res = await dispatch({ type: 'waybill/checkRepeat', payload: { expressNumber: chosen.map(v => get(v, ['expressNumber'])) } });
    return res;
  }

  handleEdit(key, value, record) {
    const { mirrorData } = this.state;
    const next = mirrorData.slice().map(v => {
      if (v.id === get(record, ['id'])) {
        return { ...v, [key]: value };
      }
      return v;
    });
    this.setState({ mirrorData: next });
  }

  handleRepeatRowSelection(selectedRowKeys, selectedRows) {
    const { mirrorData } = this.state;
    const next = mirrorData.slice();
    if (selectedRows.length > 0) {
      next.map((value, index) => {
        const res = selectedRows.find(v => v.expressNumber === value.expressNumber);
        if (res && value.repeat) {
          next[index].repeat = false;
        }
        if (!res && Reflect.has(value, 'repeat')) {
          next[index].repeat = true;
        }
      });
    } else {
      next.map((v, i) => {
        if (v.chosen && Reflect.has(v, 'repeat')) {
          next[i].repeat = true;
        }
      });
    }
    this.setState({ mirrorData: next, repeatSelectedRowKeys: selectedRowKeys });
  }

  handleCancel() {
    this.setState({ visibleModal: false, repeatSelectedRowKeys: [] });
    // const { mirrorData } = this.state;
    // const next = mirrorData.slice();
    // next.map((v, i) => {
    //   if (v.chosen && v.repeat) {
    //     next[i].repeat = true;
    //   }
    // });
    // this.setState({ mirrorData: next, visibleModal: false });
  }

  async bulk() {
    const { dispatch } = this.props;
    const { mirrorData } = this.state;
    const chosen = mirrorData.filter(v => v.chosen && !v.repeat);
    if (chosen.length === 0) return message.error('请选择运单');
    const payload = chosen.map(v => ({
      id: get(v, 'id'),
      expressCompany: get(v, 'expressCompany'),
      expressNumber: get(v, 'expressNumber'),
      paymentMethod: get(v, 'paymentMethod'),
      fee: get(v, 'paymentMethod') == 1 ? get(v, 'fee') : get(v, 'postage'),
      remark: get(v, 'remark'),
    }));
    const res = await dispatch({ type: 'waybill/bulkShipping', payload });
    const isok = get(res, ['data', 'success']);
    if (isok) {
      window.location.reload();
    } else {
      message.error(`发货失败请重新尝试${JSON.stringify(get(res, ['data', 'shippingFailure']))}`);
    }
  }

  handleRowSelection(selectedRowKeys, selectedRows) {
    const { mirrorData } = this.state;
    const next = mirrorData.slice();
    next.map((v, i) => {
      const chosen = selectedRows.find(val => val.id === v.id);
      next[i].chosen = !!chosen;
    });
    this.setState({ mirrorData: next, selectedRowKeys });
  }

  async handleOk() {
    this.bulk();
  }

  render() {
    const { waybill, form } = this.props;
    const { records, total, current } = get(waybill, 'list');
    const pagination = { onChange: this.onPageChange, total, current };
    const loading = !!get(this.props, ['loading', 'models', 'waybill']);
    const companies = Object.entries(get(this.props, ['waybill', 'expressCompanies']));
    const expressCompanies = companies.map(v => (
      <Option key={`${v[0]}`} value={`${v[0]}`}>
        {v[1]}
      </Option>
    ));
    const { getFieldDecorator, getFieldsValue } = form;
    const { paymentMethod } = getFieldsValue();
    const { bulkSettingRequire, mirrorData, visibleModal, repeatWaybillsFormat, selectedRowKeys, repeatSelectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelection,
    };

    const repeatRowSelection = {
      selectedRowKeys: repeatSelectedRowKeys,
      onChange: this.handleRepeatRowSelection,
    };

    const bulkColumns = [
      {
        title: '商品信息',
        dataIndex: 'orderDetail',
        render: (text, record) => (
          <div>
            <div className={styles.bulkRowTitle}>
              <span>订单号：{get(record, ['orderId'])}</span>
              <span>发货状态：{get(record, ['shippingStatusName'])}</span>
            </div>
            <div className={styles.orderInfo}>
              <img src={get(text, ['0', 'pic'])} alt="" />
              <span>{get(text, ['0', 'name'])}</span>
            </div>
          </div>
        ),
        // width: 216,
      },
      {
        title: '数量',
        dataIndex: 'num',
        // width: 48,
      },
      {
        title: '收货人',
        dataIndex: 'consignee',
        // width: 80,
      },
      {
        title: '收货地址',
        dataIndex: 'orderAddress',
        // width: 184,
        render: text => (
          <div>{`${get(text, 'province', '  ')}/${get(text, 'city', '  ')}/${get(text, 'county', '  ')}/${get(text, 'address', '  ')}`}</div>
        ),
      },
      {
        title: '快递公司',
        dataIndex: 'expressCompany',
        width: 120,
        render: (text, record) => (
          <Select style={selectStyle} defaultValue="1" value={`${text}`} onChange={e => this.handleEdit('expressCompany', e, record)}>
            {expressCompanies}
          </Select>
        ),
      },
      {
        title: '结算方式',
        dataIndex: 'paymentMethod',
        width: 120,
        render: (text, record) => (
          <Select style={selectStyle} value={text} onChange={e => this.handleEdit('paymentMethod', e, record)}>
            <Option value="1">单次</Option>
            <Option value="2">月结</Option>
          </Select>
        ),
      },
      {
        title: '运费（元）',
        dataIndex: 'fee',
        width: 96,
        render: (text, record) => {
          const target = get(record, 'paymentMethod') === '2' ? get(record, 'postage') : get(record, 'fee');
          return get(record, 'paymentMethod') === '1' ? (
            <Input
              style={{ width: 80 }}
              placeholder="运费"
              onChange={e => this.handleEdit('fee', get(e, ['target', 'value']), record)}
              value={target}
            />
          ) : (
            <span>{get(record, 'postage')}</span>
          );
        },
      },
      {
        title: '快递单号',
        dataIndex: 'expressNumber',
        width: 168,
        render: (text, record) => {
          return (
            <Input
              style={{ width: 145 }}
              placeholder="快递单号"
              onChange={e => this.handleEdit('expressNumber', get(e, ['target', 'value']), record)}
            />
          );
        },
      },
    ];

    const repeatTableColumns = [
      {
        title: '快递单号',
        key: 'expressNumber',
        dataIndex: 'expressNumber',
        align: 'center',
      },
      {
        title: '订单号',
        key: 'orderCode',
        dataIndex: 'orderCode',
        align: 'center',
        render: text => {
          return (
            <div className={styles.infoBox}>
              {text.map(v => (
                <div key={get(v, ['id'])}>{get(v, ['orderCode'])}</div>
              ))}
            </div>
          );
        },
      },
      {
        title: '商品信息',
        key: 'info',
        dataIndex: 'info',
        align: 'center',
        render: text => {
          return (
            <div className={styles.infoBox}>
              {text.map(v => (
                <div key={get(v, ['id'])}>
                  <img className={styles.infoImage} src={get(v, ['orderDetail', '0', 'pic'])} alt="" />
                  <span>{get(v, ['orderDetail', '0', 'name'])}</span>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        title: '规格',
        key: 'spu',
        dataIndex: 'spu',
        align: 'center',
        render: text => {
          return (
            <div className={styles.infoBox}>
              {text.map(v => {
                const spec = get(v, ['orderDetail', '0', 'spec']) ? JSON.parse(get(v, ['orderDetail', '0', 'spec'])) : false;
                return (
                  <div key={get(v, ['id'])}>
                    <span>{spec ? `${get(spec, ['0', 'basisName'])}: ` : ':'}</span>
                    <span>{`${spec ? get(spec, ['0', 'basisValue']) : ''}`}</span>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '收货人',
        key: 'consignee',
        dataIndex: 'consignee',
        align: 'center',
        render: text => {
          return (
            <div className={styles.infoBox}>
              {text.map(v => (
                <div key={get(v, ['id'])}>{get(v, ['consignee'])}</div>
              ))}
            </div>
          );
        },
      },
      {
        title: '收货地址',
        key: 'address',
        dataIndex: 'address',
        align: 'center',
        render: text => {
          return (
            <div className={styles.infoBox}>
              {text.map(v => (
                <div key={get(v, ['id'])}>{`${get(v, ['orderAddress', 'province'], '  ')}/${get(v, ['orderAddress', 'city'], '  ')}/${get(v, ['orderAddress', 'county'], '  ')}/${get(v, ['orderAddress', 'address'],'  ')}`}</div>
              ))}
            </div>
          );
        },
      },
      {
        title: '发货状态',
        key: 'shippingStatusName',
        dataIndex: 'shippingStatusName',
        align: 'center',
        render: text => {
          return (
            <div className={styles.infoBox}>
              {text.map(v => (
                <div key={get(v, ['id'])}>{get(v, ['shippingStatusName'])}</div>
              ))}
            </div>
          );
        },
      },
      {
        title: '发货时间',
        key: 'shippingTime',
        dataIndex: 'shippingTime',
        align: 'center',
        render: text => {
          return (
            <div className={styles.infoBox}>
              {text.map(v => (
                <div key={get(v, ['id'])}>{get(v, ['shippingTime'])}</div>
              ))}
            </div>
          );
        },
      },
    ];

    return (
      <PageHeaderWrapper title="批量发货">
        <Card bordered={false} className={styles.bbNone}>
          <Row type="flex" justify="start" className={styles.bulkRow}>
            <Form.Item>
              {getFieldDecorator(`expressCompany`, { rules: [{ required: bulkSettingRequire, message: '批量发货快递公司必选' }] })(
                <Select placeholder="快递公司">{expressCompanies}</Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`paymentMethod`, { rules: [{ required: bulkSettingRequire, message: '批量发货结算方式必选' }] })(
                <Select placeholder="结算方式">
                  <Option value="1">单次</Option>
                  <Option value="2">月结</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {(paymentMethod === '1' || !paymentMethod) &&
                getFieldDecorator(`fee`, { rules: [{ required: bulkSettingRequire, message: '批量发货运费必填' }] })(
                  <Input placeholder="请输入运费" />
                )}
              {/* {paymentMethod === '2' && <span>运费（元）：15元</span>} */}
            </Form.Item>
            <Button className={styles.buttonI} onClick={this.handleBulkSet}>
              批量设置
            </Button>
          </Row>

          <Row>
            <Table
              rowSelection={rowSelection}
              className={styles.bulkTable}
              columns={bulkColumns}
              dataSource={mirrorData}
              pagination={pagination}
              align="center"
              loading={loading}
            />
          </Row>
          <div className={styles.btnRow}>
            <Button onClick={this.handleGoBack}>返回</Button>
            <Button className={`${styles.buttonI} ${styles.ml1}`} onClick={this.handleBulk}>
              批量发货
            </Button>
          </div>
        </Card>

        <Modal
          visible={visibleModal}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          title="快递单号重复"
          width={1128}
          height={560}
          bodyStyle={{ overflowY: 'scroll', height: 448 }}
          okText="继续发货"
          cancelText="取消"
        >
          <Table
            className={styles.nonePadding}
            rowSelection={repeatRowSelection}
            columns={repeatTableColumns}
            dataSource={repeatWaybillsFormat}
            pagination={false}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Bulk;
