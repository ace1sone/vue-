exports.routes = [
  {
    path: '/configuration',
    name: 'configuration',
    icon: 'control',
    routes: [
      {
        path: '/configuration/homemgmt',
        name: 'homemgmt',
        routes: [
          {
            path: '/configuration/homemgmt/newtabs',
            name: 'newtabs',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/configuration/homemgmt/newtabs',
                component: './Configuration/HomeMgmt/NewTabs/List',
              },
            ],
          },
          {
            path: '/configuration/homemgmt/saletabs',
            name: 'saletabs',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/configuration/homemgmt/saletabs',
                component: './Configuration/HomeMgmt/SaleTabs/List',
              },
            ],
          },
        ],
      },
    ],
  },
];
