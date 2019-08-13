import React, { PureComponent } from 'react';
import { Input, Select, Button, DatePicker } from 'antd'
import styles from './OrderFilter.less'
import cn from 'classnames'

const { Option } = Select;
const { RangePicker } = DatePicker

class OrderFilter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      order: '',
      buyer: '',
      type: '订单类型',
      status: '订单状态',
      time: []
    }

    this.statusList = [
      {
        name: '全部订单',
        key: 0
      },
      {
        name: '待付款',
        key: 1
      },
      {
        name: '待发货',
        key: 3
      },
      {
        name: '待收货',
        key: 4
      },
      {
        name: '交易完成',
        key: 7
      },
      {
        name: '已取消',
        key: 5
      },
      {
        name: '已关闭',
        key: 6
      }
    ]
    this.typeList = [
      {
        name: '常规订单',
        key: 1
      },
      {
        name: '预售订单',
        key: 2
      },
      {
        name: '预定订单',
        key: 3
      }
    ]
  }

  orderText = e => {
    const {getFilterParam} = this.props
    getFilterParam(e.target.value, 'order')
    this.setState({order: e.target.value})
  }

  buyerId = e => {
    const {getFilterParam} = this.props
    getFilterParam(e.target.value, 'buyer')
    this.setState({buyer: e.target.value})
  }

  orderType = value => {
    const {getFilterParam} = this.props
    getFilterParam(value, 'type')
    this.setState({type: value})
  }

  time = (date, dateString) => {
    const {getFilterParam} = this.props
    getFilterParam(dateString, 'time')
    this.setState({time: date})
  }

  paramStatus = value => {
    const {getFilterParam} = this.props
    getFilterParam(value, 'status')
    this.setState({status: value})
  }

  clear = () => {
    const {clearParam} = this.props
    this.setState({
      order: '',
      buyer: '',
      type: '订单类型',
      status: '订单状态',
      time: []
    })
    clearParam()
  }

  render(){
    const {statusList, typeList} = this
    const {orderState, search} = this.props
    const {order, buyer, type, status, time} = this.state
    return(
      <div className={styles["orderFilter-box"]}>
        <div>
          <Input style={{width: 240}} value={order} onChange={this.orderText} className={cn(styles["margin-24"], styles["mt-12"])} placeholder="请输入订单号" />
          <Input style={{width: 168}} value={buyer} onChange={this.buyerId} className={cn(styles["margin-24"], styles["mt-12"])} placeholder="请输入买家ID" />
          <Select
            placeholder="订单类型"
            style={{width: 144}}
            className={cn(styles["margin-24"], styles["mt-12"])}
            onChange={this.orderType}
            value={type}
          >
            {
              typeList.map(item => (
                <Option key={item.key} value={item.key}>{item.name}</Option>
              ))
            }
          </Select>
          <RangePicker
            style={{width: 360}}
            onChange={this.time}
            className={styles["mt-12"]}
            placeholder={['开始时间', '结束时间']}
            value={time}
          />
        </div>
        <div style={{marginTop: 24}}>
          {
            orderState === 'allOrder' ?
              <Select
                className={styles["margin-24"]}
                placeholder="订单状态"
                style={{width: 144}}
                onChange={this.paramStatus}
                value={status}
              >
                {
                  statusList.map(item => (
                    <Option key={item.key} value={item.key}>{item.name}</Option>
                  ))
                }
              </Select> :
              null
          }
          <Button type="primary" style={{width: 72}} className={styles["margin-24"]} onClick={search}>搜索</Button>
          <Button style={{width: 72}} className={styles["margin-24"]} onClick={this.clear}>清空</Button>
          <Button type="primary" style={{width: 96, float: 'right'}}>导出Excel</Button>
        </div>
      </div>
    )
  }
}

export default OrderFilter
