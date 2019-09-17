import { routes as userRoutes } from '../src/pages/User';
import { routes as evalRoutes } from '../src/pages/Evaluation';
import { routes as orderRoutes } from '../src/pages/Order';
import { routes as stockInRoutes } from '../src/pages/Product/Stockin';
import { routes as stockOutRoutes } from '../src/pages/Product/Stockout';
import { routes as shelveRoutes } from '../src/pages/Product/Shelve';
import { routes as serviceRoutes } from '../src/pages/Product/SkuService';
import { routes as activityRoutes } from '../src/pages/Activity';
import { routes as addrRoutes } from '../src/pages/Address';
import { routes as adminRoutes } from '../src/pages/Admin';
import { routes as ContentManagmentRoutes } from '../src/pages/ContentMgmt';
import { routes as ConfigurationRoutes } from '../src/pages/Configuration';
import { routes as storyRoutes } from '../src/pages/Story';
import { routes as tagsRoutes } from '../src/pages/Tags';
import { routes as AlterGoods } from '../src/pages/AlterGoods';

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [...userRoutes],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/' },
      {
        path: '/product',
        icon: 'shopping',
        name: 'product',
        routes: [
          {
            path: '/product/spu',
            name: 'spuManager',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/product/spu',
                component: './Product/Spu/SpuManager',
              },
              {
                path: '/product/spu/detail/:id',
                name: 'spuDetail',
                component: './Product/Spu/SpuDetail',
              },
              {
                path: '/product/spu/edit/:id',
                name: 'spuEdit',
                component: './Product/Spu/SpuDetail',
              },
              {
                path: '/product/spu/new',
                name: 'newSpu',
                component: './Product/Spu/SpuDetail',
              },
            ],
          },
          {
            path: '/product/properties',
            name: 'properties',
            routes: [
              {
                path: '/product/properties/spec',
                name: 'specManager',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/product/properties/spec',
                    component: './Product/Properties/Spec/SpecManager',
                  },
                  {
                    path: '/product/properties/spec/detail/:id',
                    name: 'specDetail',
                    component: './Product/Properties/Spec/SpecDetail',
                  },
                  {
                    path: '/product/properties/spec/edit/:id',
                    name: 'specEdit',
                    component: './Product/Properties/Spec/SpecForm',
                  },
                  {
                    path: '/product/properties/spec/new',
                    name: 'newSpec',
                    component: './Product/Properties/Spec/SpecForm',
                  },
                ],
              },
              {
                path: '/product/properties/desc',
                name: 'descManager',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/product/properties/desc',
                    component: './Product/Properties/Desc/DescManager',
                  },
                  {
                    path: '/product/properties/desc/detail/:id',
                    name: 'descDetail',
                    component: './Product/Properties/Desc/DescInfo',
                  },
                  {
                    path: '/product/properties/desc/edit/:id',
                    name: 'descEdit',
                    component: './Product/Properties/Desc/DescDetail',
                  },
                  {
                    path: '/product/properties/desc/new',
                    name: 'newDesc',
                    component: './Product/Properties/Desc/DescDetail',
                  },
                ],
              },
              {
                path: '/product/properties/brand',
                name: 'brandManager',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/product/properties/brand',
                    component: './Product/Properties/Brand/BrandManager',
                  },
                  {
                    path: '/product/properties/brand/detail/:id',
                    name: 'brandDetail',
                    component: './Product/Properties/Brand/BrandDetail',
                  },
                  {
                    path: '/product/properties/brand/edit/:id',
                    name: 'brandEdit',
                    component: './Product/Properties/Brand/BrandForm',
                  },
                  {
                    path: '/product/properties/brand/new',
                    name: 'newBrand',
                    component: './Product/Properties/Brand/BrandForm',
                  },
                ],
              },
            ],
          },
          {
            path: '/product/backCatalog',
            name: 'backCatalogManager',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/product/backCatalog',
                component: './Product/BackCatalog/CatalogManager',
              },
              {
                path: '/product/backCatalog/new',
                component: './Product/BackCatalog/NewCatalog',
              },
            ],
          },
          {
            path: '/product/frontCatalog',
            name: 'frontCatalogManager',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/product/frontCatalog',
                component: './Product/FrontCatalog/CatalogManager',
              },
              {
                path: '/product/frontCatalog/new',
                component: './Product/FrontCatalog/NewCatalog',
              },
            ],
          },
          ...stockInRoutes,
          ...stockOutRoutes,
          ...shelveRoutes,
          ...serviceRoutes,
        ],
      },
      ...orderRoutes,
      ...activityRoutes,
      ...storyRoutes,
      ...evalRoutes,
      ...addrRoutes,
      ...ContentManagmentRoutes,
      ...ConfigurationRoutes,
      ...tagsRoutes,
      ...AlterGoods,
      {
        component: './exception-404',
      },
    ],
  },
];
