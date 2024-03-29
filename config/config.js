// ref: https://umijs.org/config/
import { primaryColor, buttonPrimaryBg, actionPrimaryColor } from '../src/defaultSettings';
import pageRoutes from './router.config';
const { ENV = 'dev' } = process.env;
console.log('ENV', ENV);

export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: {
    ie: 11,
  },

  /**
   * 路由相关配置
   */
  routes: pageRoutes,
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    ENV,
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
    'btn-primary-bg': buttonPrimaryBg,
    'link-color': actionPrimaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  publicPath: './',
  history: 'hash',
  hash: true
};
