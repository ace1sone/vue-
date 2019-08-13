import React, { PureComponent } from 'react'
import router from 'umi/router'
import { Button } from 'antd'
import styles from './OrderBtn.less'

class OrderBtn extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render(){
    const {orderDetailData, show, locationStatus} = this.props

    let renderBtn = ''
    if (locationStatus === 'pendingPay') {
      renderBtn = <Button className={styles.margin24} onClick={() => show(orderDetailData.orderNo, 'cancel', orderDetailData.status)} type="danger">取消订单</Button>
    } else if (locationStatus === 'pendingSend' || locationStatus === 'pendingReceived' || locationStatus === 'done') {
      renderBtn =
        orderDetailData.canReverse ?
          <Button className={styles.margin24} onClick={() => show(orderDetailData.orderNo, 'apply', orderDetailData.status)} type="danger">申请售后</Button> :
          <Button className={styles.margin24} disabled type="danger">申请售后</Button>
    } else if (locationStatus === 'afterSale') {
      renderBtn =
        orderDetailData.reverseStatus === 1 ?
          <Button className={styles.margin24} onClick={() => show(orderDetailData.orderNo, 'complete', orderDetailData.status)} type="danger">完成售后</Button> :
          <Button className={styles.margin24} disabled type="danger">完成售后</Button>
    }

    return(
      <div className={styles["orderBtn-box"]}>
        <Button className={styles.margin24} onClick={() => router.goBack()}>返回</Button>
        {renderBtn}
      </div>
    )
  }
}

export default OrderBtn
