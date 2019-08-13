import React, { Fragment } from 'react';
import { Table, message, Popconfirm, Form, Modal } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import SkuTableForm from '@/common/SkuTableForm';

import styles from './OrderForm.less';

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

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  remove = async record => {
    const { onDelete } = this.props;
    onDelete(record.spuId);
  };

  /** 属性列表 实时编辑功能方法end */
  /* eslint-disable */
  changeAndSave = async (e, name) => {
    const { data } = this.state;
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    const newData = _.cloneDeep(data);
    if (name === 'status') {
      if (e.target && e.target.value === 1) {
        const res = await dispatch({
          type: 'spec/checkSpu',
          payload: {
            jointId: newData.specId,
            subJointId: newData.id,
            type: 1,
          },
        });
        if (res.data && !res.data.status) {
          Modal.confirm({
            title: '警告',
            content: '该规格已关联多个SPU请在无关联的前提下进行删除操作。',
            okText: '下载关联SPU列表',
            cancelText: '知道了',
            onOk: async () => {
              await dispatch({
                type: 'spec/downloadSpu',
                payload: {
                  jointId: newData.specId,
                  type: 1,
                  subJointId: newData.id,
                },
              });
            },
          });
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
  };
  /* eslint-enable */

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
    const columns = [
      {
        title: 'SPU图片',
        dataIndex: 'blackUrl',
        width: '15%',
        render(blackUrl) {
          return <img src={blackUrl} alt="SPU图片" style={{ width: 40 }} />;
        },
      },
      {
        title: 'SPU名称',
        dataIndex: 'englishName',
        width: '15%',
      },
      {
        title: 'SPU ID',
        dataIndex: 'spuId',
        width: '15%',
      },
      {
        title: '品牌名称（英文）',
        dataIndex: '4',
        width: '15%',
      },
      {
        title: '系列名称（英文）',
        dataIndex: 'seriesName',
        width: '15%',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record)}>
              <a style={{ color: '#F5222D' }}>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const { loading, data } = this.state;
    const list = [data].map((ele, i) => ({
      idx: i + 1,
      key: i + 1,
      ...ele,
    }));

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          rowKey={(item, i) => item.id || i}
          dataSource={list}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : styles.bgWhite)}
          expandedRowRender={record => <SkuTableForm specStandardList={record.specStandardDTOList} />}
          defaultExpandAllRows
        />
      </Fragment>
    );
  }
}

export default TableForm;
