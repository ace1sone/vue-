exports.routes = [
  {
    path: '/story',
    name: 'story',
    icon: 'snippets',
    routes: [
      {
        path: '/story/home',
        name: 'homemgmt',
        routes: [
          {
            path: '/story/home/all',
            name: 'all',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/story/home/all',
                component: './Story/Home/All/List',
              },
              {
                path: '/story/home/all/new',
                name: 'new',
                component: './Story/Home/Common/Detail/StoryForm',
              },
              {
                path: '/story/home/all/edit/:id',
                component: './Story/Home/Common/Detail/StoryForm',
              },
              {
                path: '/story/home/all/detail/:id',
                component: './Story/Home/Common/Detail/StoryDetail',
              },
              {
                path: '/story/home/all/reply/:id',
                component: './Story/Home/Common/Detail/Reply',
              },
            ],
          },
        ],
      },
      {
        path: '/story/material',
        name: 'materialmgmt',
        routes: [
          {
            path: '/story/material/all',
            name: 'all',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/story/material/all',
                component: './Story/Material/List',
              },
              {
                path: '/story/material/all/new',
                name: 'new',
                component: './Story/Material/MaterialForm',
              },
              {
                path: '/story/material/all/edit/:id',
                component: './Story/Material/MaterialForm',
              },
              {
                path: '/story/material/all/detail/:id',
                component: './Story/Material/Detail',
              },
            ],
          },
        ],
      },
    ],
  },
];
