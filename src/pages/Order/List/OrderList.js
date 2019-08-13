import React, { PureComponent } from 'react';
import { Table } from 'antd';
import router from 'umi/router';
import classNames from 'classnames'
import styles from './OrderList.less'
import {getStatusText, getTypeText, reverseTypeText} from '../Text'
import { getImgSrc } from '@/utils/utils'

class OrderList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }

    this.getTotal = arr => {
      let num = 0

      for (let i = 0; i < arr.length; i++) {
        num = arr[i].num + num
      }

      return num
    }

    this.columns = []
  }

  componentWillMount() {
    this.renderTable()
  }

  renderTable = () => {
    const {orderState, showAlert} = this.props
    const tableList = [
      {
        title: '商品',
        width: 456,
        key: 'goods',
        render: item => (
          <div>
            <div className={
              classNames(
                styles.line,
                orderState === 'afterSale' || orderState === 'close' || orderState === 'cancel' ?
                  styles["line-cancel"] :
                orderState === 'allOrder' ?
                  item.status === 5 || item.status === 6 || item.reverseStatus === 1 ?
                    styles["line-cancel"]
                  : null : null
              )
            }
            >
              <span>订单号：{item.orderNo}</span>
              <span>创建时间：{item.createdAt}</span>
              <span>订单类型：{getTypeText(item.type)}</span>
            </div>
            {
              item.goods.map(items => (
                <div key={items.proId} className={styles.goods}>
                  <img src={getImgSrc(items.pic)} alt={items.name} />
                  <div>{items.name}</div>
                </div>
              ))
            }
          </div>
        ),
      },
      {
        title: '单价',
        width: 96,
        key: 'unitPrice',
        render: data => (
          <div>
            {
              data.goods.map(datas => (
                <div className={styles["unit-price"]} key={datas.proId}>
                  ¥{datas.unitPrice}
                </div>
              ))
            }
          </div>
        )
      },
      {
        title: '数量',
        width: 96,
        key: 'num',
        render: data => (
          <div>
            {
              this.getTotal(data.goods)
            }
          </div>
        )
      },
      {
        title: '订单状态',
        key: 'status',
        width: 120,
        render: item => (
          <span>
            {getStatusText(item.status)}
          </span>
        ),
      },
      {
        title: '订单金额',
        width: 120,
        key: 'totalAmount',
        render: item => (
          <span>
            ¥{item.totalAmount}
          </span>
        ),
      },
      {
        title: '买家ID',
        width: 88,
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '操作',
        width: 104,
        key: 'action',
        align: 'center',
        render: item => (
          <span>
            <div>
              <a onClick={() => {router.push(`/order/b2cOrder/${orderState}/detail/${item.orderNo}`)}}>详情</a>
            </div>
            {
              orderState === 'pendingPay' ?
                <div>
                  <a onClick={() => {showAlert(item.orderNo, 'cancel', item.status)}}>取消订单</a>
                </div> :
                null
            }
            {
              orderState === 'pendingSend' || orderState === 'pendingReceived' || orderState === 'done' ?
                <div>
                  {
                    item.canReverse ?
                      <a onClick={() => {showAlert(item.orderNo, 'apply', item.status)}}>申请售后</a> :
                      <a className={styles.reverse}>申请售后</a>
                  }
                </div> :
                null
            }
            {
              orderState === 'afterSale' ?
                <div>
                  {
                    item.reverseStatus === 1 ?
                      <a onClick={() => {showAlert(item.orderNo, 'complete', item.status)}}>完成售后</a> :
                      <a className={styles.reverse}>完成售后</a>
                  }
                </div> :
                null
            }
          </span>
          ),
      },
    ]
    const after = [
      {
        title: '售后方式',
        width: 120,
        key: 'afterSaleWay',
        render: item => (
          <span>
            {reverseTypeText(item.reverseType)}
          </span>
        )
      },
      {
        title: '售后申请人',
        width: 120,
        key: 'reverseApplicant',
        dataIndex: 'reverseApplicant'
      },
      {
        title: '售后完成人',
        width: 120,
        key: 'reverseCompletion',
        dataIndex: 'reverseCompletion'
      }
    ]
    if (orderState === 'afterSale' || orderState === 'close') {
      tableList.splice(6, 0, ...after)
    }

    this.columns = tableList
  }

  render(){
    const {data, pageParams, tableLoad} = this.props

    return(
      <div className={styles["orderList-box"]}>
        <Table
          columns={this.columns}
          dataSource={data}
          rowClassName={styles.trPosition}
          rowKey="orderNo"
          pagination={pageParams}
          loading={tableLoad}
        />
      </div>
    )
  }
}

export default OrderList
