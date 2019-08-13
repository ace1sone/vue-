exports.routes = [
  {
    path: '/activity',
    name: 'activity',
    icon: 'smile',
    routes: [
      {
        path: '/activity/sale',
        name: 'salemgmt',
        routes: [
          {
            path: '/activity/sale/all',
            name: 'all',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/sale/all',
                component: './Activity/Sale/All/List',
              },
              {
                path: '/activity/sale/all/new',
                name: 'new',
                component: './Activity/Sale/Common/Detail/ActivityForm',
              },
              {
                path: '/activity/sale/all/edit/:id',
                component: './Activity/Sale/Common/Detail/ActivityForm',
              },
              {
                path: '/activity/sale/all/data/:id',
                component: './Activity/Sale/Common/Detail/ActivityData',
              },
              {
                path: '/activity/sale/all/detail/:id',
                component: './Activity/Sale/Common/Detail/ActivityDetail',
              },
              {
                path: '/activity/sale/all/reply/:id',
                component: './Activity/Sale/Common/Detail/Reply',
              },
            ],
          },
          {
            path: '/activity/sale/edits',
            name: 'edits',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/sale/edits',
                component: './Activity/Sale/Edit/List',
              },
              {
                path: '/activity/sale/edits/detail',
                component: './Activity/Sale/Edit/Detail',
              },
            ],
          },
          // {
          //   path: '/activity/sale/pre',
          //   name: 'pre',
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: '/activity/sale/pre',
          //       component: './Activity/Sale/Pre/List',
          //     },
          //     {
          //       path: '/activity/sale/pre/detail',
          //       component: './Activity/Sale/Pre/Detail',
          //     },
          //   ],
          // },
          {
            path: '/activity/sale/process',
            name: 'process',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/sale/process',
                component: './Activity/Sale/Process/List',
              },
              {
                path: '/activity/sale/process/detail',
                component: './Activity/Sale/Process/Detail',
              },
            ],
          },
          {
            path: '/activity/sale/end',
            name: 'end',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/sale/end',
                component: './Activity/Sale/End/List',
              },
              {
                path: '/activity/sale/end/detail',
                component: './Activity/Sale/End/Detail',
              },
            ],
          },
        ],
      },
      {
        path: '/activity/task',
        name: 'taskmgmt',
        routes: [
          {
            path: '/activity/task/invited/list',
            name: 'invited',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/task/invited/list',
                component: './Activity/Task/Invited/List',
              },
              {
                path: '/activity/task/invited/list/detail',
                component: './Activity/Task/Invited/Detail',
              },
            ],
          },
          {
            path: '/activity/task/puzzle/List',
            name: 'puzzle',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/task/puzzle/list',
                component: './Activity/Task/Puzzle/List',
              },
              {
                path: '/activity/task/puzzle/list/detail',
                component: './Activity/Task/Puzzle/Detail',
              },
            ],
          },
          {
            path: '/activity/task/randomdraw/List',
            name: 'randomdraw',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/task/randomdraw/list',
                component: './Activity/Task/Randomdraw/List',
              },
              {
                path: '/activity/task/randomdraw/list/detail',
                component: './Activity/Task/Randomdraw/Detail',
              },
            ],
          },
        ],
      },
      {
        path: '/activity/material',
        name: 'materialmgmt',
        routes: [
          {
            path: '/activity/material/all',
            name: 'all',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/material/all',
                component: './Activity/Material/List',
              },
              {
                path: '/activity/material/all/new',
                name: 'new',
                component: './Activity/Material/MaterialForm',
              },
              {
                path: '/activity/material/all/edit/:id',
                component: './Activity/Material/MaterialForm',
              },
              {
                path: '/activity/material/all/detail/:id',
                component: './Activity/Material/Detail',
              },
            ],
          },
        ],
      },
      {
        path: '/activity/npc',
        name: 'npcmgmt',
        routes: [
          {
            path: '/activity/npc/roles/list',
            name: 'roles',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/npc/roles/list',
                component: './Activity/Npc/Roles/List',
              },
              {
                path: '/activity/npc/roles/list/detail',
                component: './Activity/Npc/Roles/Detail',
              },
            ],
          },
          {
            path: '/activity/npc/dynamic/List',
            name: 'dynamic',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/activity/npc/dynamic/list',
                component: './Activity/Npc/Dynamic/List',
              },
              {
                path: '/activity/npc/dynamic/list/detail',
                component: './Activity/Npc/Dynamic/Detail',
              },
            ],
          },
        ],
      },
    ],
  },
];
