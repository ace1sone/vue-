import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Input, Button, Form, Select } from 'antd';
import styles from './List.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';

const { Option } = Select;

@connect(({ task, loading }) => ({
  task,
  loading: loading.models.task,
}))
@Form.create()
class List extends React.Component {
  state = {};

  componentDidMount() {
    this.loadTasks();
  }

  loadTasks = (current = 1) => {
    const {
      dispatch,
      form: { getFieldsValue },
      type,
    } = this.props;
    const search = getFieldsValue();
    let currentType = '';
    switch (type) {
      case 'invited':
        currentType = 'INVITATION';
        break;
      case 'puzzle':
        currentType = 'PUZZLE';
        break;
      case 'randomdraw':
        currentType = 'DRAW';
        break;
      default:
    }

    const params = {
      current,
      size: 10,
      ...search,
      type: currentType,
    };
    dispatch({
      type: 'task/fetchList',
      payload: params,
    });
  };

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleChangeRouter = type => {
    switch (type) {
      case 'invited':
        router.push(`/activity/task/invited/list/detail`);
        break;
      case 'puzzle':
        router.push(`/activity/task/puzzle/list/detail`);
        break;
      case 'randomdraw':
        router.push(`/activity/task/randomdraw/list/detail`);
        break;
      default:
    }
  };

  render() {
    const {
      task: { data },
      form: { getFieldDecorator },
      loading,
      title,
      type,
    } = this.props;
    const { records, total, pages, current } = data;
    const pagination = {
      onChange: this.loadTasks,
      total,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };

    return (
      <PageHeaderWrapper title={title}>
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 24 }}>
            <Form.Item>
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input placeholder="请输入 任务Id/任务Code/任务名称" style={{ width: 260 }} allowClear />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('status', {
                initialValue: null,
              })(
                <Select style={{ width: 168 }}>
                  <Option value={null}>请选择任务状态</Option>
                  <Option value="WAITING">待开始</Option>
                  <Option value="STARTED">已开始</Option>
                  <Option value="ENDED">已结束</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => this.loadTasks()}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleClearForm} type="default">
                清空
              </Button>
            </Form.Item>
            <Button className={styles['btn-new']} type="primary" icon="plus" onClick={() => this.handleChangeRouter(type)}>
              新建
            </Button>
          </Form>

          <Table
            columns={getColumns(type)}
            dataSource={mapDataToCols(records)}
            pagination={pagination}
            align="center"
            loading={loading}
            rowKey="id"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
