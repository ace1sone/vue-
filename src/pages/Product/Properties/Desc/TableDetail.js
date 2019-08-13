import React, { Fragment } from 'react';
import { Table, Input, Col, Row, Form, Radio } from 'antd';
import _ from 'lodash';

import styles from './Desc.less';

@Form.create()
class TableDetail extends React.Component {
  render() {
    const { data, index } = this.props;

    const descSubsetDetailDTOList = _.get(data, 'descSubsetDetailDTOList') || [];
    const list = descSubsetDetailDTOList.map((item, i) => ({
      index: i + 1,
      attributes: item.attributes,
    }));

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
        key: 'name',
        width: '50%',
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
    ];

    return (
      <Fragment>
        <div style={{ padding: '5px 0', fontSize: 16, fontWeight: 'bold', marginTop: -8 }}>子集{index + 1}</div>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="描述子集名称">
              <Input readOnly className={styles.nobordInput} value={data.name} />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="是否启用">
              <Radio.Group value={data.status} disabled>
                <Radio value={0}>启用</Radio>
                <Radio value={1}>禁用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <div
          style={{
            padding: '5px 0',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 24,
            marginTop: -24,
            position: 'relative',
          }}
        >
          描述子集属性
        </div>
        <Table
          style={{ backgroundColor: 'white' }}
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
