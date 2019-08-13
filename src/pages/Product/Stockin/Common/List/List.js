import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Card, Table, Input, Button, DatePicker, Form, Select } from 'antd';

import _ from 'lodash';
import styles from './List.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';

const { Search } = Input;

const { Option } = Select;

@connect(({ stockin, loading }) => ({
  stockin,
  loading: loading.models.stockin,
}))
@Form.create()
class List extends React.Component {
  state = {};

  static defaultProps = {
    addOrders: false,
  };

  componentDidMount() {
    const { dispatch, stockin, title } = this.props;
    const { current = 1, size = 10 } = stockin;
    const receiptStatus = this.handleReceiptStatus(title);
    if (current === 1) {
      dispatch({
        type: 'stockin/clearList',
      });
    }

    dispatch({
      type: 'stockin/fetchList',
      payload: { current, size, receiptStatus },
    });
  }

  handleSearch = (e, size = 10) => {
    const { form, dispatch, title, addOrders } = this.props;

    let receiptStatus;
    let current;
    if (e) {
      receiptStatus = addOrders && e.target && e.target.value;
      current = _.isNumber(e) ? e : 1;
    }

    receiptStatus = this.handleReceiptStatus(title);

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { createOrApprove, rangeTime } = values;
        if (createOrApprove === 1 && rangeTime) {
          (values.createAtStart = rangeTime[0].format('YYYY-MM-DD HH:mm:ss')), (values.createAtEnd = rangeTime[1].format('YYYY-MM-DD HH:mm:ss'));
        }
        if (createOrApprove === 2 && rangeTime) {
          (values.updateAtStart = rangeTime[0].format('YYYY-MM-DD HH:mm:ss')), (values.updateAtEnd = rangeTime[1].format('YYYY-MM-DD HH:mm:ss'));
        }

        dispatch({
          type: 'stockin/fetchList',
          payload: {
            current,
            size,
            receiptStatus,
            ...values,
          },
        });
      }
    });
  };

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleExportExcel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'stockin/exportExcel',
      payload: { id },
    });
  };

  handleReceiptStatus = title => {
    let receiptStatus = '';
    switch (title) {
      case '待审批':
        receiptStatus = 1;
        break;
      case '已驳回':
        receiptStatus = 2;
        break;
      case '已入库':
        receiptStatus = 3;
        break;
      default:
        receiptStatus = '';
    }
    return receiptStatus;
  };

  render() {
    const {
      stockin: { data },
      dispatch,
      loading,
      title,
      addOrders,
      form: { getFieldDecorator },
    } = this.props;
    const { records: list, total, pages, size, current } = data;
    const pagination = {
      onChange: this.handleSearch,
      total: total ? parseInt(total, 10) : null,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };

    const baseIndex = (current - 1) * size;

    return (
      <PageHeaderWrapper title={title}>
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 24 }}>
            <Row style={{ marginBottom: '1rem' }}>
              <Form.Item>
                {getFieldDecorator('id', {
                  initialValue: '',
                })(<Search placeholder="请输入 入库单号" style={{ width: 168 }} allowClear />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('createOrApprove', {
                  initialValue: 1,
                })(
                  <Select style={{ width: 168 }}>
                    <Option value={1}>创建时间</Option>
                    <Option value={2}>审批时间</Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item>{getFieldDecorator('rangeTime')(<DatePicker.RangePicker showTime allowClear />)}</Form.Item>
              {addOrders && (
                <Form.Item>
                  {getFieldDecorator('receiptStatus', {
                    initialValue: '',
                  })(
                    <Select style={{ width: 168 }}>
                      <Option value="">请选择入库单状态</Option>
                      <Option value={1}>待审核</Option>
                      <Option value={2}>已驳回</Option>
                      <Option value={3}>已入库</Option>
                    </Select>
                  )}
                </Form.Item>
              )}
            </Row>

            <Row>
              <Button className={styles['btn-search']} type="primary" onClick={this.handleSearch}>
                搜索
              </Button>
              <Button onClick={this.handleClearForm} type="default" style={{ marginLeft: 24 }}>
                清空
              </Button>
              {addOrders && (
                <Button className={styles['btn-new']} type="primary" icon="plus" onClick={() => router.push('/product/stockin/inorders/new')}>
                  新建入库
                </Button>
              )}
            </Row>
          </Form>
          <Table
            columns={getColumns(
              {
                handleExportExcel: this.handleExportExcel,
              },
              addOrders
            )}
            dataSource={mapDataToCols(list)(baseIndex)}
            pagination={pagination}
            align="center"
            loading={loading}
            rowKey="id"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
