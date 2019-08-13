exports.routes = [{
  path: '/supply',
  name: 'supply',
  icon: 'safety-certificate',
  routes: [
    {
      path: '/supply/list', name: 'list', component: './Supply/List', routes: [
        { path: '/supply/list' },
        { path: '/supply/list/supply', name: 'supply', hideInMenu: true, component: './Supply/Supply' }
      ],
    },
  ]
}]