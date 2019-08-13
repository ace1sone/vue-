import React from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Button, Select, Form, Divider, Modal, Badge, Checkbox } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { autobind } from 'core-decorators';
import router from 'umi/router';
import { isEmpty, isArray } from 'lodash';
import moment from 'moment';
import styles from './CardList.less';

const FixedWidthBox = ({ children }) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{children}</div>

@connect(state => ({
  state,
}))
@Form.create({})
@autobind
class ContentList extends React.Component {
  state = {
    data: {
      current: 1,
      pages: 0,
      records: [],
      size: 20,
      total: 0,
    },
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.loadData({ current: 1, size: 20 });
  }

  onPageChange(current) {
    // console.log(current, size)
    const {
      data: { size },
    } = this.state;
    this.loadData({ current, size, ...this.getConditions() });
  }

  getConditions() {
    const {
      form: { getFieldsValue },
    } = this.props;
    return getFieldsValue();
  }

  onSelectChange = (selectedRowKeys, selectedRows) => this.setState({ selectedRowKeys, selectedRows });

  handleTop = ids => async () => {
    if (!isArray(ids) || (isArray(ids) && ids.length < 1)) {
      return;
    }
    const { dispatch } = this.props;
    const { data } = await dispatch({ type: 'contentMgmt/handleTop', payload: { idList: ids.map(v => v.id), isTop: 1 } });
    if (data) {
      const {
        data: { current, size },
      } = this.state;
      this.loadData({ current, size, ...this.getConditions() });
    }
  };

  handleUnTop = ids => async () => {
    if (!isArray(ids) || (isArray(ids) && ids.length < 1)) {
      return;
    }
    const { dispatch } = this.props;
    const { data } = await dispatch({ type: 'contentMgmt/handleTop', payload: { idList: ids.map(v => v.id), isTop: 0 } });
    if (data) {
      const {
        data: { current, size },
      } = this.state;
      this.loadData({ current, size, ...this.getConditions() });
    }
  };

  handleLock = ({ id, status }) => async () => {
    const res =
      status && status === 1
        ? await new Promise(resolve =>
            Modal.confirm({
              title: '提示',
              content: '是否禁用该卡片',
              cancelText: '取消',
              okText: '确定',
              onCancel: () => resolve(false),
              onOk: () => resolve(true),
            })
          )
        : true;
    if (!res) return;
    const { dispatch } = this.props;
    const { data } = await dispatch({ type: 'contentMgmt/handleLock', payload: { id, status } });
    if (data) {
      const {
        data: { current, size },
      } = this.state;
      this.loadData({ current, size, ...this.getConditions() });
    }
  };

  handleDelete = id => async () => {
    const { dispatch } = this.props;
    const { data } = await dispatch({ type: 'contentMgmt/handleDelete', payload: { id } });
    if (data) {
      const {
        data: { current, size },
      } = this.state;
      this.loadData({ current, size, ...this.getConditions() });
    }
  };

  createCard = () => router.push('/contentManagement/card/create');

  toCardDetail = id => () => router.push(`/contentManagement/card/detail?id=${id}`);

  handleSearch() {
    const {
      data: { current, size },
    } = this.state;
    this.loadData({ current, size, ...this.getConditions() });
  }

  handleClear() {
    const {
      form: { resetFields },
    } = this.props;
    const {
      data: { current, size },
    } = this.state;
    resetFields();
    this.loadData({ current, size });
  }

  async loadData({ current, size, req, status } = {}) {
    const { dispatch } = this.props;
    const { data } = await dispatch({
      type: 'contentMgmt/fetchCardList',
      payload: {
        current,
        size,
        req,
        status,
      },
    });
    if (!isEmpty(data)) {
      this.setState({ data });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      selectedRowKeys,
      selectedRows,
      data: { records, total, current, size },
    } = this.state;

    const columns = [
      {
        title: '卡片ID',
        dataIndex: 'id',
        width: 144,
        render: text => <FixedWidthBox>{text}</FixedWidthBox>
      },
      {
        title: '卡片标题',
        dataIndex: 'title',
        width: 224,
        render: text => <FixedWidthBox>{text}</FixedWidthBox>
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        render: text => {
          const format = moment(text)
            .format('YYYY-MM-DD HH:mm:ss')
            .split(' ');
          return (
            <div>
              {format.map(v => (
                <p key={v}>{v}</p>
              ))}
            </div>
          );
        },
        width: 120
      },
      {
        title: '上线时间',
        dataIndex: 'onLineAt',
        render: text => {
          const format = moment(text)
            .format('YYYY-MM-DD HH:mm:ss')
            .split(' ');
          return (
            <div>
              {format.map(v => (
                <p key={v}>{v}</p>
              ))}
            </div>
          );
        },
        width: 120
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => (text === 0 ? <Badge status="success" text="已启用" /> : <Badge status="error" text="已禁用" />),
        width: 72
      },
      {
        title: '是否被推荐',
        dataIndex: 'isRecommend',
        align: 'center',
        render: text => (text === 1 ? '是' : '否'),
        width: 96
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => {
          return (
            <span>
              {record.isTop === 1 ? (
                <a href="javascript:;" onClick={this.handleUnTop([record])}>
                  取消置顶
                </a>
              ) : (
                <a href="javascript:;" onClick={this.handleTop([record])}>
                  置顶
                </a>
              )}
              <Divider type="vertical" />
              {record.status === 1 ? (
                <a href="javascript:;" onClick={this.handleLock({ id: record.id, status: 0 })}>
                  启用
                </a>
              ) : (
                <a href="javascript:;" onClick={this.handleLock({ id: record.id, status: 1 })}>
                  禁用
                </a>
              )}
              <Divider type="vertical" />
              <a href="javascript:;" onClick={this.toCardDetail(record.id)}>
                编辑
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={this.handleDelete(record.id)} style={{ color: 'red' }}>
                删除
              </a>
            </span>
          );
        },
        width: 240
      },
    ];

    function mapDataToCols(list = []) {
      return list.map(v => ({
        id: v.id,
        title: v.title,
        createdAt: v.createdAt,
        onLineAt: v.onLineAt,
        status: v.status,
        isRecommend: v.isRecommend,
        isTop: v.isTop,
        operation: v,
      }));
    }

    const pagination = {
      onChange: this.onPageChange,
      total,
      current,
      pageSize: size,
      showTotal: () => {
        const onChange = e =>
          this.setState({ selectedRowKeys: e.target.checked ? records.map(v => v.id) : [], selectedRows: e.target.checked ? records : [] });

        return (
          <div className={styles.onPaginationLeft}>
            {' '}
            <Checkbox
              checked={records.length === selectedRows.length}
              indeterminate={records.length === selectedRows.length ? false : selectedRows.length > 0}
              className={styles.bottomCheckbox}
              onChange={onChange}
            >
              <span className={styles.checkAllText}>全选</span>
            </Checkbox>{' '}
            <Button className={`${styles.darkBtn} ${styles.mr24px}`} onClick={this.handleTop(selectedRows)}>
              置顶
            </Button>{' '}
            <Button onClick={this.handleUnTop(selectedRows)}>取消置顶</Button>{' '}
          </div>
        );
      },
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <PageHeaderWrapper title="内容卡片管理">
        <Card>
          <Form layout="inline" className={styles.mb1rem}>
            <Form.Item>{getFieldDecorator('req')(<Input style={{ width: 288 }} placeholder="请输入卡片ID或卡片标题" />)}</Form.Item>
            <Form.Item>
              {getFieldDecorator('status')(
                <Select placeholder="全部状态" style={{ width: 168 }}>
                  <Select.Option value="0">启用中</Select.Option>
                  <Select.Option value="1">已禁用</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleSearch} className={`${styles.darkBtn} ${styles.mr24}`}>
                搜索
              </Button>
              <Button onClick={this.handleClear}>清空</Button>
            </Form.Item>
            <Form.Item className={styles.floatRight}>
              <Button onClick={this.createCard} icon="plus" className={styles.darkBtn}>新建卡片</Button>
            </Form.Item>
          </Form>

          <Table
            columns={columns}
            dataSource={mapDataToCols(records)}
            className={styles.hackPaginationActiveItem}
            rowKey={row => row.id}
            rowSelection={rowSelection}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ContentList;
