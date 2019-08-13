import React from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import { get } from 'lodash';
import { connect } from 'dva';
import styles from './CreateCard.less';

@connect()
class UploadImage extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    canUpload: true,
  };

  canUpload = true

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  beforeUpload = (file, fileList) => {
    const supportMediaList = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);
    const isFileTypeOk = supportMediaList.has(file.type);
    if (!isFileTypeOk) {
      message.error('只支持 JPG/JPEG PNG GIF 文件!');
    }
    const isFileSizeOk = file.size / 1024 / 1024 < 1;
    if (!isFileSizeOk) {
      message.error('图片提及不能超过1MB!');
    }
    const canUpload = isFileTypeOk && isFileSizeOk;
    this.canUpload = canUpload;
    return canUpload;
  };

  onPreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  onCancelPreview = () => this.setState({ previewVisible: false });

  customRequest = ({ onProgress, onError, onSuccess, file }) => {
    const formData = new FormData();
    formData.append('file', file);
    this.uploadFile({ channer: 1, file, onProgress })
      .then(res => onSuccess(res, file))
      .catch(onError);

    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  };

  uploadFile = async payload => {
    const { dispatch } = this.props;
    const { success, data } = await dispatch({ type: 'contentMgmt/uploadFile', payload });
    if (success) return data;
  };

  render() {
    const { previewVisible, previewImage, canUpload } = this.state;
    const { value, onChange } = this.props;
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const uploadProps = {
      name: 'uploadImage',
      accept: '.jpg,.jpeg,.gif,.png',
      listType: 'picture-card',
      className: styles.uploadComponent,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest,
      onPreview: this.onPreview,
      fileList: canUpload ? get(value, 'fileList', []) : [],
      onChange: e => onChange({...e, canUpLoad: this.canUpload}),
    };

    return (
      <React.Fragment>
        <Upload {...uploadProps}>{uploadProps.fileList.length >= 1 ? null : uploadButton}</Upload>
        <Modal centered visible={previewVisible} footer={null} onCancel={this.onCancelPreview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </React.Fragment>
    );
  }
}
export default UploadImage;
