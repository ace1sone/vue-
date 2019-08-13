import React, { Fragment } from 'react';
import { Table, Input, Col, Row, Form } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';

import styles from './specform.less';

@Form.create()
class TableDetail extends React.Component {
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
        dataIndex: 'index',
        width: '20%',
      },
      {
        title: '属性',
        dataIndex: 'attributes',
        key: 'attributes',
        width: '50%',
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} placeholder="属性名称（必填）" />;
          }
          return text;
        },
      },
    ];
    const { loading, data } = this.state;
    const list = (_.get(data, 'ssDetailDTOList', []) || []).map((ele, i) => ({
      index: i + 1,
      key: ele.specStandardDetailNo,
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
              })(<Input placeholder="中文规格名称（必填）" className={styles.nobordInput} />)}
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="标准名称（英文）">
              {getFieldDecorator('englishName', {
                initialValue: data.englishName || '',
              })(<Input placeholder="中文规格名称（必填）" className={styles.nobordInput} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="是否启用">
              {getFieldDecorator('status', {
                initialValue: data.status === 0 ? '启用' : '禁用',
              })(<Input readOnly placeholder="状态" className={styles.nobordInput} />)}
            </Form.Item>
          </Col>
        </Row>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold' }}>标准属性</div>
        <Table
          loading={loading}
          columns={columns}
          rowKey={item => item.index}
          dataSource={list}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : styles.bgWhite)}
        />
      </Fragment>
    );
  }
}

export default TableDetail;
