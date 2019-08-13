exports.routes = [
  {
    path: '/product/skuservice',
    name: 'skuservice',
    routes: [
      {
        path: '/product/skuservice/service',
        name: 'service',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/skuservice/service',
            component: './Product/SkuService/List',
          },
          {
            path: '/product/skuservice/service/detail/:id',
            name: 'detail',
            component: './Product/SkuService/SkuServiceForm',
          },
          {
            path: '/product/skuservice/service/new',
            component: './Product/SkuService/SkuServiceForm',
          },
        ],
      },
    ],
  },
];
