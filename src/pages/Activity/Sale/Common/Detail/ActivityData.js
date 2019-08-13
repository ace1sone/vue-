import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper/index';
import {connect} from "dva/index";
import { Spin, Card, Button, Modal, Icon, } from 'antd'
import moment from 'moment';

import { noticeRes } from '../common';
import { getStatus, getTaskType, getIndex, INVITATION, PUZZLE, STARTED, ENDED, } from './ActivityData.config'

import styles from './ActivityData.less';

class ActivityData extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this.initData();
  }
  
  initData = () => {
    const { dispatch, match: { params: { id, } } } = this.props;

    dispatch({
      type: 'activity/getTaskData',
      payload: {
        activityId: id,
      }
    });
  }
  
  handleOpen = task => () => {
    Modal.confirm({
      title: '提示',
      content: '是否立即发放名额？',
      icon: <Icon type="exclamation-circle" theme="filled" />,
      onOk: () => {
        const { dispatch, } = this.props;

        dispatch({
          type: 'activity/batch',
          payload: {
            id: task.taskID,
            type: 'INVITATION',
          },
          success: this.handleRes,
        });
      },
    });
  }

  handleRes = (res) => {
    noticeRes(res);
    if (res.data) {
      setTimeout(this.initData, 300);
    }
  }

  renderCards = (list) => list.map((task, i) => (
    <Card title={getIndex(i)} key={task.taskID} style={{marginBottom: '20px'}}>
      <div>{this.renderCard(task, i)}</div>
    </Card>      
  ))

  renderCard = (task) => {
    const fields = this.getFormatData(task);
    return (
      <Fragment>
        {fields.map(item => (
          <div key={item.key} className={styles.item}>
            <span className={styles['item-title']}>{item.key}:</span>
            <span className={styles['item-text']}>
              {item.render ? item.render() : item.value}
            </span>
          </div>
        ))}
      </Fragment>
    )
  }

  getFormatData = (task) => {
    const { invitaionTaskType } = task.invitationTaskStatistics || {};

    let fields = [
      {
        key: '任务id',
        value: task.taskID,
      },
      {
        key: '任务状态',
        render: () => getStatus(task.taskStatus),
      },
      {
        key: '任务标题',
        value: task.taskName,
      },
      {
        key: '任务类型',
        value: getTaskType(task.taskType) + (task.taskType === INVITATION ? `-${invitaionTaskType}` : ''),
      },
    ]

    if (task.taskType === PUZZLE) {
      const item = task.puzzleTaskStatistics;
      fields = fields.concat([
        {
          key: '解谜参与人数',
          value: item.joinNumber,
        },
        {
          key: '答对人数',
          value: item.answerRightNumber,
        },
        {
          key: '任务结束时间',
          value: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          key: '购买资格发放数量',
          render: () => (
            <Fragment>
              <span className={styles['num-span']}>{item.proportion}</span>
              {
                (task.taskStatus === STARTED || task.taskStatus === ENDED)
                ? 
                  <Button type="primary" onClick={this.handleOpen(task)} disabled={item.quotaStatus > 1}>
                    发放
                  </Button>
                : null
              }
            </Fragment>
          ),
        },
      ])
    } else if (task.taskType === INVITATION) {
      const item = task.invitationTaskStatistics;
      fields = fields.concat([
        {
          key: '拉新参与人数',
          value: item.inviteesNumber,
        },
        {
          key: '成功拉新人数',
          value: item.increasedNumber,
        },
        {
          key: '任务结束时间',
          value: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      ])
    }

    return fields;
  }

  renderBody = (taskData) => {
    const renderCards = this.renderCards(taskData);
    return (
      (taskData && taskData.length > 0) ? renderCards : (<Card>没有查询到数据</Card>)
    )
  }

  render(){
    const { activity: { taskData }, loading, } = this.props;
    
    return(
      <PageHeaderWrapper title="任务数据">
        {
          loading 
          ?
            <div style={{width: '100%', height: '100%', textAlign: 'center'}}>
              <Spin />
            </div>
          :
            this.renderBody(taskData)
        }
      </PageHeaderWrapper>
    )
  }
}

export default connect(({ activity, loading }) => ({
  activity,
  loading: loading.effects['activity/getTaskData'],
}))(ActivityData);
