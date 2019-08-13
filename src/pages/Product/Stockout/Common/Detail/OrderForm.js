/* eslint-disable */
import React from 'react';
import { Card, Button, Form, Col, Row, Input, Table, message, Menu, Popconfirm } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import spuColumns from './TableColumns';

import SkuTableForm from '@/common/SkuTableForm';
import SpuDialog from '../SpuDialog';
import RejectDialog from '../RejectDialog';
import TopAlert from '../TopAlert';
import Records from '../Records';
import InvalidDialog from '../InvalidDialog';

import styles from './OrderForm.less';

const { TextArea } = Input;

const fieldLabels = {
  stockInNumber: '出库单号',
  status: '出库状态',
  rejectNumber: '驳回次数',
  description: '备注信息',
};

@Form.create()
class OrderForm extends React.Component {
  state = {
    width: '100%',
    spuModal: false,
    spuDatas: [],
    rejectDialog: false,
    invalidDialog: false,
    expandedRowKeys: [],
    disabled: false,
    showAction: 'new',
    detail: {},
    deleteList: [],
  };

  skuForm = [];

  componentDidMount() {
    this.handleLoadDetail();

    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stockout/clearDetail',
    });

    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onPageChange(current, size) {
    const { dispatch } = this.props;
    dispatch({
      type: 'stockout/getValidSpus',
      payload: {
        current,
        size,
      },
    });
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = async () => {
    const { dispatch, form } = this.props;
    let hasError = false;

    const {
      location: { id },
    } = this.props;

    const description = form.getFieldValue('description');
    const params = {
      dismissReason: '',
      invalidReason: '',
      proOutBoundDetailsAddDTOList: [],
      dismissNumber: 0,
      outboundStatus: 1,
      description,
    };

    if (this.skuForm.length === 0 || this.skuForm.every(ele => ele === null)) {
      message.error('请先添加SPU');
      return;
    }

    this.skuForm.forEach(ele => {
      if (ele) {
        const { hasEmptyRecord, hasDuplicateRecord, getRequestParams } = ele;

        if (hasEmptyRecord()) {
          hasError = true;
          message.error('Sku信息不能为空!');
          return;
        }
        if (!hasDuplicateRecord()) {
          const requestParams = getRequestParams();
          if (!_.isEmpty(requestParams)) {
            params.proOutBoundDetailsAddDTOList = params.proOutBoundDetailsAddDTOList.concat(requestParams);
          }
        } else {
          hasError = true;
          message.error('请修改重复的Sku信息!');
        }
      }
    });

    if (!hasError) {
      if (id) {
        const { detail, deleteList } = this.state;
        const originList = _.get(detail, 'proOutboundDetailsDTOList');
        const deletedList = originList.filter(v => deleteList.includes(v.id)).map(v => ({ ...v, delFlag: 1 }));
        const requestList = params.proOutBoundDetailsAddDTOList;
        const updateList = requestList.filter(v => originList.find(val => val.skuId === v.skuId && val.outboundNumber !== v.outboundNumber));
        const addedList = originList.length > 0 ? requestList.filter(v => isNaN(v.id)) : requestList.map(v => ({ ...v, id: undefined }));
        const resultList = updateList.concat(addedList).concat(deletedList);
        if (resultList) params.proOutBoundDetailsAddDTOList = resultList;
        params.proOutBoundDetailsAddDTOList = params.proOutBoundDetailsAddDTOList.map(v => (isNaN(v.id) ? { ...v, id: undefined } : v));
        await dispatch({ type: 'stockout/edit', payload: { ...params, id } });
      } else {
        await dispatch({ type: 'stockout/create', payload: params });
      }
      this.goBack();
    }
  };

  goBack = () => {
    router.goBack();
  };

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  handleLoadDetail = async () => {
    const { dispatch, location } = this.props;
    const { outboundStatus, id, action } = location;
    const { expandedRowKeys } = this.state;
    if (action === '1' || action === '3') {
      this.setState({ disabled: true, showAction: 'view' });
    }
    if (action === '2') {
      this.setState({ disabled: false, showAction: 'edit' });
    }

    if (!_.isEmpty(id) && !_.isEmpty(outboundStatus)) {
      const response = await dispatch({
        type: 'stockout/detail',
        payload: {
          id,
        },
      });
      const responseData = response.data;

      if (_.get(responseData, 'proSpuListDTORespList')) {
        responseData.proSpuListDTORespList.forEach(spuItem => {
          const outboundDetails = responseData.proOutboundDetailsDTOList.filter(p => p.spuId === spuItem.spuId);
          outboundDetails.forEach(item => {
            const tmpItem = item;
            const findedSkuInfo = spuItem.outBoundRespList.find(__ => __.skuId === item.skuId);
            if (findedSkuInfo) {
              tmpItem.basisDTOS = findedSkuInfo.skuDetailList;
            }
          });
          const tmpSpuItem = spuItem;
          tmpSpuItem.outboundRecords = outboundDetails;
        });
      }

      const spuDatas = _.get(responseData, 'proSpuListDTORespList');
      if (spuDatas) spuDatas.forEach(item => expandedRowKeys.push(item.spuId));
      this.setState({ detail: responseData, spuDatas, expandedRowKeys });
    }
  };

  // 动态form增加
  addSpuTable = async data => {
    const { spuId } = data;
    const { dispatch } = this.props;
    const res = await dispatch({ type: 'stockout/getSpuDetail', payload: { spuId } });
    const detail = res.data;

    let { spuDatas: oldSpu } = this.state;
    if (!oldSpu) {
      oldSpu = [];
    }
    // oldSpu.push(data);
    oldSpu.push(detail);
    const { form } = this.props;
    const { expandedRowKeys } = this.state;

    const spuInfo = form.getFieldValue('spuInfo');

    form.setFieldsValue({
      spuInfo,
    });

    // expandedRowKeys
    expandedRowKeys.push(data.spuId);
    this.setState({
      spuDatas: oldSpu,
      expandedRowKeys,
    });
  };

  // 动态form删除
  removeSpuTable = async row => {
    const { spuId } = row;
    const { form } = this.props;
    const spuInfo = form.getFieldValue('spuInfo');
    const newSpuInfo = spuInfo.filter(key => key.spuId !== spuId);

    const { deleteList } = this.state;
    const outboundRecords = _.isArray(row.outboundRecords) ? row.outboundRecords.map(v => v.id) : [];
    const nextDeleteList = new Set([...deleteList, ...outboundRecords]);

    form.setFieldsValue({
      spuInfo: newSpuInfo,
    });

    const { spuDatas: oldDatas, expandedRowKeys } = this.state;
    const filterDatas = oldDatas.filter(item => item.spuId !== spuId);
    this.setState({
      spuDatas: filterDatas,
    });

    // expandedRowKeys
    this.setState({
      spuDatas: filterDatas,
      expandedRowKeys: expandedRowKeys.filter(e => e.spuId !== spuId),
      deleteList: [...nextDeleteList],
    });
  };

  handleDeleteItem = record => {
    if (isNaN(record.id)) return;
    const { deleteList } = this.state;
    const nextDeleteList = new Set([...deleteList, record.id]);
    this.setState({ deleteList: [...nextDeleteList] });
  };

  handleApprove = async detail => {
    const { dispatch } = this.props;
    const { id, createBy } = detail;
    await dispatch({
      type: 'stockout/approvalOrReject',
      payload: {
        id,
        createBy,
        outboundStatus: 3, // outboundStatus = 2:驳回 3:通过审批
      },
    });
    this.goBack();
  };

  handleShowStatus = detail => {
    const { outboundStatus } = detail;
    let value;
    let color;
    switch (outboundStatus) {
      case 1:
        value = '待审批';
        color = { color: '#faad14' };
        break;
      case 2:
        value = '已驳回';
        color = { color: 'red' };
        break;
      case 3:
        value = '已入库';
        color = { color: '#52c41a' };
        break;
      case 4:
        value = '已作废';
        color = { color: 'grey' };
        break;
      default:
        value = '新建';
    }

    return <span style={color}>{value}</span>;
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      location: { action, outboundStatus },
      // action,
    } = this.props;

    const { width, rejectDialog, invalidDialog, spuDatas, expandedRowKeys, spuModal, showAction, disabled, detail } = this.state;

    // const { outboundStatus } = location;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };
    getFieldDecorator('spuInfo', { initialValue: _.get(detail, 'proSpuListDTORespList', []) });
    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        {(outboundStatus == '4' || outboundStatus == '2') && <TopAlert datas={detail} />}
        <Menu mode="horizontal" selectable defaultSelectedKeys={['basicInfo']} onClick={this.handleMenuClick} style={{ marginBottom: 20 }}>
          <Menu.Item key="basicInfo">基础信息</Menu.Item>
          <Menu.Item key="stockInfo">出库信息</Menu.Item>
          <Menu.Item key="operationRecord">操作记录</Menu.Item>
        </Menu>
        <div id="basicInfo" className={styles.card}>
          <Card title="基础信息" className={styles.card} bordered={false}>
            <Form align="left">
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.stockInNumber}>
                    <span className="ant-form-text">{detail.id}</span>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.status}>
                    {this.handleShowStatus(detail)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.rejectNumber}>
                    <span className="ant-form-text">{detail.dismissNumber || 0}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.description}>
                    {getFieldDecorator('description', {
                      initialValue: detail.description || 0,
                    })(<TextArea placeholder="请输入备注信息" style={{ width: 480, height: 88 }} disabled={disabled} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <div id="stockInfo" className={styles.card}>
          <Card title="出库信息" bordered={false} style={{ marginBottom: 40 }}>
            <Table
              columns={spuColumns({ removeSpuTable: this.removeSpuTable }, disabled)}
              rowKey="spuId"
              dataSource={spuDatas}
              pagination={false}
              expandedRowKeys={expandedRowKeys}
              expandedRowRender={(record, i) => {
                return (
                  <SkuTableForm
                    spuInfo={record}
                    inStock={false}
                    action={showAction}
                    specStandardList={record.specStandardDTOList}
                    defaultSkuList={record.outboundRecords || []}
                    skuStockList={record.outBoundRespList || []}
                    ref={el => {
                      this.skuForm[i] = el;
                    }}
                    deleteItemCallback={this.handleDeleteItem}
                  />
                );
              }}
              onExpandedRowsChange={keys => {
                this.setState({
                  expandedRowKeys: keys,
                });
              }}
            />
            <Button className={styles['add-spu-btn']} type="dashed" disabled={disabled} icon="plus" onClick={() => this.setState({ spuModal: true })}>
              添加SPU
            </Button>
            <SpuDialog visible={spuModal} onCancel={() => this.setState({ spuModal: false })} onAdd={this.addSpuTable} spuDatas={spuDatas} />
          </Card>
        </div>
        <div id="operationRecord" className={styles.card}>
          <Card title="操作记录" bordered={false} style={{ marginBottom: 40 }}>
            <Records dataSource={detail.proOperationLogDTOList} />
          </Card>
        </div>
        <FooterToolbar
          style={{ width }}
          extra={
            outboundStatus === '1' &&
            action !== '3' && (
              <Button type="danger" onClick={() => this.setState({ invalidDialog: true })} style={{ marginRight: 'auto' }}>
                作废
              </Button>
            )
          }
        >
          <Button onClick={() => this.goBack()}>取消</Button>
          {outboundStatus === '1' && action !== '3' && <Button onClick={() => this.setState({ rejectDialog: true })}>驳回</Button>}
          {outboundStatus === '1' && action !== '3' && (
            <Popconfirm title="确认审批通过吗" onConfirm={() => this.handleApprove(detail)}>
              <Button type="primary">审批通过</Button>
            </Popconfirm>
          )}
          {(!outboundStatus || outboundStatus === '2') && action !== '3' && (
            <Button type="primary" onClick={this.validate} loading={submitting}>
              提交
            </Button>
          )}
        </FooterToolbar>
        <RejectDialog visible={rejectDialog} onClose={() => this.setState({ rejectDialog: false })} rejectData={detail} />
        <InvalidDialog visible={invalidDialog} onClose={() => this.setState({ invalidDialog: false })} invalidData={detail} />
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ stockout, loading }) => ({
  stockout,
  submitting: loading.effects['stockout/addOrEditStockinOrder'],
}))(OrderForm);
