exports.routes = [
  {
    path: '/product/stockout',
    name: 'stockout',
    routes: [
      {
        path: '/product/stockout/outorders',
        name: 'outOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockout/outorders',
            component: './Product/Stockout/All/List',
          },
          {
            path: '/product/stockout/outorders/new',
            name: 'newStockout',
            component: './Product/Stockout/All/Detail',
          },
        ],
      },
      {
        path: '/product/stockout/waits',
        name: 'waitsOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockout/waits',
            component: './Product/Stockout/Wait/List',
          },
          {
            path: '/product/stockout/waits/detail',
            component: './Product/Stockout/Wait/Detail',
          },
        ],
      },
      {
        path: '/product/stockout/rejects',
        name: 'rejectsOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockout/rejects',
            component: './Product/Stockout/Reject/List',
          },
          {
            path: '/product/stockout/rejects/detail',
            component: './Product/Stockout/Reject/Detail',
          }
        ],
      },
      {
        path: '/product/stockout/completeds',
        name: 'completedOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockout/completeds',
            component: './Product/Stockout/Completed/List',
          },
          {
            path: '/product/stockout/completeds/detail',
            component: './Product/Stockout/Completed/Detail',
          }
        ],
      }, {
        path: '/product/stockout/invalids',
        name: 'invalidOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockout/invalids',
            component: './Product/Stockout/Invalid/List',
          },
          {
            path: '/product/stockout/invalids/detail',
            component: './Product/Stockout/Invalid/Detail',
          }
        ],
      },
    ],
  },
];
