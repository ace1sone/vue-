import React from 'react';
import { Card, Button, Form, Col, Row, Input, Menu, Table, Radio, Modal, message, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import qs from 'query-string';
import moment from 'moment';
import { spuColumns, taskColumns } from '../Common/TableColumns';
import { taskStatus } from '../Common/SwitchForm';
import { formItemLayout, formItemFillRow } from '../Common/FormLayout';
import SpuDialog from '../Common/SpuDialog';
import SkuDialog from '../Common/SkuDialog';
import TaskDialog from '../Common/TaskDialog';
import RulesForm from './RulesForm';
import TaskData from './TaskData';
import ActivityDialog from '../Common/ActivityDialog';
import TaskFooter from '../Common/TaskFooter';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Detail.less';

const { TextArea } = Input;
const tenMinutes = 10 * 6 * 10000;

@Form.create()
class InvitedForm extends React.Component {
  state = {
    spuModal: false,
    spuId: '',
    skuModal: false,
    disabled: false,
    currentSpu: { skuRespList: [] },
    actModal: false,
    taskModal: false,
  };

  componentDidMount() {
    this.LoadInvited();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'task/clearDetail', payload: {} });
  }

  goBack = () => {
    router.push('/activity/task/invited/list');
  };

  LoadInvited = () => {
    const { dispatch, location } = this.props;
    const { id, action } = qs.parse(location.search);
    if (action === '1') {
      this.setState({ disabled: true });
    }
    if (!_.isEmpty(id)) {
      dispatch({ type: 'task/loadInvited', payload: { id, type: 'INVITATION' } });
    }
  };

  submit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll, getFieldValue },
      location,
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    const { id } = qs.parse(location.search);
    let correct = false;

    validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        const { spuInfo, actInfo, relatedTask, ...other } = values;
        // delSpuIds 删除商品 actInfo关联的活动信息 relatedTask关联的任务信息  spuInfo 商品信息
        this.RulesForm.props.form.validateFields(async (err, val) => {
          if (!err) {
            const { time, numberLimit, issuanceNumber, issuanceTime, issuanceMethod, keys, syncActivityTime, ...otherVal } = val;
            // 开始、结束时间校验
            if (!syncActivityTime && time && time.length > 0) {
              if (moment(time[0]).valueOf() <= moment(Date.now()).valueOf() + tenMinutes) {
                message.error('任务开始时间距当前事件不能少于10分钟!');
                return;
              }
              if (moment(time[1]).valueOf() <= moment(time[0]).valueOf() + tenMinutes) {
                message.error('任务结束时间距任务开始时间不能少于10分钟!');
                return;
              }
            }
            // 购买资格发放时间校验
            if (issuanceTime && issuanceMethod === 'TIMED') {
              if (moment(issuanceTime).valueOf() > moment(time[1]).valueOf() + tenMinutes) {
                message.error('购买资格发放时间距任务结束时间至少提前10分钟');
                return;
              }
            }

            // 商品的校验
            if (relatedProducts && relatedProducts.length > 0) {
              correct = relatedProducts.every(item => {
                let hasAmt = false;
                if (item.skuRespList && item.skuRespList.some(__ => __.stock > 0)) {
                  hasAmt = !hasAmt;
                } else {
                  message.error(`SPUID：${item.spuId}的SKU库存数量不能为0`);
                  hasAmt = false;
                }
                return hasAmt;
              });
            } else {
              correct = true;
            }

            if (!actInfo.id) {
              message.error('请关联发售活动!');
              return;
            }

            if (!correct) return;

            const rulesParams = {
              ...otherVal,
              issuanceTime: issuanceMethod === 'TIMED' ? issuanceTime.format('YYYY-MM-DD HH:mm:ss') : '',
              issuanceMethod,
              issuanceNumber: numberLimit ? issuanceNumber : 0,
            };

            const params = {
              ...other,
              ...rulesParams,
              startTime: syncActivityTime ? '' : time[0].format('YYYY-MM-DD HH:mm:ss'),
              endTime: syncActivityTime ? '' : time[1].format('YYYY-MM-DD HH:mm:ss'),
              syncActivityTime,
              relatedTask: relatedTask.id ? relatedTask : null,
              activityId: actInfo.id,
              relatedProducts,
            };
            if (correct) {
              if (id) {
                await dispatch({
                  type: 'task/editInvited',
                  payload: { ...params, id },
                });
              } else {
                await dispatch({
                  type: 'task/invited',
                  payload: params,
                });
              }
              this.goBack();
            }
          }
        });
      }
    });
  };

  editActivity = () => {
    this.setState({ actModal: true });
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      relatedProducts: [],
    });
    if (this.RulesForm) {
      this.RulesForm.props.form.setFieldsValue({
        time: undefined,
        syncActivityTime: false,
      });
    }
  };

  addActivity = data => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ actInfo: data });
  };

  addSpuTable = data => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    const { spuId, ...other } = data;
    relatedProducts.push({ spuId, visibility: true, buyAbility: false, skuRespList: [], ...other });
    setFieldsValue({ relatedProducts });
  };

  removeSpuTable = async row => {
    const { spuId } = row;
    const { form, location } = this.props;
    const { id } = qs.parse(location.search);
    const relatedProducts = form.getFieldValue('relatedProducts');
    const newSpus = relatedProducts.filter(key => key.spuId !== spuId);
    const delSpuIds = form.getFieldValue('delSpuIds');
    if (!_.isEmpty(id)) {
      relatedProducts.forEach(every => {
        if (every.spuId === row.spuId) {
          delSpuIds.push(every.spuId);
        }
      });
    }
    form.setFieldsValue({
      relatedProducts: newSpus,
      delSpuIds: [...new Set(delSpuIds)],
    });
  };

  delete = () => {
    const { location, dispatch } = this.props;
    const { id } = qs.parse(location.search);
    Modal.confirm({
      title: '提示',
      content: '是否删除本次任务',
      onOk: async () => {
        await dispatch({ type: 'task/delete', payload: { id, type: 'INVITATION' } });
        this.goBack();
      },
      okText: '确认',
      cancelText: '取消',
    });
  };

  onCrash = () => {
    const { location } = this.props;
    const { action } = qs.parse(location.search);
    if (!action) {
      Modal.confirm({
        title: '提示',
        content: '是否放弃本次新建任务',
        onOk: this.goBack,
        okText: '确认',
        cancelText: '取消',
      });
      return;
    }
    this.goBack();
  };

  showSkuDialog = item => {
    const { form } = this.props;
    const relatedProducts = form.getFieldValue('relatedProducts');
    this.setState({ skuModal: true, spuId: item.spuId, currentSpu: relatedProducts.find(ele => ele.spuId === item.spuId) });
  };

  handleSwitchChange = (record, name) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    setFieldsValue({
      relatedProducts: relatedProducts.map(ele => {
        if (ele.spuId === record.spuId) {
          const { visibility, buyAbility, ...other } = ele;
          if (name === 'visibility') return { visibility: !record[name], buyAbility, ...other };
          if (name === 'buyAbility') return { buyAbility: !record[name], visibility, ...other };
        }
        return ele;
      }),
    });
  };

  saveSkuform = (newskuRespList, spuId) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    setFieldsValue({
      relatedProducts: relatedProducts.map(ele => {
        if (ele.spuId === spuId) {
          const { skuRespList, ...other } = ele;
          return { skuRespList: newskuRespList, ...other };
        }
        return ele;
      }),
    });
  };

  handleStock = (sum, spuId) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    relatedProducts.forEach(every => {
      if (every.spuId === spuId) {
        const eve = every;
        eve.initSkuStock = sum;
      }
    });
    this.setState({ skuModal: false });
  };

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  handleAddTask = data => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ relatedTask: data });
  };

  removeTaskTable = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      relatedTask: {},
    });
  };

  showTaskDialog = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    if (!getFieldValue('actInfo').id) {
      message.error('请关联发售活动!');
    } else {
      this.setState({ taskModal: true });
    }
  };

  handleCompleteResult = current => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ reward: current, relatedProducts: [] });
  };

  render() {
    const {
      task: { inviteDetail },
      form: { getFieldDecorator, getFieldValue },
      loading,
      location,
    } = this.props;
    const { spuModal, skuModal, spuId, disabled, currentSpu, actModal, taskModal } = this.state;
    const { action, id } = qs.parse(location.search);
    getFieldDecorator('relatedProducts', { initialValue: !_.isEmpty(inviteDetail.relatedProducts) ? inviteDetail.relatedProducts : [] });
    getFieldDecorator('delSpuIds', { initialValue: [] });
    getFieldDecorator('actInfo', { initialValue: !_.isEmpty(inviteDetail.actInfo) ? inviteDetail.actInfo : {} });
    getFieldDecorator('relatedTask', { initialValue: !_.isEmpty(inviteDetail.relatedTask) ? inviteDetail.relatedTask : {} });
    getFieldDecorator('reward', { initialValue: !_.isEmpty(inviteDetail.reward) ? inviteDetail.reward : 'NONE' });

    const actInfo = getFieldValue('actInfo');
    const relatedProducts = getFieldValue('relatedProducts');
    const relatedTask = getFieldValue('relatedTask');
    const reward = getFieldValue('reward');
    return (
      <PageHeaderWrapper title={id ? '编辑任务' : '新建任务'} wrapperClassName={styles.advancedForm}>
        <Menu mode="horizontal" selectable defaultSelectedKeys={['basicInfo']} onClick={this.handleMenuClick} style={{ marginBottom: 20 }}>
          <Menu.Item key="basicInfo">基础信息</Menu.Item>
          <Menu.Item key="rulesInfo">规则信息</Menu.Item>
          <Menu.Item key="product">发售商品</Menu.Item>
          <Menu.Item key="limit">上手限制</Menu.Item>
          <Menu.Item key="taskData">任务数据</Menu.Item>
        </Menu>
        <Spin spinning={loading === undefined ? false : !!loading}>
          <div className={styles.card} id="basicInfo">
            <Card title="基础信息" bordered={false}>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="任务ID">
                    <span className="ant-form-text">{inviteDetail.id}</span>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="任务状态">
                    {taskStatus(inviteDetail)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="任务标题">
                    {action !== '1' ? (
                      getFieldDecorator('title', {
                        initialValue: inviteDetail.title || '',
                        rules: [
                          {
                            required: true,
                            message: '任务标题必填的哦！',
                          },
                          { max: 31, message: '任务标题不能超过30个字!' },
                        ],
                      })(<Input placeholder="请输入任务标题,限制30字以内" />)
                    ) : (
                      <span className="ant-form-text">{inviteDetail.title}</span>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="任务名称">
                    {action !== '1' ? (
                      getFieldDecorator('name', {
                        initialValue: inviteDetail.name || '',
                        rules: [
                          {
                            required: true,
                            message: '任务名称必填的哦！',
                          },
                          { max: 31, message: '任务名称不能超过30个字!' },
                        ],
                      })(<Input placeholder="请输入任务名称,限制30字以内" />)
                    ) : (
                      <span className="ant-form-text">{inviteDetail.name}</span>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="关联活动名称">
                    <span>{actInfo.title}</span> {actInfo.title && !id && <a onClick={this.editActivity}>修改</a>}
                    {_.isEmpty(actInfo) && (
                      <Button type="primary" onClick={() => this.setState({ actModal: true })}>
                        关联发售
                      </Button>
                    )}
                  </Form.Item>
                </Col>
                {actInfo.id && (
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="关联活动Id">
                      <span>{actInfo.id}</span>
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row gutter={24}>
                <Col sm={24}>
                  <Form.Item {...formItemFillRow} label="任务规则">
                    {action !== '1' ? (
                      getFieldDecorator('rule', {
                        initialValue: inviteDetail.rule || '',
                        rules: [
                          {
                            required: true,
                            message: '任务规则必填的哦！',
                          },
                          { max: 301, message: '任务规则不能超过300个字!' },
                        ],
                      })(<TextArea placeholder="添加任务规则，限制300字以内" style={{ width: 960, height: 88 }} />)
                    ) : (
                      <span className="ant-form-text">{inviteDetail.rule}</span>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </div>
          <div className={styles.card} id="rulesInfo">
            <RulesForm
              detail={{ inviteDetail, action }}
              disabled={disabled}
              actInfo={actInfo}
              relatedTask={relatedTask}
              chooesResult={this.handleCompleteResult}
              wrappedComponentRef={node => {
                this.RulesForm = node;
              }}
            />
          </div>
          <div className={styles.card} id="product">
            <Card title="关联发售商品" bordered={false}>
              <Table
                columns={spuColumns(this.removeSpuTable, this.showSkuDialog, this.handleSwitchChange, action)}
                rowKey="spuId"
                dataSource={relatedProducts || []}
                pagination={false}
                bordered
              />
              {!_.isEmpty(actInfo) && action !== '1' && reward === 'UNLOCK_PRODUCT_BUY_ABILITY' && (
                <Button className={styles['add-spu-btn']} type="dashed" icon="plus" onClick={() => this.setState({ spuModal: true })}>
                  添加商品
                </Button>
              )}
              <SpuDialog
                visible={spuModal}
                onCancel={() => this.setState({ spuModal: false })}
                onAdd={this.addSpuTable}
                spuDatas={relatedProducts || []}
                actInfo={actInfo}
              />
              <SkuDialog visible={skuModal} onCancel={this.handleStock} onSave={this.saveSkuform} spuObj={{ spuId, id, currentSpu, action }} />
              <ActivityDialog visible={actModal} actInfo={actInfo} onCancel={() => this.setState({ actModal: false })} onAdd={this.addActivity} />
            </Card>
          </div>
          <div className={styles.card} id="limit">
            <Card title="任务上手限制" bordered={false}>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="任务是否直接可做">
                    {action !== '1' ? (
                      getFieldDecorator('restriction', {
                        initialValue: inviteDetail.restriction || 'NO_RESTRICTION',
                      })(
                        <Radio.Group onChange={e => e.target.value === 'NO_RESTRICTION' && this.removeTaskTable()}>
                          <Radio value="NO_RESTRICTION">直接可做</Radio>
                          <Radio value="AFTER_OTHER_TASK">完成其他任务后</Radio>
                        </Radio.Group>
                      )
                    ) : (
                      <span className="ant-form-text">{relatedTask.id ? '完成其他任务后' : '直接可做'}</span>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <p style={{ color: 'red', fontSize: 16, lineHeight: '20px' }}>
                *邀请获取抽签码任务仅能与抽签任务一一对应，即形式只能为：抽签登记（前置）+邀请获得更多抽签码（后置）。请谨慎操作。
              </p>
              {relatedTask.id ? (
                <Table columns={taskColumns(this.removeTaskTable, action)} rowKey="id" dataSource={[relatedTask] || []} pagination={false} bordered />
              ) : (
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item {...formItemLayout} label="任务可做条件">
                      {action !== '1' ? (
                        <Button
                          type="primary"
                          disabled={getFieldValue('restriction') === 'NO_RESTRICTION'}
                          onClick={this.showTaskDialog}
                          loading={loading}
                        >
                          请选择
                        </Button>
                      ) : null}
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <TaskDialog
                visible={taskModal}
                taskData={relatedTask}
                onAdd={this.handleAddTask}
                actInfo={actInfo}
                onCancel={() => this.setState({ taskModal: false })}
              />
            </Card>
          </div>
          <div className={styles.card} style={{ paddingBottom: 60 }} id="taskData">
            <TaskData detail={inviteDetail} completeResult={reward} />
          </div>
          <TaskFooter action={action} loading={loading} goBack={this.goBack} onCrash={this.onCrash} onDelete={this.delete} submit={this.submit} />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ task, loading }) => ({
  task,
  loading: loading.models.task,
}))(InvitedForm);
