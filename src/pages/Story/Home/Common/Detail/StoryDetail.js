import React from 'react';
import { Card, Button, Form, Col, Row, Menu, Checkbox } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import moment from 'moment';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ActivityShop from '@/pages/Activity/Sale/Common/Detail/child/ActivityShop';
import TaskTable from '@/pages/Activity/Sale/Common/Detail/child/TaskTable';
import NpcTable from '@/pages/Activity/Sale/Common/Detail/child/NpcTable';
import RecommendShop from '@/pages/Activity/Sale/Common/Detail/child/RecommendShop';
import CardShop from '@/pages/Activity/Sale/Common/Detail/child/CardShop';
import MaterialTable from '@/pages/Activity/Sale/Common/Detail/child/MaterialTable';
import IntroShop from '@/pages/Activity/Sale/Common/Detail/child/IntroShop';

import styles from './StoryForm.less';

const WrappedCard = ({ title, children, id }) => (
  <div className={styles.card} id={id}>
    <Card title={title} bordered={false}>
      {children}
    </Card>
  </div>
);

@Form.create()
class ActivityDetail extends React.Component {
  state = {
    width: '100%',
    introModal: false,
  };

  tableform = [];

  scopeOptions = [
    { id: 50, name: 'woof剧场APP' },
    // { id: 10, name: 'WooFGo小程序' },
    { id: 11, name: '鉴定师小程序' },
    { id: 15, name: 'woof剧场小程序' },
    { id: 16, name: 'concepts小程序' },
    // { id: 12, name: '有药小程序' },
    // { id: 13, name: 'WOOF社区小程序' },
    { id: 12, name: '12自用' },
    { id: 13, name: '13自用' },
    { id: 14, name: '14自用' },
    // { id: 110, name: '综合管理平台' },
  ];

  componentDidMount() {
    this.handleLoadDetail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'spec/clearDetail',
    });
  }

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

  handleLoadDetail = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    if (!_.isEmpty(params.id)) {
      dispatch({
        type: 'activity/detail',
        payload: {
          id: params.id,
        },
      });
    }
  };

  handleShowStatus = detail => {
    const { status } = detail;
    let value;
    let color;

    switch (status) {
      case 'NOT_STARTED':
        value = '未开始';
        color = { color: '#faad14' };
        break;
      case 'PREHEATING':
        value = '预热中';
        color = { color: 'red' };
        break;
      case 'PROCESSING':
        value = '进行中';
        color = { color: '#52c41a' };
        break;
      case 'OVER':
        value = '已结束';
        color = { color: '#333' };
        break;
      default:
        value = '新建';
    }

    return <span style={color}>{value}</span>;
  };

  showRange = v => {
    let t;

    switch (v) {
      case 'APP':
        t = 'app';
        break;
      case 'APPLET':
        t = '小程序';
        break;
      case 'APP_AND_APPLET':
        t = '小程序和app';
        break;
      default:
        t = 'app';
    }
    return t;
  };

  renderMainPicture = src => {
    console.log('获取图片', src);
    let cmp;
    /* eslint-disable */

    if (/mp4$/.test(src)) cmp = <video src={src} controls style={{ width: 100, height: 100 }} />;
    else cmp = <img src={src} alt="图片" style={{ width: 100 }} />;
    return <div>{cmp}</div>;
  };

  render() {
    const {
      activity: { detail },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const { width, introModal } = this.state;
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
    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        <Menu mode="horizontal" selectable defaultSelectedKeys={['basicInfo']} onClick={this.handleMenuClick} style={{ marginBottom: 20 }}>
          <Menu.Item key="basicInfo">基础信息</Menu.Item>
          <Menu.Item key="stockInfo">发售物料</Menu.Item>
          <Menu.Item key="_shop">发售商品</Menu.Item>
          <Menu.Item key="_recommend_shop">推荐商品</Menu.Item>
          <Menu.Item key="_task">关联任务</Menu.Item>
          <Menu.Item key="operationRecord">内容管理</Menu.Item>
          <Menu.Item key="npcInfo">关联NPC</Menu.Item>
        </Menu>
        <div id="basicInfo" className={styles.card}>
          <Card title="基础信息" className={styles.card} bordered={false}>
            <Form align="left">
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售ID">
                    <span className="ant-form-text">{detail.id}</span>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售状态">
                    {this.handleShowStatus(detail)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售标题">
                    <span className="ant-form-text">{detail.title}</span>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售副标题">
                    <span className="ant-form-text">{detail.subTitle}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售名称">
                    <span className="ant-form-text">{detail.name}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售进行渠道">
                    {getFieldDecorator('scope', {
                      initialValue: detail.scope ? this.scopeOptions.filter(ele => detail.scope.indexOf(ele.id) !== -1).map(ele => ele.name) : [],
                      rules: [{ required: true, message: '渠道不能为空' }],
                    })(<Checkbox.Group options={this.scopeOptions.map(ele => ele.name)} disabled />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售展示范围">
                    {getFieldDecorator('displayRange', {
                      initialValue: detail.displayRange
                        ? this.scopeOptions.filter(ele => detail.displayRange.indexOf(ele.id) !== -1).map(ele => ele.name)
                        : [],
                      rules: [{ required: true, message: '范围不能为空' }],
                    })(<Checkbox.Group options={this.scopeOptions.map(ele => ele.name)} disabled />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="上线状态">
                    {detail.id ? (detail.isOnline ? '上线' : '下线') : ''}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="活动开始时间">
                    <span className="ant-form-text">{detail.start ? moment(detail.start).format('YYYY-MM-DD HH:mm') : ''}</span>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="活动结束时间">
                    <span className="ant-form-text">{detail.end ? moment(detail.end).format('YYYY-MM-DD HH:mm') : ''}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="活动上线时间">
                    <span className="ant-form-text">{detail.onlineAt ? moment(detail.onlineAt).format('YYYY-MM-DD HH:mm') : ''}</span>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="活动下线时间">
                    <span className="ant-form-text">{detail.offlineAt ? moment(detail.offlineAt).format('YYYY-MM-DD HH:mm') : ''}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发售简介">
                    <Button
                      type="primary"
                      onClick={() =>
                        this.setState({
                          introModal: true,
                        })
                      }
                    >
                      查看简介
                    </Button>

                    <IntroShop
                      visible={introModal}
                      intro={detail.intro || {}}
                      onCancel={() => {
                        this.setState({ introModal: false });
                        this.forceUpdate();
                      }}
                      onAdd={this.addIntro}
                      mode="view"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="小程序活动链接">
                    {detail.id ? detail.appletUrl + detail.id : ''}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="APP活动链接">
                    {detail.id ? detail.appUrl + detail.id : ''}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <div id="stockInfo" className={styles.card}>
          <Card title="发售物料" bordered={false} style={{ marginBottom: 40 }}>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="入口封面图" {...formItemLayout}>
                  <img src={detail.entranceCover} alt="图片" style={{ width: 100 }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="主图封面" {...formItemLayout}>
                  {this.renderMainPicture(detail.mainPicture)}
                </Form.Item>
              </Col>
            </Row>
            {detail.video ? (
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="主图视频" {...formItemLayout}>
                    <video src={detail.video} controls style={{ width: 100, height: 100 }} poster={detail.mainPicture} />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </Card>
        </div>

        <WrappedCard title="活动商品" id="_shop">
          <ActivityShop value={detail.spus} isView />
        </WrappedCard>
        <WrappedCard title="推荐商品" id="_recommend_shop">
          <RecommendShop value={detail.recommendSpus} isView />
        </WrappedCard>

        <WrappedCard title="已关联任务" id="_task">
          <TaskTable value={detail.tasks} mode="view" />
        </WrappedCard>

        <div id="operationRecord" className={styles.card}>
          <Card title="内容管理" bordered={false} style={{ marginBottom: 20 }}>
            <MaterialTable value={detail.scene} mode="view" />
          </Card>
        </div>

        <WrappedCard title="关联内容卡片" id="_cards">
          {detail.contentList && <CardShop value={detail.contentList} isView />}
        </WrappedCard>

        <div id="npcInfo" className={styles.card}>
          <Card title="关联NPC" style={{ marginBottom: 60 }} bordered={false}>
            <NpcTable value={detail.npcList} isView />
          </Card>
        </div>
        <FooterToolbar style={{ width }}>
          {detail.status !== 'PROCESSING' && <Button onClick={() => router.push(`/activity/sale/all/edit/${detail.id}`)}>编辑</Button>}
          <Button onClick={() => this.goBack()}>返回</Button>
          {detail.isOnline && (
            <Button type="primary" onClick={() => router.push(`/activity/sale/all/reply/${detail.id}`)}>
              用户回复
            </Button>
          )}
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ activity, loading }) => ({
  activity,
  loading,
}))(ActivityDetail);
