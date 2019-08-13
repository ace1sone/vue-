import React, { Fragment } from 'react';
import { Table, Button, Icon, Input, message, Popconfirm, Divider, Col, Row, Form, Radio, Modal } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';

import styles from './specform.less';

@Form.create()
class TableForm extends React.Component {
  cacheOriginData = {};

  state = {
    data: { ssDetailDTOList: [] },
    loading: false,
    value: { ssDetailDTOList: [] },
  };

  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        data: props.value,
        value: props.value,
      };
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  /** 属性列表 实时编辑功能方法start */

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (_.get(newData, 'ssDetailDTOList', null) || _.get(data, 'ssDetailDTOList', [])).filter(item => item.id === key || item.index === key)[0];
  }

  toggleEditable = async (e, key) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (newData.id > 0) {
        const res = await dispatch({
          type: 'spec/checkSpu',
          payload: {
            jointId: newData.specId,
            subJointId: newData.id,
            type: 1,
          },
        });
        if (res.data && !res.data.status) {
          this.download(newData.secId, newData.id, '编辑');
          return;
        }
      }
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  toggleEnable = async (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const { dispatch, onChange } = this.props;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);

    if (target) {
      if (target.status === 0) {
        if (newData.id > 0) {
          const res = await dispatch({
            type: 'spec/checkSpu',
            payload: {
              jointId: newData.specId,
              subJointId: newData.id,
              type: 1,
            },
          });
          if (res.data && !res.data.status) {
            this.download(newData.secId, newData.id, '禁用');
          } else {
            target.status = 1;
          }
        } else {
          target.status = 1;
        }
      } else {
        target.status = 0;
      }
      this.setState({ data: newData });
      onChange(newData);
    }
  };

  newMember = () => {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = _.cloneDeep(data);

    if ((newData.ssDetailDTOList || []).some(ele => ele.editable)) {
      message.error('请先保存在编辑的属性');
      return;
    }

    if (!newData.ssDetailDTOList) newData.ssDetailDTOList = [];
    newData.ssDetailDTOList.push({
      index: (_.get(data, 'ssDetailDTOList', []) || []).length + 888888,
      key: (_.get(data, 'ssDetailDTOList', []) || []).length + 888888,
      status: 0,
      attributes: '',
      delFlag: 0,
      editable: true,
      isNew: true,
      isAdd: true,
      created_by: 1,
      updatedBy: 1,
    });
    this.setState({ data: newData });
    onChange(newData);
  };

  remove = async key => {
    const { data } = this.state;
    const { onChange, dispatch } = this.props;
    const newData = _.cloneDeep(data);
    const curr = !_.isEmpty(newData.ssDetailDTOList.filter(ele => ele.id > 0 && ele.id === key))
      ? newData.ssDetailDTOList.filter(ele => ele.id > 0 && ele.id === key)[0]
      : {};

    if (!_.isEmpty(curr)) {
      const res = await dispatch({
        type: 'spec/checkSpu',
        payload: {
          jointId: newData.specId,
          subJointId: newData.id,
          type: 1,
        },
      });
      if (res.data && !res.data.status) {
        this.download(newData.specId, newData.id, '删除');
      } else {
        newData.ssDetailDTOList.filter(ele => ele.id === key)[0].delFlag = 1;
      }
    } else {
      newData.ssDetailDTOList = newData.ssDetailDTOList.filter(item => item.index !== key);
    }
    this.setState({ data: newData });
    onChange(newData);
  };

  /** 属性列表 实时编辑功能方法end */

  changeAndSave = async (e, name) => {
    const { data } = this.state;
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    const newData = _.cloneDeep(data);
    if (name === 'status') {
      if (e.target && e.target.value === 1 && newData.id > 0) {
        const res = await dispatch({
          type: 'spec/checkSpu',
          payload: {
            jointId: newData.specId,
            subJointId: newData.id,
            type: 1,
          },
        });
        if (res.data && !res.data.status) {
          this.download(newData.specId, newData.id, '禁用');
          setFieldsValue({ status: 0 });
          return false;
        }
      }
    }

    if (e.target) {
      newData[name] = e.target.value;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
    return null;
  };

  download = (id, subId, opstr) => {
    const { dispatch } = this.props;
    Modal.confirm({
      icon: <Icon type="close-circle" style={{ color: '#F5222D' }} />,
      title: '警告',
      content: '该规格已关联多个SPU请在无关联的前提下进行' + opstr + '操作。',
      okText: '下载关联SPU列表',
      cancelText: '知道了',
      onOk: async () => {
        await dispatch({
          type: 'spec/downloadSpu',
          payload: {
            jointId: id,
            type: 1,
            subJointId: subId,
          },
        });
      },
    });
  };

  // 单个字段编辑功能
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);
    if (target) {
      // if (fieldName === 'attributes' && newData.ssDetailDTOList.some(ele => ele.attributes === e.target.value)) {
      //   message.error('属性名称重复。');
      //   return;
      // }

      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.attributes) {
        message.error('请填写属性名称。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      index,
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
    const columns = [
      {
        title: '序号',
        dataIndex: 'idx',
        width: '20%',
      },
      {
        title: '属性',
        dataIndex: 'attributes',
        key: 'attributes',
        width: '50%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'attributes', record.id || record.index)}
                onKeyPress={e => this.handleKeyPress(e, record.id || record.index)}
                placeholder="属性名称（必填）"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.id || record.index)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id || record.index)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.id || record.index)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.id || record.index)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <Popconfirm title="确认要禁用吗？" onConfirm={e => this.toggleEnable(e, record.id || record.index)}>
                <a>{record.status === 0 ? '禁用' : '启用'}</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={e => this.toggleEditable(e, record.id || record.index)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id || record.index)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              {record.delFlag === 1 && <a style={{ color: 'red' }}>已删除</a>}
            </span>
          );
        },
      },
    ];
    const { loading, data } = this.state;
    const list = (_.get(data, 'ssDetailDTOList', []) || []).map((ele, i) => ({
      idx: i + 1,
      key: i + 1,
      ...ele,
    }));
    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>标准{index + 1}</div>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="标准名称（中文）">
              {getFieldDecorator('chineseName', {
                initialValue: data.chineseName || '',
                validateTrigger: 'onBlur',
                rules: [{ required: true, message: '中文名不能为空' }],
              })(<Input placeholder="中文规格名称（必填）" onChange={e => this.changeAndSave(e, 'chineseName')} />)}
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="标准名称（英文）">
              {getFieldDecorator('englishName', {
                initialValue: data.englishName || '',
                validateTrigger: 'onBlur',
                rules: [{ required: true, message: '英文名不能为空' }],
              })(<Input placeholder="中文规格名称（必填）" onChange={e => this.changeAndSave(e, 'englishName')} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="是否启用">
              {getFieldDecorator('status', {
                initialValue: data.status || 0,
              })(
                <Radio.Group onChange={e => this.changeAndSave(e, 'status')}>
                  <Radio value={0}>启用</Radio>
                  <Radio value={1}>禁用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>标准属性</div>
        <Table
          loading={loading}
          columns={columns}
          rowKey={(item, i) => item.id || i}
          dataSource={list}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : styles.bgWhite)}
        />
        <Button style={{ width: '100%', marginTop: 16, marginBottom: 8, color: '#3B99FD' }} type="dashed" onClick={this.newMember} icon="plus">
          新增属性
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
