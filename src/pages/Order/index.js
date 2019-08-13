exports.routes = [{
  path: '/order',
  name: 'order',
  icon: 'profile',
  routes: [
    {
      path: '/order/b2cOrder',
      name: 'B2Corder',
      routes: [
        {
          path: '/order/b2cOrder/allOrder',
          name: 'allOrder',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/allOrder',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/allOrder/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/pendingPay',
          name: 'pendingPay',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/pendingPay',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/pendingPay/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/pendingSend',
          name: 'pendingSend',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/pendingSend',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/pendingSend/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/pendingReceived',
          name: 'pendingReceived',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/pendingReceived',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/pendingReceived/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/done',
          name: 'done',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/done',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/done/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/cancel',
          name: 'cancel',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/cancel',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/cancel/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/afterSale',
          name: 'afterSale',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/afterSale',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/afterSale/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/close',
          name: 'close',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/order/b2cOrder/close',
              component: './Order/List',
            },
            {
              path: '/order/b2cOrder/close/detail/:id',
              name: 'detail',
              component: './Order/Detail',
            },
          ]
        },
        {
          path: '/order/b2cOrder/waybills',
          name: 'waybillManager',
          routes: [
            {
              path: '/order/b2cOrder/waybills',
              name: 'waybillList',
              component: './Product/Waybill/WaybillManager'
            },
            {
              path: '/order/b2cOrder/waybills/detail',
              name: 'waybillDetail',
              component: './Product/Waybill/WaybillDetail',
              hideInMenu: true
            },
            {
              path: '/order/b2cOrder/waybills/bulk',
              name: 'bulk',
              component: './Product/Waybill/Bulk',
              hideInMenu: true
            }
          ],
        }
      ]
    }
  ]
}]
