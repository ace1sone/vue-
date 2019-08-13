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
      title: '出库单号',
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
      title: '出库单状态',
      dataIndex: 'outboundStatus', // 1：待审批，2：已驳回，3：已出库
      render: outboundStatus => {
        let status = '';
        let text = '';
        if (outboundStatus === 1) {
          text = '待审批';
          status = 'warning';
        }
        if (outboundStatus === 2) {
          text = '已驳回';
          status = 'error';
        }
        if (outboundStatus === 3) {
          text = '已出库';
          status = 'success';
        }
        if (outboundStatus === 4) {
          text = '已作废';
          status = 'default';
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
      render: ({ outboundStatus, id }) => {
        if (!addOrders) {
          if (outboundStatus === 1) {
            // 待审批
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockout/waits/detail?id=${id}&outboundStatus=${outboundStatus}&action=1`}>审批</Link>
              </div>
            );
          }
          if (outboundStatus === 2) {
            // 已驳回
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockout/rejects/detail?id=${id}&outboundStatus=${outboundStatus}&action=2`}>编辑</Link>
              </div>
            );
          }
          if (outboundStatus === 3) {
            // 已出库
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockout/completeds/detail?id=${id}&outboundStatus=${outboundStatus}&action=1`}>查看</Link>
              </div>
            );
          }
          if (outboundStatus === 4) {
            // 已作废
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockout/invalids/detail?id=${id}&outboundStatus=${outboundStatus}&action=1`}>查看</Link>
              </div>
            );
          }
          if (!outboundStatus) {
            return (
              <div>
                <a onClick={() => handleExportExcel(id)}>导出</a>
                <Divider type="vertical" />
                <Link to={`/product/stockout/outorders/new?id=${id}&outboundStatus=${outboundStatus}&action=1`}>查看</Link>
              </div>
            );
          }
        } else {
          let address = '';
          switch (outboundStatus) {
            case 1:
              address = 'waits';
              break;
            case 2:
              address = 'rejects';
              break;
            case 3:
              address = 'completeds';
              break;
            case 4:
              address = 'invalids';
              break;
            case '':
              address = 'outorders';
              break;
            default:
              address = '';
          }

          return (
            <div>
              <a onClick={() => handleExportExcel(id)}>导出</a>
              <Divider type="vertical" />
              <Link to={`/product/stockout/${address}/detail?id=${id}&outboundStatus=${outboundStatus}&action=3`}>查看</Link>
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
    outboundStatus: item.outboundStatus,
    updatedAt: moment(item.updatedAt).format('YYYY-MM-DD HH:mm'),
    approverName: item.approverName,
    actions: { outboundStatus: item.outboundStatus, id: item.id },
  }));
