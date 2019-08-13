import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Input, Button, Form, Select, notification, Modal } from 'antd';
import _ from 'lodash';
import styles from './List.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';

const { Search } = Input;

const { Option } = Select;

@connect(({ story, loading }) => ({
  story,
  loading: loading.models.story,
}))
@Form.create()
class List extends React.Component {
  static defaultProps = {
    addList: false,
  };

  state = {
    createVisable: false,
  };

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const { dispatch, story, title } = this.props;
    const { current = 1, size = 10 } = story.data;
    const status = this.handleReceiptStatus(title);
    if (current === 1) {
      dispatch({
        type: 'story/clearList',
      });
    }

    dispatch({
      type: 'story/fetchList',
      payload: { current, size, status },
    });
  };

  handleSearch = (e, size = 10) => {
    const { form, dispatch, title, addList } = this.props;

    let status;
    let current;
    if (e) {
      status = addList && e.target && e.target.value;
      current = _.isNumber(e) ? e : 1;
    }

    status = this.handleReceiptStatus(title);

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'story/fetchList',
          payload: {
            current,
            size,
            status,
            ...values,
          },
        });
      }
    });
  };

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleOnline = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'story/online',
      payload: { id },
      success: this.handleRes,
    });
  };

  handleOffline = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'story/offline',
      payload: { id },
      success: this.handleRes,
    });
  };

  handleRes = res => {
    if (!res.data || res.header.code !== 2000) {
      notification.error('出错了，请稍后再试');
      return;
    }
    if (res.data) this.initData();
  };

  handleReceiptStatus = title => {
    let status = '';
    switch (title) {
      case '待上线':
        status = 'WAITING_FOR_ONLINE';
        break;
      case '已上线':
        status = 'ONLINE';
        break;
      case '下线':
        status = 'OFFLINE';
        break;
      case '草稿':
        status = 'DRAFT';
        break;
      default:
        status = null;
    }
    return status;
  };

  createHandleOk = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;

    validateFields(['name'], (err, values) => {
      if (!err) {
        const { name } = values;
        dispatch({
          type: 'story/saveStory',
          payload: { name, draftType: 'DRAFT' },
          success: res => {
            if (res.header.code === 4050) {
              notification.error({ message: res.header.msg || '出错了，稍后再试' });
              return;
            }
            if (res.header.code === 2000) router.push(`/story/home/all/edit/${res.data.id}`);
          },
        });
        this.setState({
          createVisable: false,
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      createVisable: false,
    });
  };

  render() {
    const {
      story: { data },
      loading,
      title,
      addList,
      form: { getFieldDecorator },
    } = this.props;
    const { createVisable } = this.state;
    const { records: list, total, pages, current } = data;
    const pagination = {
      onChange: this.handleSearch,
      total,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };
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

    return (
      <PageHeaderWrapper title={title}>
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 24 }}>
            <Form.Item>
              {getFieldDecorator('keyword', {
                initialValue: '',
              })(<Search placeholder="请输入发售ID或名称" style={{ width: 168 }} allowClear />)}
            </Form.Item>
            {addList && (
              <Form.Item>
                {getFieldDecorator('displayRange', {
                  initialValue: '',
                })(
                  <Select style={{ width: 168 }}>
                    <Option value="">所有展示渠道</Option>
                    <Option value={50}>woof剧场APP</Option>
                    <Option value={15}>woof剧场小程序</Option>
                  </Select>
                )}
              </Form.Item>
            )}

            <Form.Item>
              <Button className={styles['btn-search']} type="primary" onClick={this.handleSearch}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleClearForm} type="default">
                清空
              </Button>
            </Form.Item>
            {addList && (
              <Button className={styles['btn-new']} type="primary" icon="plus" onClick={() => this.setState({ createVisable: true })}>
                新建剧情
              </Button>
            )}
          </Form>
          <Table columns={getColumns()} dataSource={mapDataToCols(list)} pagination={pagination} align="center" loading={loading} rowKey="id" />
        </Card>

        <Modal visible={createVisable} title="新建剧情" onOk={this.createHandleOk} onCancel={this.handleCancel} closable>
          <Form.Item {...formItemLayout} label="剧情名称">
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [{ required: true, message: '剧情名称不能为空' }, { max: 30, message: '长度不超过30' }],
            })(<Input placeholder="必填，限30字以内" />)}
          </Form.Item>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default List;
