import React from 'react';
import { Table, message, Divider, Icon } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import styles from '@/pages/Activity/Sale/Common/Detail/ActivityForm.less';

const taskTableColumns = (lists, upItem, downItem, mode) => {
  const { origin, pathname } = window.location;
  const prefix = `${origin}${pathname}#`;
  return [
    {
      title: '前端展示顺序',
      dataIndex: 'i',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '任务ID',
      dataIndex: 'taskId',
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      render: text => {
        if (text === 'INVITATION') {
          return '邀请';
        }
        if (text === 'PUZZLE') {
          return '解谜';
        }
        if (text === 'DRAW') {
          return '抽签';
        }
        return '';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) =>
        mode !== 'view' && (
          <span>
            <a disabled={item.index === 0} onClick={() => upItem(item)}>
              <Icon className={styles.iconfont} type="arrow-up" />
            </a>
            <Divider type="vertical" />
            <a disabled={item.index === lists.length - 1} onClick={() => downItem(item)}>
              <Icon className={styles.iconfont} type="arrow-down" />
            </a>
            <Divider type="vertical" />
            {item.type === 'INVITATION' && (
              <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/task/invited/list/detail?id=${item.taskId}&action=1`}>
                查看
              </a>
            )}
            {item.type === 'PUZZLE' && (
              <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/task/puzzle/list/detail?id=${item.taskId}&action=1`}>
                查看
              </a>
            )}
            {item.type === 'DRAW' && (
              <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/task/randomdraw/list/detail?id=${item.taskId}&action=1`}>
                查看
              </a>
            )}
          </span>
        ),
    },
  ];
};

class TaskTable extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      lists: value && value.length > 0 ? value.map((ele, i) => ({ index: i, i: i + 1, taskId: ele.id, ...ele })) : [],
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      lists: nextProps.value.map((ele, i) => ({ index: i, i: i + 1, taskId: ele.id, ...ele })),
    };
  }

  upItem = async item => {
    const { dispatch, onChange } = this.props;
    const { lists } = this.state;
    const temps = _.cloneDeep(lists);
    const temp = temps[item.index - 1];
    [temps[item.index], temps[item.index - 1]] = [temps[item.index - 1], temps[item.index]];

    const res = await dispatch({
      type: 'activity/sortTask',
      payload: [
        {
          taskId: item.id,
          sort: item.index - 1,
          taskType: item.type,
        },
        {
          taskId: temp.id,
          sort: temp.index + 1,
          taskType: temp.type,
        },
      ],
    });

    if (!res.header || res.header.code !== 2000) {
      message.info('设置失败');
      return;
    }
    const temps2 = temps.map((ele, i) => {
      const { index, ...oths } = ele;
      return { index: i, ...oths };
    });
    this.setState({
      lists: temps2,
    });
    onChange(temps2);
    message.info('设置成功');
  };

  downItem = async item => {
    const { dispatch, onChange } = this.props;
    const { lists } = this.state;
    const temps = _.cloneDeep(lists);
    const temp = temps[item.index + 1];
    [temps[item.index], temps[item.index + 1]] = [temps[item.index + 1], temps[item.index]];

    const res = await dispatch({
      type: 'activity/sortTask',
      payload: [
        {
          taskId: item.id,
          sort: item.index + 1,
          taskType: item.type,
        },
        {
          taskId: temp.id,
          sort: temp.index - 1,
          taskType: temp.type,
        },
      ],
    });

    if (!res.header || res.header.code !== 2000) {
      message.info('设置失败');
      return;
    }
    const temps2 = temps.map((ele, i) => {
      const { index, ...oths } = ele;
      return { index: i, i: i + 1, ...oths };
    });
    this.setState({
      lists: temps2,
    });
    onChange(temps2);
    message.info('设置成功');
  };

  render() {
    const { mode } = this.props;
    const { lists } = this.state;
    return <Table columns={taskTableColumns(lists, this.upItem, this.downItem, mode)} rowKey="taskId" dataSource={lists || []} pagination={false} />;
  }
}

export default connect(({ activity, loading }) => ({
  activity,
  loading,
}))(TaskTable);
