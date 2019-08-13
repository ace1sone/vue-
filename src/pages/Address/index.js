exports.routes = [
  {
    path: '/address',
    name: 'address',
    icon: 'pic-right',
    routes: [
      {
        path: '/address/shopaddress',
        name: 'shopaddress',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/address/shopaddress',
            component: './Address/Shopaddress/List',
          },
        ],
      },
    ],
  },
];
