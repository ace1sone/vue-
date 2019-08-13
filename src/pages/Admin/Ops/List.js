import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, Table, Input, Button } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './table.config';

const { Search } = Input;

@Form.create()
class List extends React.Component {
  componentDidMount() {
    this.goToPage(1, 20);
  }

  goToPage = (page, s) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ops/getOps',
      payload: {
        pageSize: s,
        currentPage: page,
        pageBar: {
          pageIndex: page,
          pageSize: s,
        },
      },
    });
  };

  handleSearch = () => {
    const { form, dispatch } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'ops/getOps',
          payload: {
            pageSize: 20,
            currentPage: 1,
            ...values,
          },
        });
      }
    });
  };

  deleteService = async id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ops/del',
      payload: { id },
      success: res => {
        if (res.header.code === 2000) this.handleSearch();
      },
    });
  };

  render() {
    const {
      servicedata,
      form: { getFieldDecorator },
    } = this.props;
    const { total = 0, currentPage = 1, pageSize = 20 } = servicedata || {};

    return (
      <PageHeaderWrapper title="停服维护管理">
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 24 }}>
            <div style={{ display: 'none' }}>
              <Form.Item>
                {getFieldDecorator('name', {
                  initialValue: '',
                })(<Search placeholder="请输入标题" style={{ width: 168 }} allowClear />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.handleSearch}>
                  搜索
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={this.handleClearForm} type="default">
                  清空
                </Button>
              </Form.Item>
            </div>
            <Button
              style={{ marginLeft: 'auto', float: 'right' }}
              type="primary"
              icon="plus"
              onClick={() =>
                router.push({
                  pathname: '/admin/ops/all/new',
                })
              }
            >
              新建
            </Button>
          </Form>
          <Table
            pagination={{
              total: total || 0,
              currentPage: currentPage || 1,
              onChange: this.goToPage,
              onShowSizeChange: this.goToPage,
              pageSize,
            }}
            columns={columns(this.deleteService)}
            dataSource={mapDataToCols(servicedata.list || [])}
            align="center"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ ops, loading }) => ({
  servicedata: ops.data,
  loading: loading.models.ops,
});

export default connect(mapStateToProps)(List);
