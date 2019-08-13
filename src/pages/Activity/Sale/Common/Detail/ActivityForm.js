import React from 'react';
import { Card, Button, Form, Col, Row, Input, Checkbox, Modal, notification, message, Radio, DatePicker } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import moment from 'moment';

import UploadAction from '@/common/UploadAction';
import TabScrollSpy from '@/common/TabScrollSpy';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ActivityShop from '@/pages/Activity/Sale/Common/Detail/child/ActivityShop';
import RecommendShop from '@/pages/Activity/Sale/Common/Detail/child/RecommendShop';

import CardShop from '@/pages/Activity/Sale/Common/Detail/child/CardShop';
import NpcTable from '@/pages/Activity/Sale/Common/Detail/child/NpcTable';
import MaterialTable from '@/pages/Activity/Sale/Common/Detail/child/MaterialTable';
import TaskTable from '@/pages/Activity/Sale/Common/Detail/child/TaskTable';
import IntroShop from '@/pages/Activity/Sale/Common/Detail/child/IntroShop';

import { ACTIVITY_SCOPE } from '@/constants';

import styles from './ActivityForm.less';
// import { async } from 'q';

const isInvaidRange = (start, end) => end.set('second', 0).isSameOrBefore(start.set('second', 0));
const FIELDS = {
  recommend: `recommendSpus`,
};
const WrappedCard = ({ title, children, id }) => (
  <div className={styles.card} id={id}>
    <Card title={title} bordered={false}>
      {children}
    </Card>
  </div>
);

@Form.create()
class ActivityForm extends React.Component {
  state = {
    width: '100%',
    intros: {},
    introModal: false,
  };

  tableform = [];

  spuList = [];

  scopeOptions = ACTIVITY_SCOPE;

  scopeValues = [50, 10, 11, 12, 13, 15, 16, 110, 99];

  componentDidMount() {
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
      type: 'activity/loadDetail',
      payload: { data: {} },
    });
  };

  getActivitySpu = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    if (!id) return;

    dispatch({
      type: 'activity/getActivitySpus',
      payload: {
        id,
      },
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

  setTaskIds = () => {};

  getChildTasks = () => {
    let tasks = [];
    this.tableform.forEach(child => {
      if (!child) return;
      if (child.getChildData) {
        tasks = tasks.concat(child.getChildData());
      }
    });
    return tasks;
  };

  validate = async activityStatus => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
      activity: { detail },
    } = this.props;

    const { intros } = this.state;
    const hasError = false;
    if (activityStatus === 0) return;

    validateFieldsAndScroll((error, values) => {
      const val = values;
      val.spuIds = val.spus.map(ele => ele.spuId);

      if (!this.validateTime(val)) return;

      val.start = val.start.set({ second: 0 }).format('YYYY-MM-DD HH:mm:ss');
      val.end = val.end.set({ second: 0 }).format('YYYY-MM-DD HH:mm:ss');
      val.onlineAt = val.onlineAt.set({ second: 0 }).format('YYYY-MM-DD HH:mm:ss');
      val.offlineAt = val.offlineAt.set({ second: 0 }).format('YYYY-MM-DD HH:mm:ss');
      const { spuIds, entranceCovers = [], mainPictures = [], videos = [], intro, npcList, ...others } = {
        ...val,
      };
      const entranceCover = typeof entranceCovers === 'string' ? entranceCovers : entranceCovers.map(ele => ele.url).join('');
      const mainPicture = typeof mainPictures === 'string' ? mainPictures : mainPictures.map(ele => ele.url).join();
      const video = typeof videos === 'string' ? videos : videos.map(ele => ele.url).join();

      if (!spuIds || spuIds.length === 0) {
        message.error('至少选择一个商品');
        return;
      }
      const newNpcs = [];
      npcList.forEach(eve => {
        newNpcs.push({ id: eve.npcId, image: eve.avatar, name: eve.name });
      });
      if (!_.isEmpty(others.scene) && !others.scene.find(ele => ele.type === 'ROOT')) {
        Modal.info({
          title: '当前未设置素材起点',
          content: '未设置素材起点会导致活动上线后，用户无法正常浏览内容。',
        });
        return;
      }

      if (!error && !hasError) {
        delete others.spus;
        delete others.tasks;
        delete others.scene;
        delete others[FIELDS.recommend];
        const activityRecommendSpuList = _.get(val, `${FIELDS.recommend}`, []).map((v, i) => ({ sort: i + 1, spuId: v.spuId }));

        const param = {
          id: detail.id,
          entranceCover,
          mainPicture,
          video,
          spuIds,
          intro: !_.isEmpty(intros) ? intros : intro,
          npcList: newNpcs,
          ...others,
        };
        if (activityRecommendSpuList.length > 0) {
          param.activityRecommendSpuList = activityRecommendSpuList;
        }

        dispatch({
          type: 'activity/saveActivity',
          payload: param,
          success: res => {
            if (res.header.code === 4050) {
              notification.error({ message: res.header.msg || '出错了，稍后再试' });
              return;
            }
            if (res.header.code === 2000) this.goBack();
          },
        });
      }
    });
  };

  validateTime = val => {
    let canNext = true;
    const { form } = this.props;
    const needCompareTimes = [
      [val.start, val.end, '开始时间不能大于等于结束时间'],
      [val.onlineAt, val.offlineAt, '上线时间不能大于等于下线时间'],
      [val.onlineAt, val.start, '上线时间不能大于等于开始时间'],
      [val.end, val.offlineAt, '下线时间要在结束时间之后'],
    ];

    needCompareTimes.forEach(item => {
      if (isInvaidRange(item[0], item[1])) {
        message.error(item[2]);
        canNext = false;
      }
    });

    if (!canNext) {
      form.validateFields();
    }

    return canNext;
  };

  goBack = () => {
    router.replace('/activity/sale/all');
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
      // case 'PREHEATING':
      //   value = '预热中';
      //   color = { color: 'red' };
      //   break;
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

  preview = () => {
    Modal.info({
      title: '请在小程序测试版查看预览效果',
    });
  };

  getTimeRange = (field, option = 'lt') => currentData => {
    const {
      form: { getFieldValue },
    } = this.props;

    const start1 = getFieldValue(field);
    const end1 = getFieldValue('end'); // 结束时间
    if (!start1 || !end1) return false;

    const formatTime = prop => moment(getFieldValue(prop).format());
    const compareTime = (startTime, endTime) => startTime.isBefore(endTime.subtract(20, 'hours'));
    const start = formatTime(field);
    const end = formatTime('end'); // 结束时间

    if (field === 'onlineAt') {
      return compareTime(currentData, start) || compareTime(currentData, end);
    }
    return option === 'lt' ? compareTime(currentData, start) : start.add(20, 'hours').isBefore(currentData);
  };

  handleSpuTable = lists => {
    this.spuList = lists;
    // this.setState({ spuList: lists });
  };

  deleteActivity = async id => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '提示',
      content: '确认删除当前活动吗',
      onOk: async () => {
        await dispatch({ type: 'activity/delete', payload: { id } });
        this.goBack();
      },
      okText: '确认',
      cancelText: '取消',
    });
  };

  addIntro = param => {
    this.setState({ intros: param });
  };

  changeScopes = val => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const range = getFieldValue('displayRange');

    setFieldsValue({
      displayRange: range.filter(ele => val.indexOf(ele.value) !== -1),
    });
  };

  render() {
    const {
      activity: { detail, activitySpus },
      form: { getFieldDecorator, getFieldValue },
      submitting,
      location,
    } = this.props;

    const { width, introModal } = this.state;
    const { activityStatus, id } = location;

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

    const headerTabs = [
      {
        id: 'basicInfo',
        label: '基础信息',
      },
      {
        id: 'stockInfo',
        label: '发售物料',
      },
      {
        id: '_shop',
        label: '发售商品',
      },
      {
        id: '_recommend_shop',
        label: '推荐商品',
      },
      {
        id: '_task',
        label: '关联任务',
      },
      {
        id: 'operationRecord',
        label: '内容管理',
      },
      {
        id: 'cardInfo',
        label: '关联卡片',
      },
      {
        id: 'npcInfo',
        label: '关联NPC',
      },
    ];

    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        <TabScrollSpy tabs={headerTabs}>
          <div id="basicInfo" className={styles.card}>
            <Card title="基础信息" className={styles.card} bordered={false}>
              <Form align="left">
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="活动ID">
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
                      {getFieldDecorator('title', {
                        initialValue: detail.title || '',
                        rules: [{ required: true, message: '发售标题不能为空' }, { max: 30, message: '长度不超过30' }],
                      })(<Input placeholder="必填，限30字以内" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售副标题">
                      {getFieldDecorator('subTitle', {
                        initialValue: detail.subTitle,
                        rules: [{ required: true, message: '发售副标题不能为空' }, { max: 30, message: '长度不超过30' }],
                      })(<Input placeholder="必填，限30字以内" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售名称">
                      {getFieldDecorator('name', {
                        initialValue: detail.name || '',
                        rules: [{ required: true, message: '发售名称不能为空' }, { max: 30, message: '长度不超过30' }],
                      })(<Input placeholder="请输入发售名称，限30字以内" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售进行渠道">
                      {getFieldDecorator('scope', {
                        initialValue: detail.scope || [],
                        rules: [{ required: true, message: '渠道不能为空' }],
                      })(<Checkbox.Group options={this.scopeOptions} onChange={this.changeScopes} />)}
                      <p style={{ color: 'red', fontSize: 16, lineHeight: '20px' }}>
                        *concepts小程序仅能关联一个抽签任务 <br />
                        请谨慎操作
                      </p>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售展示范围">
                      {getFieldDecorator('displayRange', {
                        initialValue: detail.displayRange || [],
                        rules: [{ required: true, message: '范围不能为空' }],
                      })(
                        <Checkbox.Group
                          options={this.scopeOptions.map(ele => {
                            const { disabled, ...other } = ele;
                            const able = getFieldValue('scope').indexOf(ele.value) !== -1;
                            return { disabled: !able, ...other };
                          })}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="上线状态">
                      {/* eslint-disable */}
                      {detail.id ? (detail.isOnline ? '上线' : '下线') : ''}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售开始时间">
                      {getFieldDecorator('start', {
                        initialValue: moment(detail.start) || moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                        rules: [{ required: true, message: '不能为空' }],
                      })(<DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" disabled={detail.status === 'PROCESSING'} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售结束时间">
                      {getFieldDecorator('end', {
                        initialValue: detail.end ? moment(detail.end) : moment(new Date(), 'YYYY-MM-DD HH:mm:ss').add(10, 'm'),
                        rules: [
                          { required: true, message: '不能为空' },
                          (rule, value, callback) => {
                            if (!value) {
                              callback();
                              return;
                            }

                            if (value.isSameOrBefore(getFieldValue('start'))) callback('开始时间不能大于等于结束时间');
                            else callback();
                          },
                        ],
                      })(<DatePicker showTime={{ format: 'HH:mm' }} disabledDate={this.getTimeRange('start')} format="YYYY-MM-DD HH:mm" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售上线时间">
                      {getFieldDecorator('onlineAt', {
                        initialValue: moment(detail.onlineAt) || moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                        rules: [
                          { required: true, message: '不能为空' },
                          (rule, value, callback) => {
                            const start = getFieldValue('start');
                            if (!start) {
                              callback();
                              return;
                            }

                            if (start.isSameOrBefore(value)) {
                              callback('上线时间不能大于等于开始时间');
                            } else callback();
                          },
                        ],
                      })(
                        <DatePicker
                          showTime={{ format: 'HH:mm' }}
                          disabledDate={this.getTimeRange('start', 'gt')}
                          format="YYYY-MM-DD HH:mm"
                          disabled={detail.isOnline}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售下线时间">
                      {getFieldDecorator('offlineAt', {
                        initialValue: moment(detail.offlineAt) || moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                        rules: [
                          { required: true, message: '不能为空' },
                          (rule, value, callback) => {
                            if (!value) {
                              callback();
                              return;
                            }
                            if (value.isSameOrBefore(getFieldValue('onlineAt'))) callback('上线时间不能大于等于下线时间');
                            else if (value.isSameOrBefore(getFieldValue('end'))) callback('下线时间要在结束时间之后');
                            else callback();
                          },
                        ],
                      })(<DatePicker showTime={{ format: 'HH:mm' }} disabledDate={this.getTimeRange('onlineAt')} format="YYYY-MM-DD HH:mm" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  {/* <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="发售简介">
                      {getFieldDecorator('rule', {
                        initialValue: detail.rule,
                        rules: [{ required: true, message: '不能为空' }, { max: 300, message: '长度不超过300' }],
                      })(<Input.TextArea placeholder="必填，限300字以内" style={{ width: 480, height: 88 }} />)}
                    </Form.Item>
                  </Col> */}
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
                        编辑简介
                      </Button>

                      <IntroShop
                        visible={introModal}
                        intro={detail.intro || {}}
                        onCancel={() => {
                          this.setState({ introModal: false });
                          this.forceUpdate();
                        }}
                        onAdd={this.addIntro}
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
                    {getFieldDecorator('entranceCovers', {
                      initialValue: detail.entranceCover || [],
                      rules: [{ required: true, message: '图片不能为空' }],
                    })(<UploadAction maxCount={1} desc="尺寸：500X500，支持.jpg .png 格式，大小≤1M" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="主图类型" {...formItemLayout}>
                    {getFieldDecorator('mainPictureType', {
                      initialValue: detail.mainPictureType || 'PIC',
                      rules: [{ required: true, message: '类型不能为空' }],
                    })(
                      <Radio.Group>
                        <Radio value={'PIC'}>图片</Radio>
                        <Radio value={'VIDEO'}>视频</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="封面图" {...formItemLayout}>
                    {getFieldDecorator('mainPictures', {
                      initialValue: detail.mainPicture || [],
                      rules: [{ required: true, message: '主图封面不能为空' }],
                    })(<UploadAction maxCount={1} desc="尺寸:750X1440，支持.jpg .png 格式，大小≤1M" />)}
                  </Form.Item>
                </Col>
              </Row>

              {getFieldValue('mainPictureType') === 'VIDEO' && (
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="视频" {...formItemLayout}>
                      {getFieldDecorator('videos', {
                        initialValue: detail.video || [],
                        rules: [{ required: true, message: '视频不能为空' }],
                      })(
                        <UploadAction
                          maxCount={1}
                          videoSize={50}
                          timeout={600000}
                          supportTypes={['video/mp4']}
                          desc="尺寸:750X1440，支持 .mp4格式，图片大小≤50M"
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Card>
          </div>
          <WrappedCard title="发售商品" id="_shop">
            {getFieldDecorator('spus', {
              initialValue: detail.spus || [],
            })(
              <ActivityShop
                activitySpus={activitySpus}
                wrappedComponentRef={spuRef => {
                  this.spuRef = spuRef;
                }}
              />
            )}
          </WrappedCard>
          <WrappedCard title="推荐商品" id="_recommend_shop">
            {getFieldDecorator(FIELDS.recommend, {
              initialValue: detail[FIELDS.recommend] || [],
            })(
              <RecommendShop
                activitySpus={activitySpus}
                activityId={detail.id}
                wrappedComponentRef={spuRef => {
                  this.spuRef = spuRef;
                }}
              />
            )}
          </WrappedCard>
          <WrappedCard title="已关联任务" id="_task">
            {getFieldDecorator('tasks', {
              initialValue: detail.tasks || [],
            })(<TaskTable />)}
          </WrappedCard>

          <div id="operationRecord" className={styles.card}>
            <Card title="内容管理" bordered={false} style={{ marginBottom: 20 }}>
              <p style={{ color: 'red', fontSize: 16, lineHeight: '14px' }}>不要忘记“设为起点”！！ 没有起点素材的话用户会看到一片空白</p>
              {getFieldDecorator('scene', {
                initialValue: detail.scene || [],
              })(<MaterialTable />)}
            </Card>
          </div>

          <div id="cardInfo" className={styles.card}>
            <Card title="关联内容卡片" bordered={false}>
              {getFieldDecorator('contentList', {
                initialValue: detail.contentList || [],
              })(<CardShop />)}
            </Card>
          </div>

          <div id="npcInfo" className={styles.card}>
            <Card title="关联NPC" bordered={false} style={{ marginBottom: 60 }}>
              {getFieldDecorator('npcList', {
                initialValue: detail.npcList || [],
              })(<NpcTable />)}
            </Card>
          </div>
        </TabScrollSpy>
        <FooterToolbar
          style={{ width }}
          extra={
            detail.status === 'NOT_STARTED' && (
              <Button
                type="danger"
                onClick={() => this.deleteActivity(detail.id)}
                style={{ marginRight: 'auto', color: '#F5222D' }}
                loading={submitting}
              >
                删除
              </Button>
            )
          }
        >
          <Button onClick={() => this.goBack()}>取消</Button>
          <Button onClick={() => this.preview()}>预览</Button>
          <Button type="primary" onClick={() => this.validate(activityStatus, id)} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ activity, loading }) => ({
  activity,
  loading,
  submitting: loading.effects['activity/saveActivity'],
}))(ActivityForm);
