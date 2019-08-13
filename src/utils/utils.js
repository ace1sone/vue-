import { parse, stringify } from 'qs';
import shortid from 'shortid';
import moment from 'moment';

export function isUrl(path) {
  /* eslint no-useless-escape:0 import/prefer-default-export:0 */
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

  return reg.test(path);
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

export function getGuid(prefx) {
  return prefx ? `${prefx}/${shortid.generate()}` : shortid.generate();
}

export function genGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function download(response, opt) {
  try {
    // Making a hidden anchor element and simulate click on it to force download
    let filename = response.headers['content-disposition'].split('filename=')[1];
    filename = filename.substring(1, filename.length - 1);
    filename = decodeURIComponent(filename);
    const name = filename.split('.')[0];
    const ext = filename.split('.')[1];
    filename = `${name}${moment().format('YYYYMMDD')}.${ext}`;
    const file = new Blob([response.data], opt);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
}

export function isRepeat(arr) {
  const hash = {};
  let repeat = false;
  arr.forEach(ele => {
    if (!hash[ele]) {
      hash[ele] = true;
    } else {
      repeat = true;
    }
  });
  return repeat;
}

export function getImgSrc(src) {
  if (/\[.+\]/.test(src)) {
    return JSON.parse(src)[0];
  }
  return src;
}

export function getImgWidthAndHeight(src, callback) {
  const img = new Image();

  img.src = src;

  if (img.complete) {
    callback({ width: img.width, height: img.height });
  } else {
    img.onload = () => {
      callback({ width: img.width, height: img.height });
    };
  }
}
