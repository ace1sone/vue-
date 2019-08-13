exports.routes = [
    {
      path: '/contentManagement',
      name: 'contentManagement',
      icon: 'file-search',
      routes: [
        {
          path: '/contentManagement/card',
          name: 'card',
          component: './ContentMgmt/CardList',
        },
        {
          path: '/contentManagement/card/create',
          name: 'create',
          component: './ContentMgmt/CreateCard',
          hideInMenu: true
        },
        {
          path: '/contentManagement/card/detail',
          name: 'detial',
          component: './ContentMgmt/CardDetail',
          hideInMenu: true
        }
      ],
    },
  ];
  