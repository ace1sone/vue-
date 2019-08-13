import React from 'react';
import { Modal, Table } from 'antd';
import { get } from 'lodash';
import styles from './WaybillDetail.less';

const longTextStyle = {
  wordWrap: 'break-word',
  wordBreak: 'break-all',
};

export default class RepeatModal extends React.PureComponent {
  render() {
    const { data, visible, current, handleOk, handleCancel } = this.props;
    const obj = {};
    data.concat(current).map(v => {
      const key = v.expressNumber;
      if (obj[key]) {
        obj[key].push(v);
      } else {
        obj[key] = [v];
      }
    });
    const formatRepeatList = Object.entries(obj).map(([k, v]) => {
      return {
        key: k,
        expressNumber: k,
        orderCode: v,
        info: v,
        spu: v,
        consignee: v,
        orderAddress: v,
        shippingStatusName: v,
        shippingTime: v,
      };
    });

    const columns = [
      {
        title: '快递单号',
        key: 'expressNumber',
        dataIndex: 'expressNumber',
        align: 'center',
        render: text => {
          return <div style={longTextStyle}>{text}</div>;
        },
      },
      {
        title: '订单号',
        key: 'orderCode',
        dataIndex: 'orderCode',
        render: text => {
          return (
            <div className={styles.itemContainer} style={longTextStyle}>
              {text.map(v => (
                <div key={`${v.code} ${Math.random()}`} className={styles.item}>
                  {v.orderCode}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        title: '商品信息',
        key: 'info',
        dataIndex: 'info',
        render: text => {
          return (
            <div className={styles.itemContainer}>
              {text.map(v => (
                <div key={`${v.code} ${Math.random()}`} className={styles.item}>
                  <img src={get(v, ['orderDetail', '0', 'pic'])} alt="" />
                  <span>{get(v, ['orderDetail', '0', 'name'])}</span>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        title: '规格',
        key: 'spu',
        dataIndex: 'spu',
        render: text => {
          return (
            <div className={styles.itemContainer}>
              {text.map(v => {
                const source = get(v, ['orderDetail', '0', 'spec']);
                const spec = source ? (source instanceof Array ? source : JSON.parse(source)) : false;
                return (
                  <div key={`${v.code} ${Math.random()}`} className={styles.item}>
                    <span>{spec ? `${get(spec, ['0', 'basisName'])}: ` : ':'}</span>
                    <span>{`${spec ? get(spec, ['0', 'basisValue']) : ''}`}</span>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '收货人',
        key: 'consignee',
        dataIndex: 'consignee',
        render: text => {
          return (
            <div className={styles.itemContainer}>
              {text.map(v => {
                return (
                  <div className={styles.item} key={v.code}>
                    {get(v, 'consignee')}
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '收货地址',
        key: 'orderAddress',
        dataIndex: 'orderAddress',
        render: text => {
          return (
            <div className={styles.itemContainer}>
              {text.map(v => {
                const address = v.orderAddress;
                return (
                  <div className={styles.item} key={`${v.code} ${Math.random()}`}>
                    {`${get(address, 'province', '  ')}/${get(address, 'city', '  ')}/${get(address, 'county', '  ')}/${get(
                      address,
                      'address',
                      '  '
                    )}`}
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '发货状态',
        key: 'shippingStatusName',
        dataIndex: 'shippingStatusName',
        render: text => {
          return (
            <div className={styles.itemContainer}>
              {text.map(v => {
                return (
                  <div key={`${v.code} ${Math.random()}`} className={styles.item}>
                    {v.shippingStatusName}
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '发货时间',
        key: 'shippingTime',
        dataIndex: 'shippingTime',
        render: text => {
          return (
            <div className={styles.itemContainer}>
              {text.map(v => {
                return (
                  <div key={`${v.code} ${Math.random()}`} className={styles.item}>
                    {v.shippingTime}
                  </div>
                );
              })}
            </div>
          );
        },
      },
    ];
    return (
      <Modal
        title="快递单号重复"
        width={1128}
        height={560}
        bodyStyle={{ overflowY: 'scroll', height: 448 }}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="继续发货"
        cancelText="取消"
      >
        <Table rowClassName={styles.repeatTableRow} columns={columns} dataSource={formatRepeatList} pagination={false} />
      </Modal>
    );
  }
}
