import _ from 'lodash';
import moment from 'moment';

const action = (type, payload) => ({ type, payload });

/* eslint-disable */
export default class Utils {

  static toBool(val, defVal = false) {
    if (_.isUndefined(val)) return defVal;
    if (val == 'true') return true;
    if (val == 1) return true;
    return false;
  }

  static parseInt(val) {
    return parseInt(val, 10);
  }

  static parseFloat(val) {
    var res = parseFloat(val);
    if (_.isNaN(res)) return val;
    return res;
  }

  static parseJson(val, fallbackValue) {
    try {
      return JSON.parse(val);
    } catch (e) {
      if (fallbackValue !== undefined) return fallbackValue;
      return val;
    }
  }

  static isEmpty(val) {
    if (_.isNumber(val) && val != 0) return false;
    if (val === true) return false;
    if (val === '0') return true;
    return _.isEmpty(val);
  }

  static isBlank(val) {
    return _.isString(val) ? !!!_.trim(val) : Utils.isEmpty(val);
  }

  static in(collection, value) {
    return _.includes(collection, value);
  }

  static inRange(date, startDate, endDate) {
    return moment(date).isBetween(moment(startDate), moment(endDate));
  }

  static first(obj, defaultValue) {
    if (!obj) return defaultValue;
    if (_.isArray(obj)) return _.first(obj) || defaultValue;
    return obj[_.keys(obj)[0]] || defaultValue;
  }

  static toLower(str) {
    if (!_.isString(str)) return str;
    return str.toLowerCase();
  }

  static toArray(obj) {
    if (_.isArray(obj)) return obj;
    return [obj];
  }

  static arrayInsert(array, predicate, ...toInsert) {
    let insertIndex = array.findIndex(predicate);
    array.splice(insertIndex + 1, 0, ...toInsert);
  }

  static arrayRemove(array, predicate) {
    let index = array.findIndex(predicate);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

  static deepFind(data, predicate, childProp = 'children') {
    return _(data)
      .thru(function (coll) {
        return _.union(coll, _.map(coll, childProp));
      })
      .flatten()
      .compact()
      .find(predicate);
  }

  static mergeArrayBy(targetArr, sourceArr, prop) {
    targetArr = _.clone(targetArr);
    sourceArr = _.clone(sourceArr);
    for (let i = 0, l = targetArr.length; i < l; i++) {
      let target = targetArr[i];
      for (let j = 0, n = sourceArr.length; j < n; j++) {
        let source = sourceArr[j];
        if (source[prop] === target[prop]) {
          targetArr[i] = { ...target, ...source };
          sourceArr.splice(j, 1);
          break;
        }
      }
    }
    if (_.isEmpty(sourceArr)) {
      return targetArr;
    }
    return targetArr.concat(sourceArr);
  }

  static toDate(str) {
    if (!str) return str;
    return moment(str).toDate();
  }

  static formatDate(dt, format = 'YYYY/MM/DD') {
    if (!dt) return dt;
    return moment(dt).format(format);
  }

  static formatTime(dt, format = 'HH:mm:ss') {
    if (!dt) return dt;
    return moment(dt).format(format);
  }

  static formatDateTime(dt, format = 'YYYY/MM/DD HH:mm:ss') {
    if (!dt) return dt;
    return moment(dt).format(format);
  }

  static formatPeriod(from, to) {
    if (!from) return '';
    if (!to) return '';
    return `${from} 至 ${to}`;
  }

  static ifSmallScreen(fn = _.noop) {
    if (matchMedia('(max-width: 480px)').matches) {
      return fn();
    }
  }

  static ifNotSmallScreen(fn = _.noop) {
    if (matchMedia('(max-width: 480px)').matches) {
      return;
    }
    return fn();
  }

  /**
   * Convert number of seconds into time object
   *
   * @param integer secs Number of seconds to convert
   * @return object
   */
  static secondsToTime(secs, useday = true) {

    var hours = Math.floor(secs / (60 * 60));

    if (useday) {
      var days = Math.floor(hours / 24);
      hours = hours - days * 24;
    }

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    return {
      "d": days || 0,
      "h": hours,
      "m": minutes,
      "s": seconds
    };

  }

  static formatDuration(duration, opt = { d: true, h: true, m: true, s: true }) {
    var formatted = '';
    duration = Utils.secondsToTime(duration);
    if (opt.d && duration.d > 0) formatted += `${duration.d}天`;
    if (opt.h && duration.h > 0) formatted += `${duration.h}小时`;
    if (opt.m && duration.m > 0) formatted += `${duration.m}分`;
    if (opt.s && duration.s > 0) formatted += `${duration.s}秒`;
    return formatted;
  }

  static formatDurationWithColon(duration, opt = { d: false, h: true, m: true, s: true }) {
    var formatted = '';
    duration = Utils.secondsToTime(duration, false);
    if (duration.h < 10) duration.h = '0' + duration.h;
    if (duration.m < 10) duration.m = '0' + duration.m;
    if (duration.s < 10) duration.s = '0' + duration.s;
    if (opt.d && duration.d > 0) formatted += `${duration.d}:`;
    if (opt.h && duration.h >= 0) formatted += `${duration.h}:`;
    if (opt.m && duration.m >= 0) formatted += `${duration.m}:`;
    if (opt.s && duration.s >= 0) formatted += `${duration.s}`;
    return formatted;
  }

  static getMaxDuration(duration) {
    duration = Utils.secondsToTime(duration);
    if (duration.d > 0) return `${duration.d}天前`;
    if (duration.h > 0) return `${duration.d}小时前`;
    if (duration.m > 0) return `${duration.d}分前`;
    return '刚刚';
  }

  static formatDurationFromNow = (time, opt = { d: true, h: true, m: true, s: false }) => {
    return Utils.formatDuration((moment.now() - time) / 1000, opt);
  }

  static calcDurationTime = (time, now = moment.now()) => {
    var min = 1000 * 60;
    var hour = min * 60;
    var diff = now - time;

    if (diff > hour) {
      return moment().diff(moment(time), 'hours') + '小时';
    }
    if (diff > min) {
      return moment().diff(moment(time), 'minutes') + '分钟';
    }
    return '刚刚';
  }

  static formatCurrency(number, precision = 2, dot = '.', separator = ',') {
    let sign = number < 0 ? "-" : "",
      i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(precision))),
      j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + separator : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + separator) +
      (precision ? dot + Math.abs(number - i).toFixed(precision).slice(2) : "");
  }

  static formatMobilePrice(price, precision = 0, excludeZero = true) {
    if (price === undefined) return '--';
    if (parseFloat(price) === 0 && excludeZero) return '--';
    return '\u00a5' + Utils.formatCurrency(price, precision);
  }

  static truncate(str) {
    return _.truncate(str)
  }

  static getHttpUrl(url) {
    return _.replace(url, 'https://', 'http://');
  }

  // static mapTrackUrl(config) {
  //   return mapUrl(config);
  // }

  static setTabbarBadge({ index, text = '' }, opts = { removeEmpty: true }) {
    text = _.trimStart('0' + text, '0');
    if (Utils.isEmpty(text) && opts.removeEmpty) {
      return wx.removeTabBarBadge({ index });
    }
    wx.setTabBarBadge({
      index,
      text
    });
  }

  static async withCache(fn = _.noop, store, item, flush = false) {
    if (store[item] && !flush) return store[item];
    store[item] = await fn();
    return store[item];
  }

  static watchFor(fn = _.noop, waitTime = 500, wait2ndTime, wait3rdTime) {
    setTimeout(fn, waitTime);
    if (wait2ndTime) setTimeout(fn, wait2ndTime);
    if (wait3rdTime) setTimeout(fn, wait3rdTime);
  }

  static delay(waitTime = 1000) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), waitTime);
    });
  }

  static until(test, iterator, callback) {
    if (!test()) {
      iterator((err) => {
        if (err) {
          return callback(err);
        }
        Utils.until(test, iterator, callback);
      });
    } else {
      callback();
    }
  }

  static asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  static debounce(fn) {
    return _.debounce(fn, 500, { leading: true, trailing: false });
  }

  static dispatch(type, payload) {
    let dispatch = _.get(window, 'g_app._store.dispatch');
    if (!dispatch) return;
    dispatch(action(type, payload));
  }

  static decodeUrl(url, opts = {}) {
    opts = {
      doneRegEx: /^(https|http)?:\/\//, maxTries: 5,
      ...opts
    };
    let decodedUrl = url;
    let maxTries = opts.maxTries;
    do {
      decodedUrl = decodeURIComponent(decodedUrl);
      maxTries--;
      if (maxTries <= 0) break;
    } while (!opts.doneRegEx.test(decodedUrl));
    return decodedUrl;
  }

  static applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  }

  static boolType = {
    type: [Boolean, String],
    default: false,
    coerce(v) {
      return typeof v === 'string' ? JSON.parse(v) : v;
    }
  }

  static numberType = (defaultValue = 0) => ({
    type: [Number, String],
    default: defaultValue,
    coerce(v) {
      return typeof v === 'string' ? JSON.parse(v) : v;
    }
  })

  static toOrder(sorter) {
    if (!_.get(sorter, 'field')) return;
    if (sorter.order === 'ascend') return '+' + sorter.field;
    return '-' + sorter.field;
  }

}