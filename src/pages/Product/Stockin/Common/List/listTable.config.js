import React from 'react';
import { Badge, Divider } from 'antd';
import Link from 'umi/link';
import moment from 'moment';

export function getColumns({ handleExportExcel = () => {} }, addOrders) {
  return [
    {
      title: '序号',
      dataIndex: 'index',
    },
    {
      title: '入库单号',
      dataIndex: 'id',
    },
    {
      title: '创建人',
      dataIndex: 'createdName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: text => {
        const formatTime = text.split(' ');
        return <div>{formatTime[0]} <br />{formatTime[1]}</div>
      }
    },
    {
      title: '入库单状态',
      dataIndex: 'receiptStatus', // 1：待审批，2：已驳回，3：已入库
      render: receiptStatus => {
        let status = '';
        let text = '';
        if (receiptStatus === 1) {
          text = '待审批';
          status = 'warning';
        }
        if (receiptStatus === 2) {
          text = '已驳回';
          status = 'error';
        }
        if (receiptStatus === 3) {
          text = '已入库';
          status = 'success';
        }
        return <Badge status={status} text={text} />;
      },
    },
    {
      title: '审批时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '审批人',
      dataIndex: 'approverName',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: ({ receiptStatus, id }) => {
        if (!addOrders) {
          if (receiptStatus === 1) {
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockin/waits/detail?id=${id}&receiptStatus=${receiptStatus}&action=1`}>审批</Link>
              </div>
            );
          }
          if (receiptStatus === 2) {
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockin/rejects/detail?id=${id}&receiptStatus=${receiptStatus}&action=2`}>编辑</Link>
              </div>
            );
          }
          if (receiptStatus === 3) {
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockin/completeds/detail?id=${id}&receiptStatus=${receiptStatus}&action=1`}>查看</Link>
              </div>
            );
          }
          if (!receiptStatus) {
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockin/inorders/new?id=${id}&receiptStatus=${receiptStatus}&action=1`}>查看</Link>
              </div>
            );
          }
        } else {
          let address = '';
          switch (receiptStatus) {
            case 1:
              address = 'waits';
              break;
            case 2:
              address = 'rejects';
              break;
            case 3:
              address = 'completeds';
              break;
            case '':
              address = 'inorders';
              break;
            default:
              address = '';
          }

          return (
            <div>
              <a onClick={() => handleExportExcel(id)}>导出</a>
              <Divider type="vertical" />
              <Link to={`/product/stockin/${address}/detail?id=${id}&receiptStatus=${receiptStatus}&action=3`}>查看</Link>
            </div>
          );
        }
        return null;
      },
    },
  ];
}

export const mapDataToCols = (data = []) => baseIndex =>
  data.map((item, i) => ({
    key: item.id,
    index: baseIndex + i + 1,
    id: item.id,
    createdName: item.createdName,
    createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm'),
    receiptStatus: item.receiptStatus,
    updatedAt: moment(item.updatedAt).format('YYYY-MM-DD HH:mm'),
    approverName: item.approverName,
    actions: { receiptStatus: item.receiptStatus, id: item.id },
  }));
