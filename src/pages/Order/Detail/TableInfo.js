import React, { PureComponent } from 'react';
import {Table} from 'antd'
import TabHeader from './TabHeader'
import styles from './TableInfo.less'

class TableInfo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render(){
    const {source, orderDetailData, columns} = this.props

    let title = ''
    let text = ''
    let k = 'key'
    let data = []
    let price = 0
    switch (source) {
      case 'sku' :
        title = '成交SKU信息'
        text = '成交SKU合计金额：'
        k = 'proId'
        data = orderDetailData.goods
        price = orderDetailData.skuAmount
      break;
      case 'preferential' :
        title = '商品优惠扣减'
        text = ''
        // 优惠扣减合计金额：
        k = 'proId'
        data = []
        price = ''
      break;
      case 'freight' :
        title = '运费信息'
        text = '运费成交价格：'
        k = 'shippingTemplateId'
        data = [
          {
            postage: orderDetailData.postage,
            shippingTemplateId: orderDetailData.shippingTemplateId,
            postagePreferential: [
              {
                type: '活动',
                id: 123,
                price: 12
              },
              {
                type: '优惠',
                id: 1234,
                price: 132
              }
            ]
          }
        ]
        price = orderDetailData.postage
      break;
      case 'pay' :
        title = '订单全额支付明细'
        text = '支付合计总金额：'
        k = 'thirdOrderNo'
        data = orderDetailData.payment
        price = orderDetailData.actuallyPaid
      break;
      case 'action' :
        title = '操作记录'
        text = ''
        k = 'reason'
        data = orderDetailData.logs
        price = 0
      break;
      default :
        title = ''
    }
    return(
      <div className={styles["tableInfo-box"]}>
        <TabHeader title={title} />
        <div className={styles.content}>
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            rowKey={k}
          />
          {/* { */}
          {/* source === 'pay' ? */}
          {/* <div> */}
          {/* <p className={styles.line}>钱包支付总金额：349.00元</p> */}
          {/* <p className={styles.line}>第三方支付总金额：349.00元</p> */}
          {/* </div> */}
          {/* : null */}
          {/* } */}
          {
            text ? <div className={styles.total}>{text}<span>{price}</span>元</div> : null
          }
        </div>
      </div>
    )
  }
}

export default TableInfo
