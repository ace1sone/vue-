import React, { Fragment } from 'react';
import { Table, InputNumber, Form } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import styles from './Form.less';

@Form.create()
class InvTableForm extends React.Component {
  cacheOriginData = {};

  state = {
    data: {},
    loading: false,
    value: {},
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

  changeAndSave = async (e, name) => {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (e.target) {
      newData[name] = e.target.value;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  };

  // 单个字段编辑功能
  handleFieldChange(v, fieldName) {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v || v === 0) {
      const target = Math.floor(v);
      newData[fieldName] = target;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const skuColumns = items => {
      const list = items.map(ele => ({ title: ele.basisName, dataIndex: ele.basisName }));
      // console.log(items, list);
      return [
        {
          title: 'SKU ID',
          dataIndex: 'id',
          width: '20%',
        },
        ...list,
        {
          title: '销售价（元）',
          dataIndex: 'sellingPrice',
          width: '20%',
          render: text => {
            // return getFieldDecorator('sellingPrice', {
            //   initialValue: text || {},
            //   validateTrigger: 'onBlur',
            //   rules: [{ required: true, message: '价格不能为空' }],
            // })(
              // console.log(text)
            return (
              <InputNumber
                min={0}
                max={1000000}
                value={text}
                onChange={e => this.handleFieldChange(e, 'sellingPrice')}
                placeholder="销售价"
                style={{ width: 250 }}
                type="number"
              />
            );
            // );
          },
        },
      ];
    };
    const columns = [
      {
        title: 'SKU总数',
        dataIndex: 'skuSum',
        width: '14%',
      },
      {
        title: '库存总数',
        dataIndex: 'skuInventorySum',
        width: '14%',
      },
      {
        title: '库存冻结数',
        dataIndex: 'skuFreezeNumber',
        width: '14%',
      },
      {
        title: '可用库存数',
        dataIndex: 'skuStockNumber',
        width: '14%',
      },
      {
        title: '上架总数',
        dataIndex: 'skuShelvesSum',
        width: '14%',
      },
      {
        title: '上架冻结数',
        dataIndex: 'skuFreezingNumber',
        width: '14%',
      },
      {
        title: '上架可售数',
        dataIndex: 'skuAvailableNumber',
        width: '16%',
      },
    ];
    const { loading, data } = this.state;

    data.basisList.forEach(ele => {
      data[ele.basisName] = ele.basisValue;
    });

    // if (_.get(data, ['inventory'])) {
    //   data.inventory.sellingPrice = _.get(data, ['sellingPrice']);
    // }

    return (
      <Fragment>
        <Table
          columns={skuColumns(data.basisList || [])}
          rowKey={(item, i) => item.spuId || i}
          dataSource={[data]}
          pagination={false}
          defaultExpandAllRows
          className={styles.TableRowHack}
          expandedRowRender={() =>
            data.inventory && (
              <Table loading={loading} columns={columns} rowKey={(item, i) => item.id || i} dataSource={[data.inventory]} pagination={false} />
            )
          }
        />
        {/* {data.inventory && (
          <Table loading={loading} columns={columns} rowKey={(item, i) => item.id || i} dataSource={[data.inventory]} pagination={false} />
        )} */}
      </Fragment>
    );
  }
}

export default InvTableForm;
