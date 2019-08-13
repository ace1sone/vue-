exports.routes = [
  {
    path: '/product/shelve',
    name: 'shelve',
    routes: [
      {
        path: '/product/shelve/prdshelve',
        name: 'prdshelve',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/product/shelve/prdshelve',
            component: './Product/Shelve/List',
          },
          {
            path: '/product/shelve/prdshelve/invdetail/:id',
            name: 'invdetail',
            component: './Product/Shelve/InvForm',
          },
          {
            path: '/product/shelve/prdshelve/prddetail/:id',
            name: 'prddetail',
            component: './Product/Shelve/PrdForm',
          },
        ],
      },
    ],
  },
];
