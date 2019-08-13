import React, { PureComponent} from 'react'
import PageHeaderWrapper from '@/components/PageHeaderWrapper/index';
import { connect } from 'dva'
import {notification} from 'antd'
import OrderFilter from './OrderFilter'
import OrderList from './OrderList'
import ActionAlery from '../container/ActionAlert'

class Order extends PureComponent {
  constructor() {
    super()
    this.orderState = ''
    this.params = {
      paramStatus: 0,
      orderId: '',
      buyerId: '',
      orderType: 0,
      time: ''
    }
    this.state = {
      orderTitle: '',
      total: 30,
      page: 1,
      pageSize: 10,
      isAlert: false,
      orderId: undefined,
      operatingType: undefined,
      orderStatus: undefined
    }
  }

  componentWillMount() {
    this.getLocationInfo()
    this.getOrderTitle()
    this.getOrderStatus()
  }

  componentDidMount() {
    this.getOrder()
  }

  componentWillReceiveProps(nextProps) {
    const {location} = this.props
    if (location.pathname !== nextProps.location.pathname) {
      this.getLocationInfo(nextProps.location)
      this.getOrderTitle()
      this.getOrderStatus()
      this.getOrder()
    }
  }

  getLocationInfo(l) {
    const {location} = this.props
    const newLocation = l || location
    const locationName = newLocation.pathname.split('/').pop()
    this.orderState = locationName
  }

  getOrderStatus() {
    let status = 0

    switch (this.orderState){
      case 'allOrder' :
        status = 0
        break;
      case 'pendingPay' :
        status = 1
        break;
      case 'pendingSend' :
        status = 3
        break
      case 'pendingReceived' :
        status = 4
        break
      case 'done' :
        status = 7
        break
      case 'cancel' :
        status = 5
        break
      case 'afterSale' :
        status = 2
        break
      case 'close' :
        status = 6
        break
      default:
        status = 0
    }

    this.params.paramStatus = status
  }

  getOrderTitle() {
    let text = ''

    switch (this.orderState){
      case 'allOrder' :
        text = '全部订单'
      break;
      case 'pendingPay' :
        text = '待付款'
      break;
      case 'pendingSend' :
        text = '待发货'
      break
      case 'pendingReceived' :
        text = '待收货'
      break
      case 'done' :
        text = '交易完成'
      break
      case 'cancel' :
        text = '已取消'
      break
      case 'afterSale' :
        text = '售后待处理'
      break
      case 'close' :
        text = '已关闭'
      break
      default:
        text = ''
    }

    this.setState({orderTitle: text})
  }

  getOrder = () => {
    const data = this.paramHandle()
    const {dispatch} = this.props
    const actionType = this.orderState === 'afterSale' ? 'orderData/getReverseOrder' : 'orderData/getOrder'
    dispatch({
      type: actionType,
      payload: data
    }).then(() => {
      const {orderData} = this.props
      this.setState({total: orderData.total})
    })
  }

  paramHandle = () => {
    const {paramStatus, orderId, buyerId, orderType, time} = this.params
    const {pageSize, page} = this.state
    const params = {
      current: page,
      pageSize
    }
    if (paramStatus && paramStatus !== 2) {
      params.status = paramStatus
    }
    if (orderId) {
      params.orderNo = orderId
    }
    if (buyerId) {
      params.buyerId = buyerId
    }
    if (orderType) {
      params.type = orderType
    }
    if (time) {
      const start = Date.parse(time[0])
      const end = Date.parse(time[1])
      params.start = start
      params.end = end
    }

    return params
  }

  clearParam = () => {
    const {orderState} = this
    this.params = {
      paramStatus: orderState === 'afterSale' || orderState === 'allOrder' ? 0 : this.params.paramStatus,
      orderId: '',
      buyerId: '',
      orderType: 0,
      time: ''
    }
    this.setState({
      page: 1,
      pageSize: 10
    }, () => {
      this.getOrder()
    })
  }

  pagingLoad = (page, pageSize) => {
    this.setState({
      page,
      pageSize
    }, () => {
      this.getOrder()
    })
  }

  getFilterParam = (value, text) => {
    switch (text) {
      case 'order' :
        this.params.orderId = value
      break
      case 'buyer' :
        this.params.buyerId = value
      break
      case 'type' :
        this.params.orderType = value
      break
      case 'status' :
        this.params.paramStatus = value
      break
      case 'time' :
        this.params.time = value
      break
      default :
        this.params = {
          paramStatus: 0,
          orderId: '',
          buyerId: '',
          orderType: 1,
          time: ''
        }
    }
  }

  goSearch = () => {
    this.setState({
      page: 1
    }, () => {
      this.getOrder()
    })
  }

  showAlert = (id, type, status) => {
    this.setState({
      isAlert: true,
      orderId: id,
      operatingType: type,
      orderStatus: status
    })
  }

  hideAlert = () => {
    this.setState({isAlert: false})
  }

  operatingSuccess = param => {
    notification.success({
      message: '操作成功',
      description: param,
    })
    this.hideAlert()
    this.getOrder()
  }

  render(){
    const {orderTitle, total, page, pageSize, isAlert, orderId, operatingType, orderStatus} = this.state
    const {orderState} = this
    const {orderData, loading} = this.props
    const pageParams = {
      total,
      pageSize,
      current: page,
      onChange: this.pagingLoad
    }

    return(
      <PageHeaderWrapper title={orderTitle}>
        <div style={{background: '#fff', padding: 24}}>
          <OrderFilter
            getFilterParam={this.getFilterParam}
            search={this.goSearch}
            orderState={orderState}
            clearParam={this.clearParam}
          />
          {
            orderData ?
              <OrderList
                showAlert={this.showAlert}
                tableLoad={loading}
                pageParams={pageParams}
                data={orderData.records}
                orderState={orderState}
              /> :
              null
          }
        </div>
        {isAlert ? <ActionAlery orderId={orderId} orderStatus={orderStatus} show={isAlert} success={this.operatingSuccess} hide={this.hideAlert} type={operatingType} /> : null }
      </PageHeaderWrapper>
    )
  }
}

export default connect(({orderData, loading}) => ({
  orderData,
  loading: loading.models.orderData
}))(Order)
