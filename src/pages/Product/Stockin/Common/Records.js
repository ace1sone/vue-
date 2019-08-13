import React, { Fragment } from 'react';
import { Table } from 'antd';
import moment from 'moment';

export const mapDataToCols = (data = []) =>
  data.map(item => ({
    key: item.id,
    operation: item.operation,
    createBy: item.createdName,
    createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm'),
  }));

class Records extends React.Component {

  static defaultProps = {
    dataSource: []
  }

  state = {
    loading: false
  };


  render() {

    const columns = [
      {
        title: '操作人',
        dataIndex: 'createBy',
        width: '20%',
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '60%',
      }, {
        title: '操作时间',
        dataIndex: 'createdAt',
        width: '20%',
      }
    ];
    const { loading } = this.state;
    const { dataSource } = this.props;
    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          rowKey={(item, i) => item.id || i}
          dataSource={mapDataToCols(dataSource)}
          pagination={false}
        />
      </Fragment>
    );
  }
}

export default Records;

