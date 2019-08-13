import React from 'react';
import { Card, Button, Form, Col, Row, Input } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OutvoiceDetail from './OutvoiceDetail';
import AsideDetail from './AsideDetail';
import TalkDetail from './TalkDetail';
import HotareaDetail from './HotareaDetail';

@Form.create()
class Detail extends React.Component {
  state = {
    width: '100%',
    ids: [],
    npclist: [],
  };

  tableform = [];

  spuList = [];

  componentDidMount() {
    this.handleLoadNpclist();
    this.handleLoadDetail();
    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    this.clearDetail();
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  clearDetail = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'material/loadDetail',
      payload: { data: {} },
    });
  };

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

  handleLoadNpclist = async () => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'material/getNpclist',
      payload: {},
    });
    // console.log(res);

    if (res.data && res.data.npcInfos) this.setState({ npclist: res.data.npcInfos.filter(ele => ele.status === 'ENABLE') });
  };

  goBack = () => {
    router.goBack();
  };

  handleLoadDetail = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    if (!_.isEmpty(params.id)) {
      dispatch({
        type: 'material/detail',
        payload: {
          id: params.id,
        },
      });
    }
  };

  handleShowStatus = detail => {
    if (_.isEmpty(detail.activity)) return null;
    const { status } = detail.activity;
    let value;
    let color;

    switch (status) {
      case 'NOT_STARTED':
        value = '未开始';
        color = { color: '#faad14' };
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

  handleSpuTable = lists => {
    this.spuList = lists;
    // this.setState({ spuList: lists });
  };

  setTaskIds = () => {};

  render() {
    const {
      material: { detail },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const { width, ids, npclist } = this.state;
    const { origin, pathname } = window.location;
    const prefix = `${origin}${pathname}#`;

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

    // 动态生成tableform
    getFieldDecorator('keys', { initialValue: detail.dialogs && detail.dialogs.length > 0 ? detail.dialogs : [] });
    const keys = getFieldValue('keys');

    // 跳转素材id
    getFieldDecorator('skipDefaultSceneID', { initialValue: detail.skipDefaultSceneID || '' });
    const skipDefaultSceneID = getFieldValue('skipDefaultSceneID');

    // 获取活动信息
    getFieldDecorator('actInfo', { initialValue: !_.isEmpty(detail.activity) ? detail.activity : {} });
    const actInfo = getFieldValue('actInfo');

    const seriesForms = keys.map((k, i) => (
      <div key={k.sortNumber || 888888 + i} style={{ background: '#f9f9f9', marginBottom: 20, padding: 10, position: 'relative' }}>
        {k.type === 'VOICE_OVER' &&
          getFieldDecorator(`dialogs[${i}]`, {
            initialValue: k || {},
          })(
            <OutvoiceDetail
              index={i}
              activityId={detail.activity ? detail.activity.id : actInfo.id}
              ids={ids}
              wrappedComponentRef={ele => {
                this.tableform[i] = ele;
              }}
            />
          )}
        {k.type === 'ASIDE' &&
          getFieldDecorator(`dialogs[${i}]`, {
            initialValue: k || {},
          })(
            <AsideDetail
              index={i}
              activityId={detail.activityID || actInfo.id}
              wrappedComponentRef={ele => {
                this.tableform[i] = ele;
              }}
            />
          )}
        {k.type === 'NPC' &&
          getFieldDecorator(`dialogs[${i}]`, {
            initialValue: k || { options: [] },
          })(
            <TalkDetail
              index={i}
              ids={ids}
              activityId={detail.activityID || actInfo.id}
              npclist={npclist || []}
              wrappedComponentRef={ele => {
                this.tableform[i] = ele;
              }}
            />
          )}
        {k.type === 'HOT_ZONE' &&
          getFieldDecorator(`dialogs[${i}]`, {
            initialValue: k || { options: [] },
          })(
            <HotareaDetail
              index={i}
              activityId={detail.activityID || actInfo.id}
              wrappedComponentRef={ele => {
                this.tableform[i] = ele;
              }}
            />
          )}
      </div>
    ));

    return (
      <PageHeaderWrapper>
        <Card title="基础信息" bordered={false} style={{ marginBottom: 20 }}>
          <Form align="left">
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="素材名称">
                  {getFieldDecorator('name', {
                    initialValue: detail.name || '',
                    rules: [{ required: true, message: '素材名称不能为空' }, { max: 20, message: '长度不超过20' }],
                  })(<Input placeholder="请输入素材名称，限制20字以内" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="素材ID">
                  <span className="ant-form-text">{detail.id}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="关联发售名称">
                  {!_.isEmpty(actInfo) ? actInfo.name || actInfo.id : ''}
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
                <Form.Item {...formItemLayout} label="前置素材ID" style={{ wordBreak: 'break-all' }}>
                  {!_.isEmpty(detail.beforeSceneIDs) &&
                    detail.beforeSceneIDs.map(eve => (
                      <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/material/all/detail/${eve}`}>
                        {`${eve};`}
                      </a>
                    ))}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="跳转至素材ID">
                  <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/material/all/detail/${skipDefaultSceneID}`}>
                    {skipDefaultSceneID}
                  </a>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <div style={{ paddingBottom: 40 }}>
          <Card title="片段管理" bordered={false} style={{ marginBottom: 40 }}>
            {seriesForms}
          </Card>
        </div>

        <FooterToolbar style={{ width }}>
          <Button onClick={() => this.goBack()}>返回</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ material, loading }) => ({
  material,
  loading,
}))(Detail);
