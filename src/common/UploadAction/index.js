import React, { useState, forwardRef } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import _ from 'lodash';
import { getGuid } from '@/utils/utils';
import { uploadFileByOSS, ossPolicy } from '@/services/upload';
import Base64 from 'base-64';
import shortid from 'shortid';
import styles from './index.less';

const defaultImgSupportTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];

const handleFileValue = (fileList, isMp4) => {
  if (typeof fileList === 'string') {
    const thumbUrl = isMp4 ? { thumbUrl: 'http://woof-admin.oss-cn-hongkong.aliyuncs.com/upload/logo/video.jpg' } : {};
    return [
      {
        url: fileList,
        ...thumbUrl,
        uid: '-1',
      },
    ];
  }
  return fileList.map(file => ({ ...file, uid: getGuid() }));
};

function UploadAction(
  {
    onChange = () => {},
    uploadPrize,
    fileList,
    maxCount = 4,
    maxSize = 1024 * 1024 * 1, // byte 1M
    defaultValue,
    value,
    videoSize = 50,
    supportTypes = defaultImgSupportTypes,
    disabled,
    desc,
    onFileValue = handleFileValue,
    ...otherProps
  },
  ref
) {
  const valueTemp = fileList || value || defaultValue;
  const isMp4 = supportTypes.some(v => v.indexOf('mp4') >= 0);
  const [list, setList] = useState(onFileValue(valueTemp, isMp4));
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  // 实现 getDerivedStateFromProps
  const [preList, setPrevList] = useState([]);
  if (!_.isEqual(valueTemp, preList)) {
    const newList = onFileValue(valueTemp, isMp4);
    setList(newList);
    setPrevList(valueTemp);
    const uDisabled = valueTemp && valueTemp.length >= maxCount;
    setUploadDisabled(uDisabled);
  }

  let canUpload = false;

  function handleBeforeUpload(file, fList) {
    const fType = file.type;
    const fLen = fList.length;
    const fileTypeOk = supportTypes.indexOf(fType) !== -1;
    const fileLenOk = fLen <= maxCount;
    let isLtMaxSize = file.size <= maxSize;

    if (isMp4) {
      isLtMaxSize = file.size <= videoSize * 1024 * 1024;
    }

    canUpload = false;
    if (!fileLenOk) {
      return false;
    }
    if (!fileTypeOk) {
      message.error(`文件类型不支持`);
      return false;
    }
    if (!isLtMaxSize) {
      message.error(`文件不能大于${isMp4 ? videoSize : maxSize / 1024 / 1024}M`);
      return false;
    }
    canUpload = true;
    return true;
  }

  function handleRemove(file) {
    if (disabled) return;
    const { uid } = file;
    const newFileList = list.filter(f => f.uid !== uid);
    const iLen = newFileList.length;
    onChange(newFileList);
    setList(newFileList);
    setUploadDisabled(iLen >= maxCount);
  }

  function handlePreview(file) {
    const { url } = file;
    window.open(url, '_blank');
  }

  function setNewState(_list, isUpdate) {
    const uDisabled = _list.length >= maxCount;
    setList(_list);
    setUploadDisabled(uDisabled);
    if (isUpdate) {
      onChange(_list);
    }
  }

  async function handleNewList({ file: _file, status, url, uid: id }) {
    let newUploadObject = null;
    const fIndex = list.findIndex(__ => __.uid === id);
    const thumbUrl = _file.type === 'video/mp4' ? { thumbUrl: 'http://woof-admin.oss-cn-hongkong.aliyuncs.com/upload/logo/video.jpg' } : {};
    if (id && fIndex > -1) {
      const selected = list[fIndex];
      const newObject = {
        ...selected,
        status,
        url: status === 'done' ? url : selected.url,
      };
      list[fIndex] = newObject;
      const newList = [...list];
      setNewState(newList, status === 'done');
      return selected.uid;
    }
    const uid = getGuid();
    if (status === 'done') {
      newUploadObject = {
        uid, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: _file.name, // 文件名
        status, // 状态有：uploading done error removed
        linkProps: { download: url }, // 下载链接额外的 HTML 属性
        url,
        ...thumbUrl,
      };
      list.push(newUploadObject);
      const newList = [...list];
      setNewState(newList);
      return uid;
    }
    const base64 = await new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(_file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
    });
    newUploadObject = {
      uid, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
      name: _file.name, // 文件名
      status, // 状态有：uploading done error removed
      linkProps: { download: base64 }, // 下载链接额外的 HTML 属性
      url: base64,
      ...thumbUrl,
    };
    if (newUploadObject) {
      list.push(newUploadObject);
      const newList = [...list];
      setNewState(newList);
    }

    return uid;
  }

  /* eslint-disable */
  async function customRequest({ file, onSuccess, onError, onProgress }) {
    if (!canUpload) return null;
    setLoading(true);
    const uid = await handleNewList({ file, status: 'uploading' });
    const fileId = shortid.generate();
    console.log(file);
    try {
      // const { success, data } = await uploadFile(
      //   {
      //     channel: 1,
      //     file,
      //   },
      //   onProgress,
      //   timeout
      // );

      const config = await ossPolicy({ data: { channel: 1, fileName: file.name, fileType: file.type.indexOf('video') !== -1 ? 1 : 0 } });
      const basename = Base64.encode(unescape(encodeURIComponent(file.name)));
      const shortname = basename.length > 10 ? basename.substring(0, 10) : basename;

      const weburl = config.data.fileUrlPrefix + shortname + fileId;

      console.log(weburl);

      const res = await uploadFileByOSS({ file, shortname, fileId }, config.data);
      if (res.message === '') {
        handleNewList({ file, weburl, uid, url: weburl, status: 'done' });
        onSuccess(weburl);
        setLoading(false);
      }
    } catch (error) {
      console.error('upload error', error);
      await handleNewList({ file, status: 'error', uid });
      onError(error);
      setLoading(false);
    }
    return {
      abort() {
        console.log('uploader aborted');
      },
    };
  }
  /* eslint-enable */

  const listType = uploadPrize ? 'text' : 'picture-card';

  const uploadProps = {
    className: styles['upload-box'],
    listType,
    disabled: disabled || uploadDisabled || loading,
    customRequest,
    ...otherProps,
  };
  return (
    <React.Fragment>
      <div style={{ overflow: 'hidden' }}>
        <Upload {...uploadProps} beforeUpload={handleBeforeUpload} onRemove={handleRemove} onPreview={handlePreview} fileList={list} ref={ref}>
          {uploadPrize ? (
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          ) : (
            <Icon type={loading ? 'loading' : 'plus'} />
          )}
        </Upload>
      </div>

      {desc ? <div>{desc}</div> : null}
    </React.Fragment>
  );
}
// getFieldDecorator 需要ref forwardRef传递ref
export default forwardRef(UploadAction);

export const videoAndImgTypes = [...defaultImgSupportTypes, 'video/mp4'];
