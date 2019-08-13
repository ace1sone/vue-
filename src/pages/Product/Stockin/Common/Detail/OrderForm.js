/* eslint-disable no-unused-expressions */
import React from 'react';
import { Card, Button, Form, Col, Row, Input, Table, Menu, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import spuColumns from './TableColumns';
import SpuDialog from '../SpuDialog';
import RejectDialog from '../RejectDialog';
import TopAlert from '../TopAlert';
import Records from '../Records';
import SkuTableForm from '@/common/SkuTableForm';

import styles from './OrderForm.less';

const { TextArea } = Input;

const fieldLabels = {
  stockInNumber: '入库单号',
  status: '入库状态',
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
    expandedRowKeys: [],
    detail: {},
    receipInSpus: {},
    disabled: false,
    showAction: 'new',
    deleteList: [],
  };

  skuForm = [];

  basicInfo = {
    channelType: 1,
    sellerId: 10001,
    sellerName: 10001,
  };

  componentDidMount() {
    this.handleLoadDetail();
  }

  validate = async (receiptStatus, id) => {
    const { dispatch, form } = this.props;

    const {
      detail: { dismissDescription },
      deleteList,
    } = this.state;

    const description = form.getFieldValue('description');

    const params = {
      dismissNumber: '',
      receiptStatus: 1,
      receiptDetailsDTOList: [],
      description,
      operationLogDTO: {
        description: '',
      },
      deleteList: deleteList.filter(v => _.isNumber(v)),
    };

    if (this.skuForm.length === 0 || this.skuForm.every(ele => ele === null)) {
      message.error('请先添加SPU');
      return;
    }

    let hasError = false;

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
            params.receiptDetailsDTOList = params.receiptDetailsDTOList.concat(requestParams);
          }
        } else {
          hasError = true;
          message.error('请修改重复的Sku信息!');
        }
      }
    });

    if (!hasError) {
      if (receiptStatus === '2') {
        await dispatch({
          type: 'stockin/edit',
          payload: {
            ...params,
            ...this.basicInfo,
            id,
            dismissDescription,
          },
        });
      } else {
        await dispatch({
          type: 'stockin/addOrEditStockinOrder',
          payload: params,
        });
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
    const { receiptStatus, id, action } = location;
    const { expandedRowKeys } = this.state;

    if (action === '1' || action === '3') {
      this.setState({ disabled: true, showAction: 'view' });
    }
    if (action === '2') {
      this.setState({ disabled: false, showAction: 'edit' });
    }

    if (!_.isEmpty(id) && !_.isEmpty(receiptStatus)) {
      const response = await dispatch({
        type: 'stockin/detail',
        payload: {
          id,
          receiptStatus,
        },
      });

      const responseData = response.data;

      const receipInSpus = {};
      if (_.get(responseData, 'receiptDetailsDTOList')) {
        responseData.receiptDetailsDTOList.forEach(item => {
          const spuItemList = receipInSpus[item.spuId] || [];
          spuItemList.push(item);
          receipInSpus[item.spuId] = spuItemList;
        });
      }
      const spuDatas = _.get(responseData, 'spuDTOS') || [];
      spuDatas.forEach(item => expandedRowKeys.push(item.spuId));
      this.setState({ detail: responseData, receipInSpus, spuDatas, expandedRowKeys });
    }
  };

  // 增加
  addSpuTable = async data => {
    const { spuId } = data;
    const { dispatch } = this.props;
    const res = await dispatch({ type: 'stockin/getSpuDetail', payload: { spuId } });
    const detail = res.data;

    const { spuDatas: oldSpu } = this.state;
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

  // 删除
  removeSpuTable = async row => {
    const { spuId } = row;
    const { form } = this.props;
    const { detail, deleteList } = this.state;
    const spuInfo = form.getFieldValue('spuInfo');
    const newSpuInfo = spuInfo.filter(key => key.spuId !== spuId);

    const originList = detail.receiptDetailsDTOList || [];
    const deletedList = originList.filter(v => v.spuId === row.spuId).map(v => v.id);
    const nextDeleteList = new Set([...deleteList, ...deletedList]);

    form.setFieldsValue({
      spuInfo: newSpuInfo,
    });

    const { spuDatas: oldDatas, expandedRowKeys } = this.state;
    const filterDatas = oldDatas.filter(item => item.spuId !== spuId);

    // expandedRowKeys
    this.setState({
      spuDatas: filterDatas,
      expandedRowKeys: expandedRowKeys.filter(e => e.spuId !== spuId),
      deleteList: [...nextDeleteList],
    });
  };

  handleDeleteItemCallback = item => {
    const { deleteList } = this.state;
    const { id } = item;
    const next = new Set([...deleteList, id]);
    this.setState({ deleteList: [...next] });
  };

  handleReject = () => {
    this.setState({ rejectDialog: true });
  };

  handleApprove = async detail => {
    const { dispatch } = this.props;
    const { id, createBy } = detail;
    await dispatch({
      type: 'stockin/approvalOrReject',
      payload: {
        ...this.basicInfo,
        id,
        createBy,
        receiptStatus: 3, // receiptStatus = 2:驳回 3:通过审批
      },
    });
    this.goBack();
  };

  handleShowStatus = detail => {
    const { receiptStatus } = detail;
    let value;
    let color;
    switch (receiptStatus) {
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
      default:
        value = '新建';
    }

    return <span style={color}>{value}</span>;
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      location,
    } = this.props;

    const { width, rejectDialog, spuDatas, expandedRowKeys, spuModal, detail, receipInSpus, disabled, showAction } = this.state;
    const { receiptStatus, id, action } = location;
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
    const formItemLayout2 = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };

    getFieldDecorator('spuInfo', { initialValue: _.get(detail, 'specStandardDTOList', []) });
    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        {!_.isEmpty(detail.dismissDescription) && receiptStatus === '2' && <TopAlert datas={detail.dismissDescription} />}
        <Menu mode="horizontal" selectable defaultSelectedKeys={['basicInfo']} onClick={this.handleMenuClick} style={{ marginBottom: 20 }}>
          <Menu.Item key="basicInfo">基础信息</Menu.Item>
          <Menu.Item key="stockInfo">入库信息</Menu.Item>
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
                  <Form.Item {...formItemLayout2} label={fieldLabels.description}>
                    {getFieldDecorator('description', {
                      initialValue: detail.description,
                    })(<TextArea placeholder="请输入备注信息" style={{ width: 828, height: 88 }} disabled={disabled} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <div id="stockInfo" className={styles.card}>
          <Card title="入库信息" bordered={false} style={{ marginBottom: 40 }}>
            <Table
              columns={spuColumns({ removeSpuTable: this.removeSpuTable }, disabled)}
              rowKey={item=>item.spuId}
              dataSource={spuDatas}
              pagination={false}
              expandedRowKeys={expandedRowKeys}
              expandedRowRender={(record, i) => (
                <SkuTableForm
                  spuInfo={record}
                  action={showAction}
                  specStandardList={record.specStandardDTOList}
                  defaultSkuList={receipInSpus[record.spuId] || []}
                  ref={el => {
                    this.skuForm[i] = el;
                  }}
                  deleteItemCallback={this.handleDeleteItemCallback}
                />
              )}
              onExpandedRowsChange={keys => {
                this.setState({
                  expandedRowKeys: keys,
                });
              }}
            />
            <Button className={styles['add-spu-btn']} type="dashed" icon="plus" onClick={() => this.setState({ spuModal: true })} disabled={disabled}>
              添加SPU
            </Button>
            <SpuDialog visible={spuModal} onCancel={() => this.setState({ spuModal: false })} onAdd={this.addSpuTable} spuDatas={spuDatas} />
          </Card>
        </div>
        <div id="operationRecord" className={styles.card}>
          <Card title="操作记录" bordered={false} style={{ marginBottom: 40 }}>
            <Records dataSource={detail.proOperationLogDTOS} />
          </Card>
        </div>
        <FooterToolbar style={{ width }}>
          <Button onClick={() => this.goBack()}>取消</Button>
          {receiptStatus === '1' && action !== '3' && <Button onClick={() => this.handleReject()}>驳回</Button>}
          {receiptStatus === '1' && action !== '3' && (
            <Popconfirm title="确认审批通过吗" onConfirm={() => this.handleApprove(detail)}>
              <Button type="primary">审批通过</Button>
            </Popconfirm>
          )}
          {(!receiptStatus || receiptStatus === '2') && action !== '3' && (
            <Button type="primary" onClick={() => this.validate(receiptStatus, id)} loading={submitting}>
              提交
            </Button>
          )}
        </FooterToolbar>
        <RejectDialog visible={rejectDialog} onClose={() => this.setState({ rejectDialog: false })} rejectData={detail} />
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ stockin, loading }) => ({
  stockin,
  loading,
  submitting: loading.effects['stockin/addOrEditStockinOrder'],
}))(OrderForm);
