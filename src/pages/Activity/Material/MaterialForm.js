import React from 'react';
import { Card, Button, Form, Col, Row, Input, Modal, notification, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OutvoiceForm from './OutvoiceForm';
import AsideForm from './AsideForm';
import TalkForm from './TalkForm';
import HotareaForm from './HotareaForm';

import ActivityDialog from './ActivityDialog';
import MaterialDialog from './MaterialDialog';

import styles from './MaterialForm.less';

@Form.create()
class ActivityForm extends React.Component {
  state = {
    width: '100%',
    ids: [],
    actModal: false,
    sceneModal: false,
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

  validateChildForm = () => {
    let error = false;
    let childError = false;
    this.tableform.forEach(form => {
      if (!form) return;
      form.props.form.validateFields(err => {
        if (err) {
          const key = Object.keys(err)[0];

          error = err[key].errors[0].message;
        }
      });

      if (form.childForm && !childError) {
        childError = form.childForm.validateChildForm();
      }
    });

    if (error) {
      message.error(error);
    }

    return !error && !childError;
  };

  validateChildTasks = () => {
    const lists = this.getChildTasks();
    let canNext = true;
    lists.forEach(v => {
      if (v.contentType === 'TASK' && !_.get(v, `taskList[0].taskId`)) {
        if (canNext) message.error('任务选项必须关联任务数据');
        canNext = false;
      }
    });

    return canNext;
  };

  validateNeedOneTask = dialogs => {
    let canNext = true;
    if (!dialogs.some(v => v.contentType === 'TASK' && _.get(v, `taskList[0].taskId`))) {
      canNext = false;
      message.error('活动至少需要绑定一个任务才能保存');
    }

    return canNext;
  };

  validateDuplicateTask = dialogs => {
    let canNext = true;
    if (dialogs) {
      const lists = dialogs.map(v => _.get(v, `taskList[0].taskId`)).filter(v => v);
      const setArr = new Set(lists);
      if (setArr.size < lists.length) {
        canNext = false;
        message.error('绑定的任务数据不能重复');
      }
    }

    return canNext;
  };

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

  validate = async () => {
    const {
      form: { validateFieldsAndScroll, getFieldValue },
      dispatch,
      material: { detail },
    } = this.props;
    if (detail.activityStatus === 0) return;

    if (detail.id && (this.tableform.length === 0 || this.tableform.every(ele => ele === null))) {
      message.error('请先添加对话');
      return;
    }

    if (!detail.id && this.tableform.length > 0 && this.tableform.every(ele => ele !== null)) {
      Modal.info({
        title: '请先点击"保存"，提交本素材的基本信息后才可以添加片段。',
      });
      return;
    }

    validateFieldsAndScroll((error, values) => {
      const val = values;

      const skipDefaultSceneID = getFieldValue('skipDefaultSceneID');
      let hasDialogSkip = false;
      if (!_.isEmpty(val.dialogs)) {
        hasDialogSkip = val.dialogs.some(ele => {
          let has = false;
          if (ele.options) {
            has = ele.options.some(item => !_.isEmpty(item.skipSceneID));
          }
          return has;
        });
      }

      if (skipDefaultSceneID && hasDialogSkip) {
        message.error('素材基础信息内填写的“跳转至素材ID”，与最后一个片段的对话选项跳转ID，只能保存其中一个，请修改。');
        return;
      }

      if (!this.validateChildForm()) return;
      if (!this.validateChildTasks()) return;

      const { keys, dialogs = [], actInfo, ...others } = { ...val };

      const newDialogs = dialogs.map(ele => {
        const temp = ele;
        if (temp.type === 'NPC') {
          const op = temp.options.filter(item => item.contentType || item.title || item.content);
          temp.options = op;
        }
        return temp;
      });
      const hasEmpty = newDialogs.some(ele => {
        let has = false;
        if (ele.type === 'NPC' && !_.isEmpty(ele.options)) {
          has = ele.options.some(item => item.contentType === 'OPTION_TEXT' && (item.title === '' || item.content === ''));
        }
        return has;
      });
      if (hasEmpty) {
        message.error('对话选项不能为空');
        return;
      }

      if (newDialogs.some(v => _.get(v, 'contentType') === 'TEXT' && _.isEmpty(_.get(v, 'content')))) {
        message.error('内容不能为空');
        return;
      }

      if (newDialogs.some(v => _.get(v, 'options.length') === 1 && _.get(v, 'options[0].contentType') === 'OPTION_TEXT')) {
        message.error('回复选项至少为2个！');
        return;
      }

      if (
        newDialogs.some(
          v =>
            _.get(v, 'options.length') > 0 &&
            _.get(v, 'options').some(vv => _.get(vv, 'contentType') === 'OPTION_DEFAULT_TEXT' && _.isEmpty(_.get(vv, 'content')))
        )
      ) {
        message.error('内容不能为空');
        return;
      }

      if (!error) {
        const param = {
          id: detail.id,
          dialogs: !_.isEmpty(newDialogs) ? newDialogs.map((ele, i) => ({ ...ele, sortNumber: i })) : [],
          skipDefaultSceneID,
          activityID: actInfo.id,
          ...others,
        };

        if (detail.id) {
          dispatch({
            type: 'material/update',
            payload: param,
            success: res => {
              if (res.header.code !== 2000) {
                notification.error({ message: res.header.msg || '出错了，稍后再试' });
                return;
              }
              if (res.header.code === 2000) this.goBack();
            },
          });
        } else {
          dispatch({
            type: 'material/save',
            payload: param,
            success: res => {
              if (res.header.code !== 2000) {
                notification.error({ message: res.header.msg || '出错了，稍后再试' });
                return;
              }
              if (res.header.code === 2000) this.goBack();
            },
          });
        }
      }
    });
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

  handleLoadNpclist = async () => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'material/getNpclist',
      payload: {},
    });

    if (res.data && res.data.npcInfos) this.setState({ npclist: res.data.npcInfos.filter(ele => ele.status === 'ENABLE') });
  };

  // 动态form增加
  addBlock = type => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const ops = type === 'NPC' ? { contentType: 'TEXT', options: [{ contentType: '', title: '', content: '' }] } : {};

    const nextKeys = keys.concat([
      {
        type,
        ...ops,
        delFlag: 0,
        sortNumber: keys.length,
      },
    ]);

    form.setFieldsValue({
      keys: nextKeys,
      seriesCount: nextKeys.filter(ele => ele.delFlag !== 1).length,
    });
  };

  // 动态form删除
  removeBlock = i => {
    const { form } = this.props;

    const keys = form.getFieldValue('keys');
    const dialogs = form.getFieldValue('dialogs');

    const nextKeys = keys.filter((key, idx) => idx !== i);
    const dialogsnew = dialogs.filter((key, idx) => idx !== i);

    form.setFieldsValue({
      keys: nextKeys,
      dialogs: dialogsnew,
      seriesCount: nextKeys.length,
    });
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

  upBlock = i => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const keys = getFieldValue('keys');
    const dialogs = getFieldValue('dialogs');

    [keys[i], keys[i - 1]] = [keys[i - 1], keys[i]];
    [dialogs[i], dialogs[i - 1]] = [dialogs[i - 1], dialogs[i]];

    setFieldsValue({ keys, dialogs });
  };

  downBlock = i => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const keys = getFieldValue('keys');
    const dialogs = getFieldValue('dialogs');

    [keys[i], keys[i + 1]] = [keys[i + 1], keys[i]];
    [dialogs[i], dialogs[i + 1]] = [dialogs[i + 1], dialogs[i]];

    setFieldsValue({ keys, dialogs });
  };

  preview = () => {
    Modal.info({
      title: '请在小程序测试版查看预览效果',
    });
  };

  handleSpuTable = lists => {
    this.spuList = lists;
    // this.setState({ spuList: lists });
  };

  editActivity = () => {
    this.setState({ actModal: true });
  };

  addActivity = data => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const dialogs = getFieldValue('dialogs') || [];

    // 修改活动，对话里面的跳转场景id要置空
    if (!_.isEmpty(dialogs)) {
      dialogs.forEach(ele => {
        const item = ele;
        if (!_.isEmpty(item.options)) {
          item.options.forEach(ele2 => {
            const item2 = ele2;
            item2.skipSceneID = '';
            return item;
          });
        }
        return item;
      });
    }
    setFieldsValue({ actInfo: data, skipDefaultSceneID: '', dialogs });
  };

  // 增加
  addMaterialTable = item => {
    const { form } = this.props;
    const skipDefaultSceneID = form.getFieldValue('skipDefaultSceneID');

    if (skipDefaultSceneID) {
      message.error('只能添加一个素材');
      return;
    }
    form.setFieldsValue({ skipDefaultSceneID: item.id });
  };

  // 删除
  removeMaterialTable = async () => {
    const { form } = this.props;

    form.setFieldsValue({ skipDefaultSceneID: '' });
  };

  render() {
    const {
      material: { detail },
      form: { getFieldDecorator, getFieldValue },
      submitting,
    } = this.props;

    const { width, ids, actModal, sceneModal, npclist } = this.state;
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
        {keys.filter(ele => ele.delFlag !== 1).length >= 1 ? (
          <div>
            <Button style={{ position: 'absolute', top: 5, right: 150 }} disabled={i === 0} onClick={() => this.upBlock(i, k)}>
              上移
            </Button>
            <Button style={{ position: 'absolute', top: 5, right: 75 }} disabled={i === keys.length - 1} onClick={() => this.downBlock(i, k)}>
              下移
            </Button>
            <Button style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => this.removeBlock(i, k)}>
              删除
            </Button>
          </div>
        ) : null}
        {k.type === 'VOICE_OVER' &&
          getFieldDecorator(`dialogs[${i}]`, {
            initialValue: k || {},
          })(
            <OutvoiceForm
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
            <AsideForm
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
            <TalkForm
              index={i}
              ids={ids}
              npclist={npclist}
              materialId={detail.id || ''}
              activityId={detail.activityID || actInfo.id}
              wrappedComponentRef={ele => {
                this.tableform[i] = ele;
              }}
            />
          )}
        {k.type === 'HOT_ZONE' &&
          getFieldDecorator(`dialogs[${i}]`, {
            initialValue: k || { options: [] },
          })(
            <HotareaForm
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
      <PageHeaderWrapper title={!detail.id ? '新建素材' : '编辑素材'} wrapperClassName={styles.advancedForm}>
        <Card title="基础信息" bordered={false} style={{ marginBottom: 24 }}>
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
                  <span>{!_.isEmpty(actInfo) ? actInfo.name || actInfo.id : ''}</span>{' '}
                  {!_.isEmpty(actInfo) && <a onClick={this.editActivity}>修改</a>}
                  {_.isEmpty(actInfo) && (
                    <Button type="primary" onClick={() => this.setState({ actModal: true })}>
                      请选择
                    </Button>
                  )}
                  <p style={{ color: 'red', margin: 0 }}>修改发售后，所有关联的跳转素材ID将被清空</p>
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
                  </a>{' '}
                  {skipDefaultSceneID && <a onClick={this.removeMaterialTable}>清空</a>}
                  {!skipDefaultSceneID && (
                    <Button
                      type="primary"
                      onClick={() =>
                        this.setState({
                          sceneModal: true,
                        })
                      }
                      disabled={_.isEmpty(actInfo)}
                    >
                      请选择
                    </Button>
                  )}
                  <MaterialDialog
                    visible={sceneModal}
                    onCancel={() =>
                      this.setState({
                        sceneModal: false,
                      })
                    }
                    activityID={actInfo.id}
                    currentId={detail.id || ''}
                    onAdd={this.addMaterialTable}
                    materDatas={[{ id: skipDefaultSceneID || '' }] || []}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <ActivityDialog
          visible={actModal}
          actInfo={actInfo}
          onCancel={() => {
            this.setState({ actModal: false });
            this.forceUpdate();
          }}
          mode="obj"
          onAdd={this.addActivity}
        />

        <div style={{ paddingBottom: 80 }}>
          <Card title="片段管理">
            {seriesForms}

            <Row gutter={24}>
              <Col lg={6} md={6} sm={24}>
                <Button
                  className={styles['dash-btn']}
                  onClick={() => this.addBlock('VOICE_OVER')}
                  icon="plus"
                  type="dashed"
                  disabled={_.isEmpty(actInfo)}
                >
                  添加画外音
                </Button>
              </Col>
              <Col lg={6} md={6} sm={24}>
                <Button className={styles['dash-btn']} onClick={() => this.addBlock('ASIDE')} icon="plus" type="dashed" disabled={_.isEmpty(actInfo)}>
                  添加旁白
                </Button>
              </Col>

              <Col lg={6} md={6} sm={24}>
                <Button className={styles['dash-btn']} onClick={() => this.addBlock('NPC')} icon="plus" type="dashed" disabled={_.isEmpty(actInfo)}>
                  添加对话
                </Button>
              </Col>

              <Col lg={6} md={6} sm={24}>
                <Button
                  className={styles['dash-btn']}
                  onClick={() => this.addBlock('HOT_ZONE')}
                  icon="plus"
                  type="dashed"
                  disabled={_.isEmpty(actInfo)}
                >
                  添加图片热区
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
        <FooterToolbar style={{ width }} extra={<p style={{ color: 'red' }}>请先点击保存，提交本素材的基本信息后才可以添加片段。</p>}>
          <Button onClick={() => this.goBack()}>取消</Button>
          <Button type="primary" onClick={() => this.validate()} loading={submitting}>
            保存
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ material, loading }) => ({
  material,
  loading,
  submitting: loading.effects['material/save'],
}))(ActivityForm);
