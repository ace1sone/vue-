import React, { Fragment } from 'react';
import { Table, InputNumber, Form, Switch } from 'antd';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';

@Form.create()
class PrdTableForm extends React.Component {
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

  // 单个字段编辑功能
  handleFieldChange(v, fieldName) {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v || v === 0) {
      newData[fieldName] = Math.floor(v);
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData);
    }
  }

  handleSwitchChange(v, fieldName) {
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    newData[fieldName] = v ? 1 : 2;
    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData);
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const skuColumns = items => {
      const list = items.map(ele => ({ title: ele.basisName, dataIndex: ele.basisName }));
      return [
        {
          title: 'SKU ID',
          dataIndex: 'id',
          width: '20%',
        },
        ...list,
        {
          title: '售卖状态',
          dataIndex: 'sellingStatus',
          width: '15%',
          render: (val, record) => {
            return (
              <Switch
                checkedChildren="上架"
                unCheckedChildren="下架"
                checked={val === 1}
                disabled={_.get(record, 'sellingPrice') === 0}
                onChange={v => this.handleSwitchChange(v, 'sellingStatus')}
              />
            );
          },
        },
        {
          title: '上架可售数',
          dataIndex: 'actions',
          width: '25%',
          render: item => {
            // return getFieldDecorator('skuAvailableNumber', {
            //   initialValue: item.skuAvailableNumber || 0,
            //   validateTrigger: 'onBlur',
            //   rules: [{ required: true, message: '价格不能为空' }],
            // })(
              return <InputNumber
                min={0}
                value={item.skuAvailableNumber}
                onChange={e => this.handleFieldChange(e, 'skuAvailableNumber')}
                placeholder="上架可售数"
                style={{ width: 250 }}
                type="number"
                disabled={item.sellingStatus !== 1}
              />
            // );
          },
        },
      ];
    };
    const columns = [
      // {
      //   title: 'SKU总数',
      //   dataIndex: 'skuSum',
      //   width: '14%',
      // },
      // {
      //   title: '库存总数',
      //   dataIndex: 'skuInventorySum',
      //   width: '14%',
      // },
      // {
      //   title: '库存冻结数',
      //   dataIndex: 'skuFreezeNumber',
      //   width: '14%',
      // },
      // {
      //   title: '最大上架可售数',
      //   dataIndex: 'availableStockNum',
      //   width: '14%',
      // },
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
        title: '最大上架可售数',
        dataIndex: 'availableStockNum',
        width: '14%',
      },
      {
        title: '售价',
        dataIndex: 'sellingPrice',
        width: '14%',
      },
      // {
      //   title: '上架可售数',
      //   dataIndex: 'skuAvailableNumber',
      //   width: '16%',
      // },
    ];

    const mapDataToCols = data =>
      data.map(item => ({
        ...item,
        actions: { sellingStatus: item.sellingStatus, skuAvailableNumber: item.skuAvailableNumber },
      }));

    const { loading, data } = this.state;

    data.basisList.forEach(ele => {
      data[ele.basisName] = ele.basisValue;
    });

    if (_.get(data, ['inventory'])) {
      data.inventory.sellingPrice = _.get(data, ['sellingPrice']);
    }

    return (
      <Fragment>
        <Table
          columns={skuColumns(data.basisList || [])}
          rowKey={(item, i) => item.spuId || i}
          dataSource={mapDataToCols([data])}
          pagination={false}
          defaultExpandAllRows
          expandedRowRender={() =>
            data.inventory && (
              <Table loading={loading} columns={columns} rowKey={(item, i) => item.id || i} dataSource={[data.inventory]} pagination={false} />
            )
          }
        />
      </Fragment>
    );
  }
}

export default PrdTableForm;
