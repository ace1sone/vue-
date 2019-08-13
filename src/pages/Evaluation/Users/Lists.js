import React from 'react';
import {
  Card,
  Button,
  List,
  Skeleton,
  Select,
  Form,
  Input,
  notification,
  Modal
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import _ from 'lodash';

import styles from './Lists.less';

class Lists extends React.Component {
  state = {
    currentPage: 0,
    customerName: '',
    customerMark: '',
    customerStatus: null,
    tags: [],
    customerName: ''
  };

  componentDidMount() {
    this.goToPage(0, 20);
    this.loadTags();
  }

  loadTags = async () => {
    const { dispatch } = this.props;
    const response = await dispatch({
      type: 'customer/searchTags'
    });
    this.setState({
      tags: _.get(response, 'data.marks', []),
    });
  };

  goToPage = async (page, size) => {
    const { dispatch } = this.props;
    const { customerName, customerMark, customerStatus } = this.state;
    await dispatch({
      type: 'customer/searchUsers',
      payload: {
        customerName,
        customerMark,
        customerStatus,
        pageBar: {
          pageIndex: page > 0 ? page - 1 : page,
          pageSize: size,
        },
      },
    });
  };


  handleChangeSearchKeyword = e => {
    this.setState({ customerName: e.target.value });
  };

  handleSearch = () => {
    const { dispatch, customer } = this.props;
    const { size } = customer;
    const { currentPage } = this.state;
    if (_.isEmpty(this.state.customerName)) {
      notification.error({ message: '搜索内容不能为空' });
      return;
    }
    const { customerName, customerMark, customerStatus } = this.state;

    const payload = {
      customerName,
      customerMark,
      customerStatus,
      pageBar: {
        pageIndex: currentPage,
        pageSize: size || 20,
      },
    };

    dispatch({
      type: 'customer/searchUsers',
      payload,
    });
  };

  createActionBtn = item => [

    item.status.code === '2' ? (
      <Button icon="edit" onClick={() => this.unfreeze(item)}>
        解封
      </Button>
    ) : (
        <Button icon="edit" onClick={() => this.freeze(item)}>
          封禁
      </Button>
      ),
  ];

  unfreeze(item) {
    const { dispatch } = this.props;
    const { confirm } = Modal;
    if (!item) {
      return;
    }
    confirm({
      title: '确定要解禁?',
      content: item.customerName,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await dispatch({ type: 'complaint/sealUser', payload: {customerStatusEnum:1, customerStatus: 1, ...item } });
        this.goToPage(0, 20);
      },
    });
  }

  freeze = item => {
    const { dispatch } = this.props;
    const { confirm } = Modal;
    if (!item) {
      return;
    }
    confirm({
      title: '确定要封禁该用户?',
      content: item.customerName,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await dispatch({ type: 'complaint/sealUser', payload: {customerStatusEnum:2, customerStatus: 2, ...item } });
        this.goToPage(0, 20);
      },
    });
  };

  handleChangeStatus = val => {
    const { dispatch } = this.props;
    this.setState({ customerStatus: val });
    dispatch({
      type: 'customer/searchUsers',
      payload: {
        ...this.state,
        customerStatus: val,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        },
      },
    });
  };

  handleChangeCustomerMark = e => {
    const { dispatch } = this.props;
    // if (!e) return;
    this.setState({ customerMark: e });
    dispatch({
      type: 'customer/searchUsers',
      payload: {
        ...this.state,
        customerMark: e,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        },
      },
    });
  };

  getMarks = val => {
    let intro = '';
    if (!_.isNull(val.customerMarks)) {
      if(!_.isUndefined(val.customerMarks)){
        let marks = Object.values(val.customerMarks);
        for(var i= 0; i < marks.length; i ++ ){
          if(i < 2){
            intro += marks[i] + "|";
          }
        }
        if(marks.length > 2){
          intro += marks.length + '个标签';
        }else{
          intro = intro.substring(0,intro.length - 1);
        }
      }
    }
    return  intro;
  };

  renderSimpleForm() {
    return (
      <div>
        <Form layout="inline">
          <Form.Item>
            <Input
              placeholder="昵称"
              value={this.state.customerName}
              onChange={this.handleChangeSearchKeyword}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.handleSearch} type="primary" icon="search">
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="选择状态"
              style={{ width: '100px' }}
              value={this.state.customerStatus}
              onChange={this.handleChangeStatus}
            >
              <Select.Option value={null}>所有状态</Select.Option>
              <Select.Option value="2">封禁</Select.Option>
              <Select.Option value="1">解封</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="选择标签"
              style={{ width: '120px' }}
              value={this.state.customerMark}
              onChange={this.handleChangeCustomerMark}
            >
              <Select.Option value="">所有标签</Select.Option>
              {this.state.tags.map(option => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    const { customer } = this.props;
    const { data, loading } = customer;
    const { evaluationStatisticsResults, pageBar } = data;
    const { dataCount = 0, pageIndex = 1, pageSize = 20 } = pageBar || {};
    return (
      <PageHeaderWrapper title="用户列表">
        <Card>
          <div className={styles.header}>{this.renderSimpleForm()}</div>
          <List
            itemLayout="horizontal"
            size="large"
            dataSource={evaluationStatisticsResults}
            pagination={{
              total: dataCount || 0,
              current: pageIndex + 1 || 1,
              showSizeChanger: true,
              onChange: this.goToPage,
              onShowSizeChange: this.goToPage,
              pageSizeOptions: ['20'],
              pageSize: pageSize,
            }}
            bordered
            loading={loading}
            renderItem={item => (
              <List.Item actions={this.createActionBtn(item)}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <div>
                    <p>
                      <a onClick={() => router.push(`/eval/users/users/edit/${item.customerId}`)}>
                        {item.customerName}
                      </a>{' '}
                      {this.getMarks(item)}
                    </p>
                    {item.evaluationStatisticsDTO && (
                      <div>
                        <p>
                          累计鉴定 {item.evaluationStatisticsDTO.evaluationTotal || 0} 次，{' '}
                          {item.evaluationStatisticsDTO.evaluationTrueTotal || 0} 真，{' '}
                          {item.evaluationStatisticsDTO.evaluationFalseTotal || 0} 假，
                          {item.evaluationStatisticsDTO.nonEvaluationTotal || 0} 无法鉴定，{' '}
                          {item.evaluationStatisticsDTO.reportTotal || 0}举报
                        </p>
                        <p>{item.evaluationStatisticsDTO.firstEvaluationAt} 注册</p>
                      </div>
                    )}
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ customer }) => ({
  customer,
}))(Lists);
