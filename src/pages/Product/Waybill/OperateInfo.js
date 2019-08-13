import React from 'react';
import { Table } from 'antd';
import { get } from 'lodash';

const columns = [
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '发货状态',
    dataIndex: 'shippingStatusName',
    key: 'shippingStatusName',
  },
  {
    title: '操作备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 504,
  },
  {
    title: '操作时间',
    key: 'operatingTime',
    dataIndex: 'operatingTime',
  },
];

function mapDataToCols(data) {
  return data.map(v => ({
    operator: get(v, ['operator']),
    shippingStatusName: get(v, ['shippingStatusName']),
    remark: get(v, ['remark']),
    operatingTime: get(v, ['operatingTime']),
    key: get(v, ['id']),
  }));
}
class OperatetInfo extends React.Component {
  onPageChange = (dispatch, waybillId) => (current, size) =>
    dispatch({
      type: 'waybill/getWaybillLogs',
      payload: {
        page: current,
        size,
        waybillId,
      },
    });

  render() {
    const log = get(this.props, ['waybill', 'log']);
    const data = get(log, ['records']);
    const pagination = {
      current: get(log, ['current'], 1),
      total: get(log, ['total'], 0),
      onChange: this.onPageChange(get(this.props, ['dispatch']), get(this.props, ['waybill', 'waybillDetail', 'id'])),
    };
    return <React.Fragment>{data && <Table columns={columns} dataSource={mapDataToCols(data)} pagination={pagination} />}</React.Fragment>;
  }
}

export default OperatetInfo;
