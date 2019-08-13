import React from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Button, Form, Select } from 'antd';
import styles from './List.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';
import DynamicDialog from './components/DynamicDialog';

const { Option } = Select;

@connect(({ npc, loading }) => ({
  npc,
  loading: loading.models.npc,
}))
@Form.create()
class DynamicList extends React.Component {
  state = { visible: false };

  componentDidMount() {
    this.loadDynamicList();
  }

  loadDynamicList = (current = 1) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    const params = {
      page: { current, size: 10 },
      ...values,
    };
    dispatch({
      type: 'npc/dynamicList',
      payload: params,
    });
  };

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleAction = async (item, name) => {
    const { dispatch } = this.props;
    let displayType;
    if (name === 'display') {
      switch (item.displayType) {
        case 'HIDE':
          displayType = 'SHOW';
          break;
        case 'SHOW':
          displayType = 'HIDE';
          break;
        default:
      }
    } else {
      displayType = '';
    }
    const params = {
      displayType,
      npcPostId: item.id,
      remove: name === 'remove',
    };
    await dispatch({
      type: 'npc/actionDynamic',
      payload: params,
    });
    this.loadDynamicList();
  };

  handlePublish = async item => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'npc/publish',
      payload: { npcPostId: item.id },
    });
    this.loadDynamicList();
  };

  render() {
    const {
      npc: { dynData },
      form: { getFieldDecorator },
      loading,
      title,
    } = this.props;

    const {
      npcPostsItems: { records, total, pages, current },
    } = dynData;
    const { visible } = this.state;
    const pagination = {
      onChange: this.loadDynamicList,
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
              })(<Input placeholder="请输入 动态名称" style={{ width: 168 }} allowClear />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('postType', {
                initialValue: null,
              })(
                <Select style={{ width: 168 }}>
                  <Option value={null}>全部类型</Option>
                  <Option value="IMAGE">图文</Option>
                  <Option value="VIDEO">视频</Option>
                  <Option value="AUDIO">音频</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('publishStatus', {
                initialValue: null,
              })(
                <Select style={{ width: 168 }}>
                  <Option value={null}>全部状态</Option>
                  <Option value="PUBLISHED">已发布</Option>
                  <Option value="WAITING">待发布</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => this.loadDynamicList()}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleClearForm} type="default">
                清空
              </Button>
            </Form.Item>
            <Button className={styles['btn-new']} type="primary" icon="plus" onClick={() => this.setState({ visible: true })}>
              新建
            </Button>
          </Form>

          <Table
            columns={getColumns(this.handleAction, this.handlePublish)}
            dataSource={mapDataToCols(records)}
            pagination={pagination}
            align="center"
            loading={loading}
            rowKey={item => item.key}
          />
          <DynamicDialog
            visible={visible}
            onCancel={() => {
              this.setState({ visible: false });
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DynamicList;
