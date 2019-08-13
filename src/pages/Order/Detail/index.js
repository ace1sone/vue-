import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper/index';
import {connect} from "dva/index";
import {Spin,notification} from 'antd'
import router from 'umi/router'
import Tab from './Tab'
import TextInfo from './TextInfo'
import TableInfo from './TableInfo'
import OrderBtn from './OrderBtn'
import {getStatusText, getTypeText, subordinateText} from '../Text'
import detailTable from './DetailTable.config'
import ActionAlery from '../container/ActionAlert'


class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.tabList = [
      {
        name: '订单信息',
        key: 'order'
      },
      {
        name: 'SKU信息',
        key: 'sku'
      },
      {
        name: '优惠信息',
        key: 'preferential'
      },
      {
        name: '运费信息',
        key: 'freight'
      },
      {
        name: '支付明细',
        key: 'pay'
      },
      {
        name: '收货信息',
        key: 'received'
      },
      {
        name: '操作记录',
        key: 'action'
      }
    ]
    this.locationStatus = ''
    this.state = {
      tabSelected: 'order',
      orderData: [],
      receivedInfoData: [],
      isAlert: false,
      orderId: undefined,
      operatingType: undefined,
      orderStatus: undefined
    }
  }

  componentWillMount() {
    this.getData()
    this.getLocation()
  }

  getLocation = () => {
    const {location} = this.props
    const locationArr = location.pathname.split('/')
    const locationInfo = locationArr[locationArr.indexOf('b2cOrder') + 1]
    this.locationStatus = locationInfo
  }

  getData = () => {
    const {match, dispatch} = this.props
    dispatch({
      type: 'orderDetailData/getOrderDetail',
      payload: match.params.id
    }).then(() => {
      const {orderDetailData} = this.props
      const orderInfo = [
        {
          key: '订单状态：',
          value: getStatusText(orderDetailData.status),
          maxWidth: true
        },
        {
          key: '订单号：',
          value: orderDetailData.orderNo
        },
        {
          key: '交易从属：',
          value: subordinateText(orderDetailData.subordinate)
        },
        {
          key: '订单类型：',
          value: getTypeText(orderDetailData.type)
        },
        {
          key: '创建时间：',
          value: orderDetailData.createdAt
        },
        {
          key: '卖家ID：',
          value: orderDetailData.sellerId
        },
        {
          key: '买家ID：',
          value: orderDetailData.userId
        },
        {
          key: '支付时间：',
          value: orderDetailData.payment.length ? orderDetailData.payment[0].createdAt : null
        },
        {
          key: '快递公司：',
          value: orderDetailData.orderLogistics ? orderDetailData.orderLogistics.logisticsCompanyName : null
        },
        {
          key: '快递单号：',
          value: orderDetailData.orderLogistics ? orderDetailData.orderLogistics.logisticsNumber : null
        },
        {
          key: '发货时间：',
          value: orderDetailData.orderLogistics ? orderDetailData.orderLogistics.createdAt : null
        },
        {
          key: '买家留言：',
          value: orderDetailData.remark,
          maxWidth: true
        }
      ]

      const receivedInfo = [
        {
          key: '省/市/区：',
          value: `${orderDetailData.address.province} ${orderDetailData.address.city} ${orderDetailData.address.county}`
        },
        {
          key: '详细地址：',
          value: orderDetailData.address.address
        },
        {
          key: '收货人：',
          value: orderDetailData.address.receiverName
        },
        {
          key: '联系方式：',
          value: orderDetailData.address.phone
        }
      ]

      this.setState({orderData: orderInfo, receivedInfoData: receivedInfo})
    })
  }

  clickTab = (k) => {
    this.setState({tabSelected: k})
    if (k) {
      const anchorElement = document.getElementById(k);
      if(anchorElement) { anchorElement.scrollIntoView({behavior: 'smooth', block: 'start'}); }
    }
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
    router.goBack()
  }

  render(){
    const {tabList, locationStatus} = this
    const {tabSelected, orderData, receivedInfoData, isAlert, orderId, operatingType, orderStatus} = this.state
    const {orderDetailData, loading} = this.props

    return(
      <PageHeaderWrapper title="订单详情">
        {
          orderDetailData && !loading ?
            <div>
              <Tab data={tabList} selected={tabSelected} clickTab={this.clickTab} />
              <div id="order">
                <TextInfo source="order" key="orderInfo" data={orderData} />
              </div>
              <div id="sku">
                <TableInfo source="sku" key="sky" orderDetailData={orderDetailData} columns={detailTable.goods} />
              </div>
              <div id="preferential">
                <TableInfo source="preferential" key="preferential" orderDetailData={orderDetailData} columns={detailTable.preferential} />
              </div>
              <div id="freight">
                <TableInfo source="freight" key="freight" orderDetailData={orderDetailData} columns={detailTable.freight} />
              </div>
              <div id="pay">
                <TableInfo source="pay" key="pay" orderDetailData={orderDetailData} columns={detailTable.pay} />
              </div>
              <div id="received">
                <TextInfo source="received" key="receivedInfo" data={receivedInfoData} />
              </div>
              <div id="action">
                <TableInfo source="action" key="action" orderDetailData={orderDetailData} columns={detailTable.action} />
              </div>
              <OrderBtn locationStatus={locationStatus} show={this.showAlert} orderDetailData={orderDetailData} />
            </div> :
            <div style={{width: '100%', height: '100%', textAlign: 'center'}}>
              <Spin />
            </div>
        }
        {isAlert ? <ActionAlery orderId={orderId} orderStatus={orderStatus} show={isAlert} success={this.operatingSuccess} hide={this.hideAlert} type={operatingType} /> : null }
      </PageHeaderWrapper>
    )
  }
}

export default connect(({orderDetailData, loading}) => ({
  orderDetailData,
  loading: loading.models.orderDetailData
}))(Detail)
