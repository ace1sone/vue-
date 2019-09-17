exports.routes = [
  {
    path: '/alterGoods',
    name: 'AlterGoods',
    icon: 'profile',
    routes: [
      {
        path: '/alterGoods/alterFliter',
        name: 'AlterFliter',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/alterGoods/alterFliter',
            component: './AlterGoods/List',
          },
          {
            path: '/alterGoods/alterFliter/detail/:id',
            name: 'Detail',
          },
          {
            path: '/alterGoods/alterFliter/addMap/:id',
            name: 'AddMap',
          },
          {
            path: '/alterGoods/alterFliter/editMap/:id',
            name: 'EditMap',
          },
        ],
      },
      {
        path: '/alterGoods/alterMap',
        name: 'AlterMap',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/alterGoods/alterMap',
            component: './AlterGoods/List',
          },
          {
            path: '/alterGoods/alterMap/edit/:id',
            name: 'EditMap',
          },
        ],
      },
    ],
  },
];
