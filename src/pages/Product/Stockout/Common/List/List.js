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

@connect(({ stockout, loading }) => ({
  stockout,
  loading: loading.models.stockout,
}))
@Form.create()
class List extends React.Component {
  state = {};

  static defaultProps = {
    addOrders: false,
  };

  componentDidMount() {
    const { dispatch, stockout, title } = this.props;
    const { current, size } = stockout;
    const outboundStatus = this.handleoutboundStatus(title);
    if (current === 1) {
      dispatch({
        type: 'stockout/clearList',
      });
    }
    dispatch({
      type: 'stockout/fetchList',
      payload: { current, size, outboundStatus },
    });
  }

  handleSearch = (e, size = 10) => {
    const { form, dispatch, title, addOrders } = this.props;

    let outboundStatus;
    let current;
    if (e) {
      outboundStatus = addOrders && e.target && e.target.value;
      current = _.isNumber(e) ? e : 1;
    }

    outboundStatus = this.handleoutboundStatus(title);

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { createOrApprove, rangeTime } = values;
        if (createOrApprove === 1 && rangeTime) {
          (values.createdBeginTime = rangeTime[0].format('YYYY-MM-DD')), (values.createdEndTime = rangeTime[1].format('YYYY-MM-DD'));
        }
        if (createOrApprove === 2 && rangeTime) {
          (values.updatedBeginTime = rangeTime[0].format('YYYY-MM-DD')), (values.updatedEndTime = rangeTime[1].format('YYYY-MM-DD'));
        }

        dispatch({
          type: 'stockout/fetchList',
          payload: {
            current,
            size,
            outboundStatus,
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
      type: 'stockout/exportExcel',
      payload: { id },
    });
  };

  handleoutboundStatus = title => {
    let outboundStatus = '';
    switch (title) {
      case '待审批':
        outboundStatus = 1;
        break;
      case '已驳回':
        outboundStatus = 2;
        break;
      case '已出库':
        outboundStatus = 3;
        break;
      case '已作废':
        outboundStatus = 4;
        break;
      default:
        outboundStatus = '';
    }
    return outboundStatus;
  };

  render() {
    const {
      stockout: { data },
      dispatch,
      loading,
      title,
      addOrders,
      form: { getFieldDecorator },
    } = this.props;
    const { records, total, pages, size, current } = data;
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
                })(<Search placeholder="请输入出库单号" className={styles.nobordInput} allowClear />)}
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
                  {getFieldDecorator('outboundStatus', {
                    initialValue: '',
                  })(
                    <Select style={{ width: 168 }}>
                      <Option value="">请选择出库单状态</Option>
                      <Option value={1}>待审核</Option>
                      <Option value={2}>已驳回</Option>
                      <Option value={3}>已出库</Option>
                      <Option value={4}>已作废</Option>
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
                <Button className={styles['btn-new']} type="primary" icon="plus" onClick={() => router.push('/product/stockout/outorders/new')}>
                  新建出库
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
            dataSource={mapDataToCols(records)(baseIndex)}
            pagination={pagination}
            align="center"
            loading={loading}
            rowKey={record=>record.id}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
