exports.routes = [
  {
    path: '/admin',
    name: 'admin',
    icon: 'control',
    routes: [
      {
        path: '/admin/ops',
        name: 'ops',
        routes: [
          {
            path: '/admin/ops/all',
            name: 'all',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/admin/ops/all',
                component: './Admin/Ops/List',
              },
              {
                path: '/admin/ops/all/detail/:id',
                name: 'detail',
                component: './Admin/Ops/OpsForm',
              },
              {
                path: '/admin/ops/all/new',
                component: './Admin/Ops/OpsForm',
              },
            ],
          },
        ],
      },
      {
        path: '/admin/business',
        name: 'business',
        routes: [
          {
            path: '/admin/business/operation',
            name: 'operation',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/admin/business/operation',
                component: './Admin/controls/btns',
              },
            ],
          },
        ],
      },
    ],
  },
];
