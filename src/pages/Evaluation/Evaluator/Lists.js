import React from 'react';
import { Card, Button, Modal, Select, Form, Input, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Lists.less';

const FormItem = Form.Item;

@Form.create()
class Lists extends React.Component {
  state = {
    evaluatorGradeEnum: '',
  };

  componentDidMount() {
    this.goToPage(0, 20);
  }

  goToPage = async (page, size) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'evaluator/searchEvaluators',
      payload: {
        pageBar: {
          pageIndex: page > 0 ? page - 1 : page,
          pageSize: size,
        },
      },
    });
  };

  createActionBtn = item => [
    item.status === 0 ? (
      <Button icon="edit" onClick={() => this.unfreeze(item)}>
        解封
      </Button>
    ) : (
        <Button icon="edit" onClick={() => this.freeze(item)}>
          封禁
      </Button>
      ),
  ];

  unfreeze = async item => {
    const { dispatch } = this.props;
    if (!item) return;
    const { evaluatorId, name } = item;
    const data = { evaluatorGradeEnum: 1, evaluatorId: evaluatorId, name: name };
    await dispatch({
      type: 'evaluator/saveEvaluator',
      payload: data,
    });
    this.goToPage(0,20)
  };

  freeze = async item => {
    const { dispatch } = this.props;
    if (!item) return;
    const { evaluatorId, name } = item;
    const data = { evaluatorGradeEnum: 2, evaluatorId: evaluatorId, name: name };
    await dispatch({
      type: 'evaluator/saveEvaluator',
      payload: data,
    });
    this.goToPage(0,20)
  };

  handleChangeStatus = val => {
    const { dispatch } = this.props;
    this.setState({ evaluatorGradeEnum: val });
    dispatch({
      type: 'evaluator/searchEvaluators',
      payload: {
        evaluatorGradeEnum: val,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        },
      },
    });
  };

  showInviteModal = () => { };

  renderSimpleForm() {
    return (
      <div>
        <Form layout="inline">
          <Form.Item>
            <Select
              placeholder="选择级别"
              style={{ width: '100px' }}
              value={this.state.evaluatorGradeEnum}
              onChange={this.handleChangeStatus}
            >
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="1">常规</Select.Option>
              <Select.Option value="2">第三人</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    const { evaluator } = this.props;
    const { data, loading } = evaluator;
    const { evaluators, pageBar } = data;
    const { dataCount = 0, pageIndex = 1, pageSize = 20 } = pageBar || {};
    return (
      <PageHeaderWrapper title="鉴定师列表">
        <Card>
          <div className={styles.header}>{this.renderSimpleForm()}</div>

          <Table
            dataSource={evaluators}
            loading={loading}
            rowKey="guid"
            pagination={{
              total: dataCount || 0,
              current: pageIndex + 1 || 1,
              showSizeChanger: true,
              onChange: this.goToPage,
              onShowSizeChange: this.goToPage,
              pageSizeOptions: ['20'],
              pageSize: pageSize,
            }}
            onChange={this.handleTableChange}
          >
            <Table.Column title="序号" dataIndex="id" key="id" />
            <Table.Column title="编号" dataIndex="evaluatorId" key="evaluatorId" />
            <Table.Column title="昵称" dataIndex="name" key="name" />
            <Table.Column
              title="操作"
              dataIndex="accountType"
              key="accountType"
              render={(text, record) => (
                <span>
                  {record.accountType === 1 && (
                    <Popconfirm title="确认要升级吗？" onConfirm={() => this.freeze(record)}>
                      <a href="javascript:;">升级</a>
                    </Popconfirm>
                  )}
                  {record.accountType === 2 && (
                    <Popconfirm title="确认要降级吗？" onConfirm={() => this.unfreeze(record)}>
                      <a href="javascript:;">降级</a>
                    </Popconfirm>
                  )}
                </span>
              )}
            />
          </Table>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ evaluator }) => ({
  evaluator,
}))(Lists);
