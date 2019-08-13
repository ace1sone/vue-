/* eslint-disable */
import { Modal } from 'antd';
import router from 'umi/router';

import Config from '@/config/Config';
import { Utils } from '@/shared/utility';

export default class UtilService {
  // history;

  // dialog;

  // promptDialog;

  storeService;

  spinnerAutoHide = true;

  constructor(storeService) {
    this.storeService = storeService;
  }

  showSpinner(message, silent = false) {
    if (silent) return;
    if (!this.loading) return;
    this.loading.start();
  }

  hideSpinner() {
    if (!this.loading) return;
    this.loading.stop();
  }

  /**
   * 处理 登录 和 页面回转
   */

  rememberLocation(location) {
    if (Config.isPhantomLocation(location)) return;
    this.storeService.storeTemp('backLocation', location);
  }

  returnBack() {
    let path = '';
    let targetLocation = this.storeService.getTemp('backLocation');
    if (targetLocation) {
      path = targetLocation.pathname;
    }
    this.replace(path);
    // window.location.replace(`${window.location.origin}${window.location.pathname}${path}`);
  }

  goto(pathname) {
    setTimeout(() => {
      router.push({ pathname });
    }, 0);
  }

  replace(pathname) {
    setTimeout(() => {
      router.replace({ pathname });
    }, 0);
  }

  goBack(n = -1) {
    setTimeout(() => {
      router.go(n);
    });
  }

  handleLogin = Utils.debounce(() => {
    this.goto('/user/login');
  });

  moveToTop() {
    window.scrollTo(0, 0);
  }

  alert = Utils.debounce((message, opts = {}) => {
    opts = {
      type: 'info',
      ...opts,
    };
    return new Promise(resolve => {
      Modal[opts.type]({
        title: '消息',
        content: message,
        onOk() {
          resolve();
        },
      });
    });
  });

  confirm(message) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '请确认',
        content: message,
        onOk() {
          resolve();
        },
        onCancel() {
          reject();
        },
      });
    });
  }

  prompt(title, size, control, placeholder) {
    // return this.promptDialog.show({ title, size, control, placeholder });
  }

  toast(message) {
    return this.alert(message);
  }
}
