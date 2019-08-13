import React, { Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Col, Row, Form, Radio } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import shortid from 'shortid';
import DescConfirm from './DescConfirm';

import styles from './Desc.less';

@Form.create()
class TableForm extends React.Component {
  cacheOriginData = {};

  state = {
    data: { descSubsetDetailDTOList: [] },
    loading: false,
    value: { descSubsetDetailDTOList: [] },
  };

  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        data: props.value,
        value: props.value,
      };

      this.storeData = props.value;
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
    return (_.get(newData, 'descSubsetDetailDTOList', null) || _.get(data, 'descSubsetDetailDTOList', [])).filter(
      item => (item.id || item.key) === key
    )[0];
  }

  toggleEditable = async (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        if (target.id) {
          const result = await this.checkSpu();
          if (!result) return;
        }

        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  // continue if true
  checkSpu = async () => {
    const { dispatch } = this.props;
    const { data } = this.state;

    if (!data) {
      return true;
    }

    const { id = null, descId = null } = data;
    if (!id || !descId) {
      return true;
    }

    const res = await dispatch({
      type: 'desc/checkDesc',
      payload: {
        jointId: descId,
        subJointId: id,
        type: 2,
      },
    });

    if (res.header.code !== 2000) {
      return false;
    }

    if (res.data.status) return true;

    const result = await DescConfirm.show({ body: '该描述子集已关联N个SPU请在无关联的前提下进行操作' });
    if (result === 2) {
      return true;
    }
    if (result === 0) {
      this.downloadSpec(id);
    }

    return false;
  };

  toggleEnable = async (e, key) => {
    e.preventDefault();
    const { onChange } = this.props;
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);

    if (target) {
      if (target.status === 0) {
        if (target.id) {
          const result = await this.checkSpu();
          if (!result) return;
        }
        target.status = 1;
      } else {
        target.status = 0;
      }
      this.setState({ data: newData });
      onChange(newData);
    }
  };

  toggleSubDescEnable = async e => {
    const { data } = this.state;
    if (data.id && data.status === 1) {
      const result = await this.checkSpu();
      if (!result) return;
    }
    this.changeAndSave(e, 'status');
  };

  newMember = () => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);

    if ((newData.descSubsetDetailDTOList || []).some(ele => ele.editable)) {
      message.error('请先保存在编辑的属性');
      return;
    }

    if (!newData.descSubsetDetailDTOList) {
      newData.descSubsetDetailDTOList = [];
    }

    newData.descSubsetDetailDTOList.push({
      key: shortid.generate(),
      status: 0,
      attributes: '',
      delFlag: 0,
      editable: true,
      isNew: true,
    });
    this.setState({ data: newData });
  };

  async remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = _.cloneDeep(data);

    const index = newData.descSubsetDetailDTOList.findIndex(ele => ele.id === key || ele.key === key);
    if (index === -1) return;
    const target = newData.descSubsetDetailDTOList[index];
    if (target.id) {
      const result = await this.checkSpu();
      if (!result) return;
      target.delFlag = 1;
    } else {
      newData.descSubsetDetailDTOList = newData.descSubsetDetailDTOList.filter((k, i) => i !== index);
    }

    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  /** 属性列表 实时编辑功能方法end */

  // 单个字段编辑功能
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);
    if (target) {
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

      if (target.attributes) {
        const arr = _.get(this.state, 'data.descSubsetDetailDTOList');
        const result = arr.some((__, index, oldArr) => oldArr.some((_item, i) => _item.attributes === __.attributes && index !== i));
        if (result) {
          message.error('不能有相同的属性名称');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }
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

  changeAndSave(e, name) {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (e.target) {
      newData[name] = e.target.value;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
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
      hideRequiredMark: true,
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: '20%',
      },
      {
        title: '属性',
        dataIndex: 'attributes',
        width: '50%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'attributes', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="属性名称（必填）"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <Popconfirm title={record.status === 0 ? '确认要禁用吗？' : '确认要启用吗？'} onConfirm={e => this.toggleEnable(e, record.key)}>
                <a className={record.status === 0 ? styles.buttonDanger : styles.buttonNormal}>{record.status === 0 ? '禁用' : '启用'}</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
              {record.delFlag === 1 ? (
                <span>
                  <Divider type="vertical" />
                  <a className={styles.buttonDanger}>已删除</a>
                </span>
              ) : null}
            </span>
          );
        },
      },
    ];
    const { loading, data } = this.state;
    const list = (_.get(data, 'descSubsetDetailDTOList') || []).map((ele, i) => ({
      index: i + 1,
      key: ele.id || ele.key,
      ...ele,
    }));

    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>子集{index + 1}</div>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="描述子集名称">
              {getFieldDecorator('name', {
                initialValue: data.name || '',
                rules: [{ required: true, message: '中文名不能为空' }],
              })(<Input placeholder="描述子集名称（必填）" onChange={e => this.changeAndSave(e, 'name')} />)}
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="是否启用">
              {getFieldDecorator('status', {
                initialValue: data.status || 0,
              })(
                <Radio.Group onChange={e => this.toggleSubDescEnable(e)}>
                  <Radio value={0}>启用</Radio>
                  <Radio value={1}>禁用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            padding: '5px 0',
            fontSize: 16,
            fontWeight: 'bold',
            paddingBottom: 24,
            marginTop: -24,
          }}
        >
          描述子集属性
        </div>
        <Table
          loading={loading}
          columns={columns}
          rowKey={item => item.index}
          dataSource={list}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : styles.bgWhite)}
        />
        <Button style={{ width: '100%', marginTop: 24, color: '#3B99FD' }} type="dashed" onClick={this.newMember} icon="plus">
          新增属性
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
