import React from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Button, Form, Select } from 'antd';
import router from 'umi/router';
import styles from './List.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';

// const { Option } = Select;

@connect(({ npc, loading }) => ({
  npc,
  loading: loading.models.npc,
}))
@Form.create()
class RolesList extends React.Component {
  state = {};

  componentDidMount() {
    this.loadRoles();
  }

  loadRoles = (current = 1) => {
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
      type: 'npc/roles',
      payload: params,
    });
  };

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleAction = async item => {
    const { dispatch } = this.props;
    const { npcId, status } = item;
    let npcStatus = '';
    if (status === 'ENABLE') {
      npcStatus = 'DISABLE';
    } else {
      npcStatus = 'ENABLE';
    }
    await dispatch({ type: 'npc/disabled', payload: { npcId, npcStatus } });
    this.loadRoles();
  };

  render() {
    const {
      npc: { rolesdata },
      form: { getFieldDecorator },
      loading,
      title,
    } = this.props;

    const {
      npcInfoItems: { records, total, pages, current },
    } = rolesdata;

    const pagination = {
      onChange: this.loadRoles,
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
              })(<Input placeholder="请输入 NPC 名称" style={{ width: 260 }} allowClear />)}
            </Form.Item>
            {/* <Form.Item>
              {getFieldDecorator('status', {
                initialValue: null,
              })(
                <Select style={{ width: 168 }}>
                  <Option value={null}>请选择状态</Option>
                  <Option value="ENABLE">启用</Option>
                  <Option value="DISABLE">禁用</Option>
                </Select>
              )}
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" onClick={() => this.loadRoles()}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleClearForm} type="default">
                清空
              </Button>
            </Form.Item>
            <Button className={styles['btn-new']} type="primary" icon="plus" onClick={() => router.push('/activity/npc/roles/list/detail')}>
              新建
            </Button>
          </Form>

          <Table
            columns={getColumns(this.handleAction)}
            dataSource={mapDataToCols(records || [])}
            pagination={pagination}
            align="center"
            loading={loading}
            rowKey={item => item.npcId}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RolesList;
