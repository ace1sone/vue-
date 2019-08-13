import React from 'react';
import {
  Row,
  Col,
  Card,
  Select,
  Skeleton,
  Button,
  List,
  notification,
  Badge,
  Avatar,
  Popover,
  Tag
} from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class Edit extends React.Component {
  state = {
    loading1: true,
    loading2: true,
    customerId: '',
    list: [],
    listEnd: false,
    comments: [],
    commentsEnd: false,
    showTag: false,
    allTags: [],
    userTags: [],
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    this.setState({
      loading1: false,
      loading2: false,
      customerId: params.id,
    });
    dispatch({
      type: 'customer/getMainRecords',
      payload: {
        customerId: params.id,
        topNum: 20,
      },
    });
    this.loadTags();
    this.onLoadMore();
    this.onLoadMoreComments();
  }

  loadTags = async () => {
    const { dispatch } = this.props;

    const response = await dispatch({
      type: 'customer/searchTags',
      payload: { "disable": false }
    });
    this.setState({
      allTags: _.get(response, 'data.marks', []),
    });
  };

  onLoadMore = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'customer/getUserRecords',
      payload: {
        customerId: params.id,
        topNum: 20,
        evaluationId: !_.isEmpty(this.state.list)
          ? this.state.list[this.state.list.length - 1].evaluationOrderId
          : '',
      },
      success: res => {
        const hislist = _.get(res, 'data.evaluationHistorys', []);
        const list = this.state.list.concat(hislist);
        this.setState({
          list: list,
          listEnd: _.isEmpty(hislist) ? true : false,
        });
      },
    });
  };

  onLoadMoreComments = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'customer/getUserRecords',
      payload: {
        customerId: params.id,
        topNum: 20,
        commentId: !_.isEmpty(this.state.comments)
          ? this.state.comments[this.state.comments.length - 1].commentId
          : '',
      },
      success: res => {
        const commlist = _.get(res, 'data.comments', []);
        const comments = this.state.comments.concat(commlist);
        this.setState({
          comments: comments,
          commentsEnd: _.isEmpty(commlist) ? true : false,
        });
      },
    });
  };

  genResult(val) {
    return val.message;
  }

  handleChangeTag = value => {
    this.setState({ userTags: value });
  };

  saveUserTag = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (_.isEmpty(this.state.userTags)) {
      this.setState({ showTag: false });
      return;
    }
    let marks = _.map(
      this.state.allTags.filter(ele => _.includes(this.state.userTags, ele.name)),
      n => n.id
    );
    
    dispatch({
      type: 'customer/saveTags',
      payload: {
        customerId: params.id,
        customerMark: marks,
      },
      success: res => {
        notification.info({ message: res.header.msg });
        this.setState({ showTag: false });
        dispatch({
          type: 'customer/getMainRecords',
          payload: {
            customerId: params.id,
            topNum: 20,
          },
        });
      },
    });
  };

  render() {
    const { customer } = this.props;
    const { userRecord } = customer;
    const { evaluationStatistics } = userRecord;
    const { loading1, loading2, listEnd, commentsEnd, list, comments } = this.state;
    const loadMore = (
      <div
        style={{
          textAlign: 'center',
          margin: 8,
          lineHeight: '32px',
        }}
      >
        {!listEnd ? <Button onClick={this.onLoadMore}>加载更多</Button> : '没有更多了'}
      </div>
    );

    const loadMoreComments = (
      <div
        style={{
          textAlign: 'center',
          margin: 8,
          lineHeight: '32px',
        }}
      >
        {!commentsEnd ? <Button onClick={this.onLoadMoreComments}>加载更多</Button> : '没有更多了'}
      </div>
    );

    const usertags = (
      <div>
        <Select
          mode="multiple"
          style={{ width: '350px' }}
          placeholder="请选择"
          defaultValue={evaluationStatistics && _.map(evaluationStatistics.customerMarks, n => n)}
          onChange={this.handleChangeTag}
        >
          {this.state.allTags.map(option => (
            <Select.Option key={option.id} value={option.name}>
              {option.name}
            </Select.Option>
          ))}
        </Select>{' '}
        <Button
          size="small"
          type="defalt"
          type="primary"
          onClick={this.saveUserTag}>保存</Button>
        <Button
          size="small"
          type="defalt"
          style={{ marginLeft: 10 }}
          onClick={() => {
            this.setState({ showTag: false });
          }}
        >
          取消
            </Button>
      </div>
    );

    return (
      <PageHeaderWrapper title="用户详情">
        <Card>
          {evaluationStatistics && (
            <div>
              <h2>{evaluationStatistics.customerName}</h2>
              <p>
                {_.map(evaluationStatistics.customerMarks, n => <span> <Tag color="red">{n}</Tag></span>)}{' '}
                <Popover
                  placement="topLeft"
                  content={usertags}
                  trigger="click"
                  visible={this.state.showTag}
                >
                  <Button
                    size="small"
                    onClick={() => {
                      this.setState({ showTag: true });
                    }}
                  >
                    管理他的标签
                  </Button>
                </Popover>
              </p>
              {evaluationStatistics.evaluationStatisticsDTO && (
                <p>
                  {evaluationStatistics.evaluationStatisticsDTO.firstEvaluationAt}{' '}
                  第一次提交鉴定需求，共提交
                  {evaluationStatistics.evaluationStatisticsDTO.evaluationTotal || 0}次
                </p>
              )}
              {evaluationStatistics.evaluationStatisticsDTO && (
                <p>
                  {evaluationStatistics.evaluationStatisticsDTO.evaluationTrueTotal || 0}真，
                  {evaluationStatistics.evaluationStatisticsDTO.evaluationFalseTotal || 0}假，
                  {evaluationStatistics.evaluationStatisticsDTO.nonEvaluationTotal || 0}无法鉴定，
                  {evaluationStatistics.evaluationStatisticsDTO.reportTotal || 0}举报
                </p>
              )}
            </div>
          )}
          <Row gutter={24} type="flex">
            <Col span={18}>
              <List
                itemLayout="horizontal"
                size="large"
                dataSource={list}
                loadMore={loadMore}
                bordered
                loading={loading1}
                renderItem={item => (
                  <List.Item>
                    <Skeleton avatar title={false} loading={item.loading} active>
                      <div style={{ flex: 1 }}>
                        <Badge count={!_.isEmpty(item.multimedias) ? item.multimedias.length : 0}>
                          <Avatar
                            shape="square"
                            size={64}
                            src={item.mainImage}
                            onClick={() => this.showImg(item)}
                          />
                        </Badge>
                      </div>
                      <div style={{ flex: 8 }}>
                        <p>
                          {item.evaluationCode} {item.applyDays} 天前
                        </p>
                        <p>
                          {item.brandName} / {item.seriesName}{' '}
                          {this.genResult(item.evaluationResult)}
                        </p>
                      </div>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={6}>
              <List
                itemLayout="horizontal"
                size="large"
                dataSource={comments}
                bordered
                loadMore={loadMoreComments}
                loading={loading2}
                renderItem={item => (
                  <List.Item>
                    <Skeleton avatar title={false} loading={item.loading} active>
                      <div>
                        <p>{item.comment}</p>
                        <p>{item.commentAt}</p>
                      </div>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ customer }) => ({
  customer,
}))(Edit);

