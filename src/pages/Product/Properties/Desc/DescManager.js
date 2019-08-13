import React from 'react';
import { Button, Table, Form, Input, Badge, Popconfirm, Divider } from 'antd';

import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import _ from 'lodash';
import styles from './Desc.less';
import { mapDataToColumns } from './table.config';
import DescConfirm from './DescConfirm';

class DescManager extends React.Component {
  componentDidMount() {
    this.jointId = null;

    this.goToPage(1, 20);
  }

  goToPage = (page, s) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'desc/getDescs',
      payload: {
        size: s,
        current: page,
        pageBar: {
          pageIndex: page,
          pageSize: s,
        },
      },
    });
  };

  handleEdit = async id => {
    const result = await this.checkSpu(id);
    if (!result) return;
    router.push(`/product/properties/desc/edit/${id}`);
  };

  handleView = id => {
    router.push(`/product/properties/desc/detail/${id}`);
  };

  handleAddDesc = async () => {
    router.push(`/product/properties/desc/new`);
  };

  columns = () => [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '描述ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '描述名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '创建时间',
      dataIndex: 'date',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      key: 'status',

      render: status => {
        let text = ' 禁用中';
        let type = 'error';
        if (status === 0 || status === '0') {
          text = ' 启用中';
          type = 'success';
        }
        return (
          <React.Fragment>
            <Badge status={type} />
            <span>{text}</span>
          </React.Fragment>
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: item => (
        <div>
          <a onClick={() => this.handleEdit(item.id)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleView(item.id)}>查看</a>
          <Divider type="vertical" />
          {item.status === 0 || item.status === '0' ? (
            <Popconfirm title="确认要禁用吗" onConfirm={e => this.toggleStatus(e, item)}>
              <a className={styles.buttonDanger} type="danger">
                禁用
              </a>
            </Popconfirm>
          ) : (
            <Popconfirm title="确认要启用吗" onConfirm={e => this.toggleStatus(e, item)}>
              <a className={styles.buttonNormal} type="danger">
                启用
              </a>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  search = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'desc/getDescs',
      payload: {
        req: value || '',
        size: 20,
        current: 1,
        pageBar: {
          pageIndex: 1,
          pageSize: 20,
        },
      },
    });
  };

  downloadSpec = async (id, subID) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'desc/downloadDesc',
      payload: {
        jointId: id,
        subJointId: subID,
        type: 2,
      },
    });
  };

  // continue if true
  checkSpu = async id => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'desc/checkDesc',
      payload: {
        jointId: id,
        type: 2,
      },
    });

    if (res.header.code !== 2000) {
      return false;
    }

    if (res.data.status) return true;

    const result = await DescConfirm.show();
    if (result === 2) {
      return true;
    }

    if (result === 0) {
      await this.downloadSpec(id);
    }

    return false;
  };

  toggleStatus = async (e, item) => {
    const { dispatch } = this.props;

    if (item.status === 0) {
      const result = await this.checkSpu(item.id);
      if (!result) return;
    }

    const res = await dispatch({
      type: 'desc/changeStatus',
      payload: {
        status: Number(item.status) === 0 ? 1 : 0,
        id: item.id,
      },
    });

    if (res.header.code !== 2000) return;
    this.search();
  };

  mapTableData = data =>
    data.records.map(item => ({
      id: item.id,
      name: item.name,
      updateTime: item.updatedAt,
      status: item.status === 0,
    }));

  createActionBtn = item => [
    <Button icon="edit" onClick={() => router.push(`/eval/evaluator/requirement/edit/${item.objectId}`)}>
      纠错
    </Button>,
  ];

  renderHeaderForm() {
    return (
      <div style={{ backgroundColor: 'white', padding: 24 }}>
        <Form layout="inline" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Form.Item>
              <Input.Search
                placeholder="请输入描述ID或描述名称"
                enterButton="搜索"
                onSearch={keyword => this.search(keyword)}
                style={{ width: 300 }}
                allowClear
              />
            </Form.Item>
            {/* <Form.Item>
              <Button onClick={this.handleSearch} type="default">
                清空
              </Button>
            </Form.Item> */}
          </div>
          <Form.Item style={{ marginRight: 0 }}>
            <Button onClick={this.handleAddDesc} type="primary" icon="plus">
              新建
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    const { data } = this.props;
    const records = _.get(data, 'records', []);
    const { total = 0, current = 1, size = 20 } = data || {};

    return (
      <PageHeaderWrapper title="描述管理">
        <div>{this.renderHeaderForm()}</div>
        <Table
          dataSource={mapDataToColumns(records)}
          columns={this.columns()}
          style={{ backgroundColor: 'white', padding: 24, marginTop: -24 }}
          pagination={{
            total: parseInt(total, 0) || 0,
            current: current || 1,
            onChange: this.goToPage,
            onShowSizeChange: this.goToPage,
            pageSize: size,
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ desc }) => ({
  data: desc.data,
});

export default connect(mapStateToProps)(DescManager);
