import React from 'react';
import { Card, Button, Form, Col, Row, Input, Table, Radio, DatePicker, Modal, message, Checkbox, Spin, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import qs from 'query-string';
import moment from 'moment';
import { spuColumns, taskColumns } from '../Common/TableColumns';
import { taskStatus } from '../Common/SwitchForm';
import { formItemLayout, formItemLayoutWithOutLabel, registerData, formItemFillRow } from '../Common/FormLayout';
import SpuDialog from '../Common/SpuDialog';
import SkuDialog from '../Common/SkuDialog';
import ActivityDialog from '../Common/ActivityDialog';
import TaskDialog from '../Common/TaskDialog';
import AddressForm from '../Common/AddressForm';
import TaskData from './TaskData';
import TaskFooter from '../Common/TaskFooter';
import TabScrollSpy from '@/common/TabScrollSpy';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Detail.less';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const tenMinutes = 10 * 6 * 10000;

@Form.create()
class RandomdrawForm extends React.Component {
  state = {
    spuModal: false,
    spuId: '',
    skuModal: false,
    currentSpu: { skuRespList: [] },
    actModal: false,
    taskModal: false,
    addressData: [],
  };

  addrform = [];

  componentDidMount() {
    this.loadAddressList();
    this.loadRandomdraw();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'task/clearDetail', payload: {} });
  }

  goBack = () => {
    router.push('/activity/task/randomdraw/list');
  };

  loadRandomdraw = async () => {
    const { dispatch, location } = this.props;
    const { id } = qs.parse(location.search);
    if (!_.isEmpty(id)) {
      dispatch({ type: 'task/loadRandomdraw', payload: { id, type: 'DRAW' } });
    }
  };

  submit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll, getFieldValue },
      location,
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    const { id } = qs.parse(location.search);
    let correct = false;
    let hasError = false;

    validateFieldsAndScroll(async (error, values) => {
      const { time, spuInfo, actInfo, relatedTask, addrList, syncActivityTime, ...other } = values;
      // delSpuIds 删除商品 actInfo活动信息 spuInfo 商品信息 addrList 地址信息
      // 开始、结束时间校验
      if (!syncActivityTime && time && time.length > 0) {
        if (moment(time[0]).valueOf() <= moment(Date.now()).valueOf() + tenMinutes) {
          message.error('任务开始时间距当前事件不能少于10分钟!');
          return;
        }
        if (moment(time[1]).valueOf() <= moment(time[0]).valueOf() + tenMinutes) {
          message.error('任务结束时间距任务开始时间不能少于10分钟!');
          return;
        }
      }

      if (!addrList || !addrList.every(every => every.storeAddressId)) {
        message.error('请选择线下抽签地址设置!');
        return;
      }

      if (!actInfo.id) {
        message.error('请关联发售活动!');
        return;
      }

      if (relatedProducts && relatedProducts.length > 0) {
        correct = relatedProducts.every(item => {
          let hasAmt = false;
          if (item.skuRespList && item.skuRespList.some(__ => __.stock > 0)) {
            hasAmt = !hasAmt;
          } else {
            message.error(`SPUID：${item.spuId}的SKU库存数量不能为0`);
            hasAmt = false;
          }
          return hasAmt;
        });
      } else {
        correct = true;
      }

      this.addrform
        .filter(ele => ele)
        .forEach(item => {
          item.props.form.validateFields(err => {
            if (err) hasError = true;
          });
        });

      if (!error && correct && !hasError) {
        const params = {
          ...other,
          startTime: syncActivityTime ? '' : time[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: syncActivityTime ? '' : time[1].format('YYYY-MM-DD HH:mm:ss'),
          syncActivityTime,
          relatedProducts,
          activityId: actInfo.id,
          offlineDrawAddresses: addrList.map(ele => ({
            storeAddressId: ele.storeAddressId,
            offlineDrawTime: typeof ele.offlineDrawTime === 'string' ? ele.offlineDrawTime : ele.offlineDrawTime.format('YYYY-MM-DD HH:mm:ss.SSS'),
          })),
          relatedTask: relatedTask.id ? relatedTask : null,
          registrationInformation: ['NAME', 'PHONE', 'ID_TYPE', 'ID_NUMBER', 'OFFLINE_DRAW_ADDRESS'],
        };
        if (id) {
          await dispatch({
            type: 'task/editRandomdraw',
            payload: { ...params, id },
          });
        } else {
          await dispatch({
            type: 'task/randomdraw',
            payload: params,
          });
        }
        this.goBack();
      }
    });
  };

  editActivity = () => {
    this.setState({ actModal: true });
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      relatedProducts: [],
      time: undefined,
      syncActivityTime: false,
    });
  };

  addActivity = data => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ actInfo: data });
  };

  addSpuTable = data => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    const { spuId, ...other } = data;
    relatedProducts.push({ spuId, visibility: true, buyAbility: false, skuRespList: [], ...other });
    setFieldsValue({ relatedProducts });
  };

  removeSpuTable = async row => {
    const { spuId } = row;
    const { form, location } = this.props;
    const { id } = qs.parse(location.search);
    const relatedProducts = form.getFieldValue('relatedProducts');
    const newSpus = relatedProducts.filter(key => key.spuId !== spuId);
    const delSpuIds = form.getFieldValue('delSpuIds');
    if (!_.isEmpty(id)) {
      relatedProducts.forEach(every => {
        if (every.spuId === row.spuId) {
          delSpuIds.push(every.spuId);
        }
      });
    }
    form.setFieldsValue({
      relatedProducts: newSpus,
      delSpuIds: [...new Set(delSpuIds)],
    });
  };

  delete = () => {
    const { location, dispatch } = this.props;
    const { id } = qs.parse(location.search);
    Modal.confirm({
      title: '提示',
      content: '是否删除本次任务',
      onOk: async () => {
        await dispatch({ type: 'task/delete', payload: { id, type: 'DRAW' } });
        this.goBack();
      },
      okText: '确认',
      cancelText: '取消',
    });
  };

  onCrash = () => {
    const { location } = this.props;
    const { action } = qs.parse(location.search);
    if (!action) {
      Modal.confirm({
        title: '提示',
        content: '是否放弃本次新建任务',
        onOk: this.goBack,
        okText: '确认',
        cancelText: '取消',
      });
      return;
    }
    this.goBack();
  };

  showSkuDialog = item => {
    const { form } = this.props;
    const relatedProducts = form.getFieldValue('relatedProducts');
    this.setState({ skuModal: true, spuId: item.spuId, currentSpu: relatedProducts.find(ele => ele.spuId === item.spuId) });
  };

  handleSwitchChange = (record, name) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    setFieldsValue({
      relatedProducts: relatedProducts.map(ele => {
        if (ele.spuId === record.spuId) {
          const { visibility, buyAbility, ...other } = ele;
          if (name === 'visibility') return { visibility: !record[name], buyAbility, ...other };
          if (name === 'buyAbility') return { buyAbility: !record[name], visibility, ...other };
        }
        return ele;
      }),
    });
  };

  saveSkuform = (newskuRespList, spuId) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    setFieldsValue({
      relatedProducts: relatedProducts.map(ele => {
        if (ele.spuId === spuId) {
          const { skuRespList, ...other } = ele;
          return { skuRespList: newskuRespList, ...other };
        }
        return ele;
      }),
    });
  };

  handleStock = (sum, spuId) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    relatedProducts.forEach(every => {
      if (every.spuId === spuId) {
        const eve = every;
        eve.initSkuStock = sum;
      }
    });
    this.setState({ skuModal: false });
  };

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  handleAddTask = data => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ relatedTask: data });
  };

  removeTaskTable = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      relatedTask: {},
    });
  };

  showTaskDialog = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    if (!getFieldValue('actInfo').id) {
      message.error('请关联发售活动!');
    } else {
      this.setState({ taskModal: true });
    }
  };

  changeAddrDynamic = (v, name) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v && v.length > 0) {
      newData[name] = v.map(ele => ({ contentType: 'TEXT', ...ele }));
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  loadAddressList = async () => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'task/getAddress',
      payload: {},
    });
    if (!_.isEmpty(res.data)) {
      this.setState({ addressData: res.data });
    }
  };

  // 动态form增加
  addAddress = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([{}]);

    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  removeAddress = i => {
    const { form } = this.props;

    const keys = form.getFieldValue('keys');
    const addrList = form.getFieldValue('addrList');

    if (keys.length === 1) return;

    const nextKeys = keys.filter((key, idx) => idx !== i);
    const nextAddrList = addrList.filter((key, idx) => idx !== i);

    form.setFieldsValue({
      keys: nextKeys,
      addrList: nextAddrList,
    });
  };

  render() {
    const {
      task: { randomdrawDetail },
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      loading,
      location,
    } = this.props;

    const { spuModal, skuModal, spuId, currentSpu, actModal, taskModal, addressData } = this.state;
    const { action, id } = qs.parse(location.search);
    getFieldDecorator('relatedProducts', { initialValue: !_.isEmpty(randomdrawDetail.relatedProducts) ? randomdrawDetail.relatedProducts : [] });
    getFieldDecorator('delSpuIds', { initialValue: [] });
    getFieldDecorator('relatedTask', { initialValue: !_.isEmpty(randomdrawDetail.relatedTask) ? randomdrawDetail.relatedTask : {} });

    getFieldDecorator('actInfo', { initialValue: !_.isEmpty(randomdrawDetail.actInfo) ? randomdrawDetail.actInfo : {} });
    const actInfo = getFieldValue('actInfo');
    const relatedProducts = getFieldValue('relatedProducts');
    const relatedTask = getFieldValue('relatedTask');

    // 动态生成地址form
    getFieldDecorator('keys', { initialValue: randomdrawDetail.offlineDrawAddresses || [] });
    const keys = getFieldValue('keys');

    const addrForms = keys.map((k, i) => (
      <div key={k.storeAddressId || i} style={{ background: '#f9f9f9', marginBottom: 20, padding: 10, position: 'relative' }}>
        {getFieldDecorator(`addrList[${i}]`, {
          initialValue: k || {},
        })(
          <AddressForm
            addressData={addressData}
            action={action}
            index={i}
            wrappedComponentRef={ele => {
              this.addrform[i] = ele;
            }}
          />
        )}
        {action !== '1' && keys.length > 1 ? (
          <Button type="danger" onClick={() => this.removeAddress(i)} className={styles['add-delete-btn']}>
            删除
          </Button>
        ) : null}
      </div>
    ));

    const headerTabs = [
      {
        id: 'basicInfo',
        label: '基础信息',
      },
      {
        id: 'rulesInfo',
        label: '规则信息',
      },
      {
        id: 'product',
        label: '发售商品',
      },
      {
        id: 'limit',
        label: '上手限制',
      },
      {
        id: 'taskData',
        label: '任务数据',
      },
    ];

    return (
      <PageHeaderWrapper title={id ? '编辑任务' : '新建任务'} wrapperClassName={styles.advancedForm}>
        <TabScrollSpy tabs={headerTabs}>
          <Spin spinning={loading}>
            <div className={styles.card} id="basicInfo">
              <Card title="基础信息" bordered={false}>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="任务ID">
                      <span className="ant-form-text">{randomdrawDetail.id}</span>
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="任务状态">
                      {taskStatus(randomdrawDetail)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="任务标题">
                      {action !== '1' ? (
                        getFieldDecorator('title', {
                          initialValue: randomdrawDetail.title || '',
                          rules: [
                            {
                              required: true,
                              message: '任务标题必填的哦！',
                            },
                            { max: 30, message: '任务标题不能超过30个字!' },
                          ],
                        })(<Input placeholder="请输入任务标题,限制30字以内" />)
                      ) : (
                        <span className="ant-form-text">{randomdrawDetail.title}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="任务名称">
                      {action !== '1' ? (
                        getFieldDecorator('name', {
                          initialValue: randomdrawDetail.name || '',
                          rules: [
                            {
                              required: true,
                              message: '任务名称必填的哦！',
                            },
                            { max: 30, message: '任务名称不能超过30个字!' },
                          ],
                        })(<Input placeholder="请输入任务名称,限制30字以内" />)
                      ) : (
                        <span className="ant-form-text">{randomdrawDetail.name}</span>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="关联活动名称">
                      <span>{actInfo.title}</span> {actInfo.title && !id && <a onClick={this.editActivity}>修改</a>}
                      {_.isEmpty(actInfo) && (
                        <Button type="primary" onClick={() => this.setState({ actModal: true })}>
                          关联发售
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                  {actInfo.id && (
                    <Col lg={12} md={12} sm={24}>
                      <Form.Item {...formItemLayout} label="关联活动Id">
                        <span>{actInfo.id}</span>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
                <Row gutter={24}>
                  <Col sm={24}>
                    <Form.Item {...formItemFillRow} label="任务规则">
                      {action !== '1' ? (
                        getFieldDecorator('rule', {
                          initialValue: randomdrawDetail.rule || '',
                          rules: [
                            {
                              required: true,
                              message: '任务规则必填的哦！',
                            },
                            { max: 301, message: '任务规则不能超过300个字!' },
                          ],
                        })(<TextArea placeholder="添加任务规则，限制300字以内" style={{ width: 960, height: 88 }} />)
                      ) : (
                        <span className="ant-form-text">{randomdrawDetail.rule}</span>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </div>
            <div className={styles.card} id="rulesInfo">
              <Card title="规则信息" bordered={false}>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="任务时间设置">
                      {action !== '1' ? (
                        getFieldDecorator('syncActivityTime', {
                          initialValue: randomdrawDetail.syncActivityTime || false,
                          getValueFromEvent: val => {
                            if (val && actInfo.id) {
                              setFieldsValue({ time: [moment(actInfo.start), moment(actInfo.end)] });
                            } else {
                              message.error('尚未关联发售，无法同步时间!');
                              return !val;
                            }
                            return val.target.value;
                          },
                        })(
                          <Radio.Group>
                            <Radio value>同步关联活动</Radio>
                            <Radio value={false}>单独设置</Radio>
                          </Radio.Group>
                        )
                      ) : (
                        <span className="ant-form-text">{randomdrawDetail.syncActivityTime ? '同步关联活动' : '单独设置'}</span>
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayoutWithOutLabel}>
                      {action !== '1' ? (
                        getFieldDecorator('time', {
                          initialValue: randomdrawDetail.time || null,
                          rules: [
                            {
                              required: !getFieldValue('syncActivityTime'),
                              message: '时间必填的哦！',
                            },
                          ],
                        })(<RangePicker mode="month" showTime allowClear disabled={getFieldValue('syncActivityTime')} />)
                      ) : (
                        <div>
                          <span className="ant-form-text">
                            {randomdrawDetail.time && moment(randomdrawDetail.time[0]).format('YYYY-MM-DD HH:mm:ss')}
                          </span>
                          <span className="ant-form-text">
                            {randomdrawDetail.time && moment(randomdrawDetail.time[1]).format('YYYY-MM-DD HH:mm:ss')}
                          </span>
                        </div>
                      )}

                      <p style={{ color: 'red', fontSize: 16, lineHeight: '20px' }}>
                        任务结束时间一到，任务所关联的商品将变成不可购买的状态，请谨慎设置结束时间。
                      </p>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={24}>
                    <Form.Item {...formItemFillRow} label="登录信息选项">
                      {registerData.map(item => (
                        <Checkbox defaultChecked disabled key={item.value}>
                          {item.label}
                        </Checkbox>
                      ))}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <div className={styles.addressTitle}>线下抽签地址&地址时间设置</div>
                  <div className={styles.address}>{addrForms}</div>

                  {action !== '1' && (
                    <Button type="dashed" onClick={this.addAddress} className={styles['add-address-btn']}>
                      <Icon type="plus" />
                      添加地址
                    </Button>
                  )}
                </Row>
              </Card>
            </div>
            <div className={styles.card} id="product">
              <Card title="关联发售商品" bordered={false}>
                <Table
                  columns={spuColumns(this.removeSpuTable, this.showSkuDialog, this.handleSwitchChange, action)}
                  rowKey="spuId"
                  dataSource={relatedProducts || []}
                  pagination={false}
                  bordered
                />
                {!_.isEmpty(actInfo) && action !== '1' && (
                  <Button className={styles['add-spu-btn']} type="dashed" icon="plus" onClick={() => this.setState({ spuModal: true })}>
                    添加商品
                  </Button>
                )}
                <SpuDialog
                  visible={spuModal}
                  onCancel={() => this.setState({ spuModal: false })}
                  onAdd={this.addSpuTable}
                  spuDatas={relatedProducts || []}
                  actInfo={actInfo}
                />
                <SkuDialog visible={skuModal} onCancel={this.handleStock} onSave={this.saveSkuform} spuObj={{ spuId, id, currentSpu, action }} />
                <ActivityDialog visible={actModal} actInfo={actInfo} onCancel={() => this.setState({ actModal: false })} onAdd={this.addActivity} />
              </Card>
            </div>
            <div className={styles.card} id="limit">
              <Card title="任务上手限制" bordered={false}>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="任务是否直接可做">
                      {action !== '1' ? (
                        getFieldDecorator('restriction', {
                          initialValue: randomdrawDetail.restriction || 'NO_RESTRICTION',
                        })(
                          <Radio.Group onChange={e => e.target.value === 'NO_RESTRICTION' && this.removeTaskTable()}>
                            <Radio value="NO_RESTRICTION">直接可做</Radio>
                            <Radio value="AFTER_OTHER_TASK">完成其他任务后</Radio>
                          </Radio.Group>
                        )
                      ) : (
                        <span className="ant-form-text">{relatedTask.id ? '完成其他任务后' : '直接可做'}</span>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                {relatedTask.id ? (
                  <Table
                    columns={taskColumns(this.removeTaskTable, action)}
                    rowKey="id"
                    dataSource={[relatedTask] || []}
                    pagination={false}
                    bordered
                  />
                ) : (
                  <Row gutter={24}>
                    <Col lg={12} md={12} sm={24}>
                      <Form.Item {...formItemLayout} label="任务可做条件">
                        {action !== '1' && (
                          <Button
                            type="primary"
                            disabled={getFieldValue('restriction') === 'NO_RESTRICTION'}
                            onClick={this.showTaskDialog}
                            loading={loading}
                          >
                            请选择
                          </Button>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                <TaskDialog
                  visible={taskModal}
                  taskData={relatedTask}
                  onAdd={this.handleAddTask}
                  actInfo={actInfo}
                  onCancel={() => this.setState({ taskModal: false })}
                />
              </Card>
            </div>
            <div className={styles.card} style={{ paddingBottom: 60 }} id="taskData">
              <TaskData detail={randomdrawDetail} onRefrech={this.loadRandomdraw} />
            </div>
            <TaskFooter action={action} loading={loading} goBack={this.goBack} onCrash={this.onCrash} onDelete={this.delete} submit={this.submit} />
          </Spin>
        </TabScrollSpy>
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ task, loading }) => ({
  task,
  loading: loading.models.task,
}))(RandomdrawForm);
