import React, { PureComponent } from 'react';
import styles from './TextInfo.less'
import TabHeader from './TabHeader'
import cn from 'classnames'

class OrderInfo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render(){
    const {data, source} = this.props
    let title = ''
    switch (source) {
      case 'order' :
        title = "订单信息"
        break;
      case 'received' :
        title = "买家收货信息"
      break;
      default :
        title = '订单信息'
    }
    return(
      <div className={styles["orderInfo-box"]}>
        <TabHeader title={title} />
        <div className={styles.content}>
          {
            data.map(item => (
              <div className={cn(styles.item, item.maxWidth ? styles["item-100"] : null)} key={item.key}>
                <div className={styles.left}>{item.key}</div>{item.value}
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default OrderInfo
