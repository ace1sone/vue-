exports.routes = [
  {
    path: '/product/stockin',
    name: 'stockin',
    routes: [
      {
        path: '/product/stockin/inorders',
        name: 'inOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockin/inorders',
            component: './Product/Stockin/All/List',
          },
          {
            path: '/product/stockin/inorders/new',
            name: 'newStockin',
            component: './Product/Stockin/All/Detail',
          },
        ],
      },
      {
        path: '/product/stockin/waits',
        name: 'waitsOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockin/waits',
            component: './Product/Stockin/Wait/List',
          }, {
            path: '/product/stockin/waits/detail',
            component: './Product/Stockin/Wait/Detail',
          },
        ],
      },
      {
        path: '/product/stockin/rejects',
        name: 'rejectsOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockin/rejects',
            component: './Product/Stockin/Reject/List',
          },
          {
            path: '/product/stockin/rejects/detail',
            component: './Product/Stockin/Reject/Detail',
          },
        ],
      },
      {
        path: '/product/stockin/completeds',
        name: 'completedOrders',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/stockin/completeds',
            component: './Product/Stockin/Completed/List',
          }, {
            path: '/product/stockin/completeds/detail',
            component: './Product/Stockin/Completed/Detail',
          },
        ],
      },
    ],
  },
];
