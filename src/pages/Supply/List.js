/* eslint-disable */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Divider, Tag, Button, Input, Popconfirm } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import _ from 'lodash';

import { inject } from '@/config';
import { Utils } from '@/shared/utility';

import ListForm from './ListForm';
import styles from './List.less';

const { Column, ColumnGroup } = Table;

class _SearchForm extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch: _.noop,
  };

  form = new ListForm(this.props.form);

  handleSubmit = async e => {
    const { onSearch } = this.props;
    e.preventDefault();
    const values = await this.form.validate();
    onSearch(values);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className={styles.searchForm}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="模糊查询">
              {getFieldDecorator(...this.form.fuzzy)(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const SearchForm = Form.create(ListForm.options)(_SearchForm);

@connect(({ supply, loading }) => ({
  supplies: supply.supplies,
  loading: loading.effects['supply/load'],
}))
class ListPage extends Component {
  eventService = inject('eventService');

  state = {
    pagination: {
      current: 1,
    },
  };

  activeQuery = {};

  activeSorter;

  componentDidMount() {
    this.handleTableChange(this.state.pagination);
    this.eventService.on('supply-created', this.handleSupplyCreated, this);
  }

  componentWillUnmount() {
    this.eventService.remove('supply-created', this.handleSupplyCreated, this);
  }

  handleSupplyCreated() {
    this.handleTableChange(this.state.pagination, undefined, this.activeSorter);
  }

  handleTableChange = async (pagination, filters, sorter) => {
    this.activeSorter = sorter;
    const result = await this.props.dispatch({
      type: 'supply/query',
      payload: [pagination.current, this.activeQuery, Utils.toOrder(sorter)],
    });
    this.setState({ pagination: { ...pagination, ..._.pick(result, ['total', 'pageSize']) } });
  };

  handleSearch = query => {
    this.activeQuery = query;
    this.handleTableChange({ ...this.state.pagination, current: 1 }, undefined, this.activeSorter);
  };

  handleFreeze(supply) {
    console.log(supply);
  }

  render() {
    const { supplies, loading, location, children } = this.props;
    const { pagination } = this.state;
    return (
      <Fragment>
        <div
          className={styles.supplyListPage}
          style={{ display: location.pathname === '/supply/list' ? 'block' : 'none' }}
        >
          <SearchForm onSearch={this.handleSearch} />
          <div className={styles.operations}>
            <Link to="/supply/list/supply">添加供应商</Link>
          </div>
          <Table
            dataSource={supplies}
            loading={loading}
            rowKey="guid"
            pagination={pagination}
            onChange={this.handleTableChange}
          >
            <Column title="供应商编号" dataIndex="supplierId" key="supplierId" />
            <Column title="供应商名称" dataIndex="supplierName" key="supplierName" />
            <Column title="联系人" dataIndex="contactPerson" key="contactPerson" />
            <Column title="手机号码" dataIndex="mobileNo" key="mobileNo" />
            <Column title="公司电话" dataIndex="companyPhoneNo" key="companyPhoneNo" />
            <Column title="地址" dataIndex="address" key="address" />
            <Column title="详细地址" dataIndex="detailedAddress" key="detailedAddress" />
            <Column
              title="操作"
              key="action"
              render={(text, record) => (
                <span>
                  <Link to={`/supply/list/supply?id=${record.guid}`}>编辑</Link>
                  <Divider type="vertical" />
                  {record.status === 1 && (
                    <Popconfirm
                      title="确认要冻结吗？"
                      onConfirm={() => this.handleFreeze(record.guid)}
                    >
                      <a href="javascript:;">冻结</a>
                    </Popconfirm>
                  )}
                  {record.status === 3 && (
                    <Popconfirm
                      title="确认要解冻吗？"
                      onConfirm={() => this.handleFreeze(record.guid)}
                    >
                      <a href="javascript:;">解冻</a>
                    </Popconfirm>
                  )}
                </span>
              )}
            />
          </Table>
        </div>
        {this.props.children}
      </Fragment>
    );
  }
}

export default ListPage;
