exports.routes = [
  {
    path: '/tags',
    name: 'tags',
    icon: 'tags',
    routes: [
      {
        path: '/tags/allTags',
        name: 'allTags',
        hideChildrenInMenu: true,
        component: './Tags/AllTags/List',
      },
    ],
  },
];
