exports.routes = [
  {
    path: '/eval',
    name: 'evaluatorMgmt',
    icon: 'user',
    routes: [
      {
        path: '/eval/evaluator',
        name: 'evalManager',
        routes: [
          {
            path: '/eval/evaluator/complaint',
            name: 'complaint',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/eval/evaluator/complaint',
                redirect: '/eval/evaluator/complaint/list',
              },
              {
                path: '/eval/evaluator/complaint/list',
                component: './Evaluation/Complaint/Lists',
              },
              {
                hideInMenu: true,
                path: '/eval/evaluator/complaint/resolvedlist',
                component: './Evaluation/Complaint/ResolvedLists',
              },
            ],
          },
          {
            path: '/eval/evaluator/requirement',
            name: 'requirement',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/eval/evaluator/requirement',
                redirect: '/eval/evaluator/requirement/list',
              },
              {
                path: '/eval/evaluator/requirement/list',
                component: './Evaluation/Requirement/Lists',
              },
            ],
          },
        ],
      },
      {
        path: '/eval/users',
        name: 'user',
        routes: [
          {
            path: '/eval/users/users',
            name: 'users',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/eval/users/users',
                redirect: '/eval/users/users/list',
              },
              {
                path: '/eval/users/users/list',
                component: './Evaluation/Users/Lists',
              },
              {
                name: 'edit',
                path: '/eval/users/users/edit/:id',
                component: './Evaluation/Users/Edit',
              },
            ],
          },
          {
            path: '/eval/users/evaluator',
            name: 'evaluator',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/eval/users/evaluator',
                redirect: '/eval/users/evaluator/list',
              },
              {
                path: '/eval/users/evaluator/list',
                component: './Evaluation/Evaluator/Lists',
              }
            ],
          },
        ],
      },
      {
        path: '/eval/tool',
        name: 'tool',
        routes: [
          {
            path: '/eval/tool/tags',
            name: 'tag',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/eval/tool/tags',
                redirect: '/eval/tool/tags/list',
              },
              {
                path: '/eval/tool/tags/list',
                component: './Evaluation/Tags/Lists',
              }
            ],
          },
        ],
      },
    ],
  },
];
