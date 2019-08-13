import React, { Fragment } from 'react';
import { Table, Divider, message, Button, Modal, Form, Input, notification } from 'antd';

import { connect } from 'dva';
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import router from 'umi/router';
import MaterialDialog from '@/pages/Story/Home/Common/MaterialDialog';

const getColumns = (setStart, mode) => {
  const columns = [
    {
      title: '素材ID',
      dataIndex: 'id',
    },
    {
      title: '素材名称',
      dataIndex: 'name',
    },
    {
      title: '跳转数量',
      dataIndex: 'skipCount',
    },
    {
      title: '前置素材ID',
      dataIndex: 'beforeSceneIDs',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 260,
      render: ({ type, beforeSceneIDs, id }) => (
        <div>
          {type === 'ROOT' && '当前素材为起点 '}
          {mode !== 'view' && (
            <span>
              {_.isEmpty(beforeSceneIDs) && type !== 'ROOT' && <a onClick={() => setStart(id)}>设为起点</a>}
              {((_.isEmpty(beforeSceneIDs) && type !== 'ROOT') || type === 'ROOT') && <Divider type="vertical" />}
              <a onClick={() => router.push(`/story/material/all/edit/${id}`)}>编辑</a>
              <Divider type="vertical" />
            </span>
          )}
          <a onClick={() => router.push(`/story/material/all/detail/${id}`)}>查看</a>
        </div>
      ),
    },
  ];

  return columns;
};

const mapDataToCols = (records = []) =>
  records.map((item, i) => ({
    key: item.id,
    index: i + 1,
    id: item.id,
    activityName: item.story ? item.story.name : '',
    activityStatus: item.story ? item.story.status : '',
    beforeSceneIDs: !_.isEmpty(item.beforeSceneIDs) ? item.beforeSceneIDs.join(',') : '',
    name: item.name,
    skipCount: item.skipCount,
    type: item.type,
    actions: { status: item.story ? item.story.status : '', type: item.type, beforeSceneIDs: item.beforeSceneIDs, id: item.id },
  }));

@Form.create()
class MaterialTable extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      materModal: false,
      createVisable: false,
      showOps: false,
      addedList: [], // 剧情页添加素材关联专用的list
      lists: value && value.length > 0 ? value : [],
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      lists: nextProps.value,
    };
  }

  setStartMater = async id => {
    const { dispatch, onChange } = this.props;
    const { lists } = this.state;
    const temps = _.cloneDeep(lists).map(ele => {
      const ele1 = ele;
      if (ele1.id === id) {
        ele1.type = 'ROOT';
      }
      if (ele1.id !== id && ele1.type === 'ROOT') {
        ele1.type = '';
      }
      return ele1;
    });

    const res = await dispatch({
      type: 'story/setSceneStart',
      payload: {
        id,
      },
    });

    if (res.header && res.header.code === 2000) {
      this.setState({
        lists: temps,
      });
      onChange(temps);
      message.info('设置成功');
    }
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

  addTable = item => {
    const { addedList } = this.state;
    // const { onChange } = this.props;

    this.setState({ addedList: [...addedList, item] });
    // onChange(addedList);
  };

  render() {
    const { lists, materModal, createVisable, showOps, addedList } = this.state;
    const {
      mode,
      plotId,
      form: { getFieldDecorator },
    } = this.props;
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
      <Fragment>
        <Table columns={getColumns(this.setStartMater, mode)} dataSource={mapDataToCols(lists)} align="center" pagination={false} rowKey="id" />
        {mode !== 'view' && (
          <Button
            icon="plus"
            onClick={() => this.setState({ showOps: true })}
            style={{ width: '100%', background: '#FFFBE6', color: '#FAAD14', marginTop: 10 }}
          >
            添加素材
          </Button>
        )}

        <Modal visible={showOps} title="添加素材" closable onCancel={() => this.setState({ showOps: false })} footer={null}>
          <div style={{ textAlign: 'center', paddingBottom: 10 }}>
            <Button type="primary" style={{ width: 230 }} onClick={() => this.setState({ createVisable: true, showOps: false })}>
              新建
            </Button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" style={{ width: 230 }} onClick={() => this.setState({ materModal: true, showOps: false })}>
              添加
            </Button>
          </div>
        </Modal>

        <Modal visible={createVisable} title="新建剧情" onOk={this.createHandleOk} onCancel={this.handleCancel} closable>
          <Form.Item {...formItemLayout} label="剧情名称">
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [{ required: true, message: '剧情名称不能为空' }, { max: 30, message: '长度不超过30' }],
            })(<Input placeholder="必填，限30字以内" />)}
          </Form.Item>
        </Modal>

        <MaterialDialog
          visible={materModal}
          onCancel={() => this.setState({ materModal: false })}
          onAdd={this.addTable}
          plotId={plotId}
          materDatas={addedList || []}
        />
      </Fragment>
    );
  }
}

export default connect(({ story, loading }) => ({
  story,
  loading,
}))(MaterialTable);
