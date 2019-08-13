import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Input, Button, Form, Select, Modal, message } from 'antd';
import { Config } from '@/config';
import _ from 'lodash';
import styles from './List.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';
import { noticeRes } from '../common';

const { Search } = Input;

const { Option } = Select;

@connect(({ activity, loading }) => ({
  activity,
  loading: loading.models.activity,
}))
@Form.create()
class List extends React.Component {
  state = {
    QRCodeModalVisible: false,
    QRCodeUrl: '',
  };

  static defaultProps = {
    addList: false,
  };

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const { dispatch, activity, title } = this.props;
    const { current = 1, size = 10 } = activity.data;
    const status = this.handleReceiptStatus(title);
    if (current === 1) {
      dispatch({
        type: 'activity/clearList',
      });
    }

    dispatch({
      type: 'activity/fetchList',
      payload: { current, size, status },
    });
  };

  handleSearch = (e, size = 10) => {
    const { form, dispatch, title, addList } = this.props;

    let status;
    let current;
    if (e) {
      status = addList && e.target && e.target.value;
      current = _.isNumber(e) ? e : 1;
    }

    status = this.handleReceiptStatus(title);

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'activity/fetchList',
          payload: {
            current,
            size,
            status,
            ...values,
          },
        });
      }
    });
  };

  checkMiniProgrameQRCode = async id => {
    const { dispatch } = this.props;
    const { data } = await dispatch({
      type: 'activity/getMiniProgrameQRCode',
      payload: { activityId: id, channel: ['dev', 'beta'].includes(Config.env) ? 14 : 15 },
    });
    return _.get(data, 'imgBase64Str')
      ? this.setState({ QRCodeModalVisible: true, QRCodeUrl: _.get(data, 'imgBase64Str') })
      : message.error('获取小程序二维码失败');
  };

  onLoadQRCodeError = () => {
    message.error('获取小程序二维码失败');
    this.setState({ QRCodeModalVisible: false });
  };

  handleDownLoad = () => {
    const { QRCodeUrl } = this.state;
    this.downLoad(QRCodeUrl);
  };

  downLoad = (url, name = 'QRCode') => {
    const aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
    window.URL.revokeObjectURL(url);
  };

  handleClose = () => this.setState({ QRCodeModalVisible: false });

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleOnline = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/online',
      payload: { id },
      success: this.handleRes,
    });
  };

  handleOffline = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/offline',
      payload: { id },
      success: this.handleRes,
    });
  };

  handleRes = res => {
    noticeRes(res);
    if (res.data) this.initData();
  };

  handleReceiptStatus = title => {
    let status = '';
    switch (title) {
      case '未开始':
        status = 'NOT_STARTED';
        break;
      // case '预热中':
      //   status = 'PREHEATING';
      //   break;
      case '进行中':
        status = 'PROCESSING';
        break;
      case '已结束':
        status = 'OVER';
        break;
      default:
        status = null;
    }
    return status;
  };

  render() {
    const {
      activity: { data },
      dispatch,
      loading,
      title,
      addList,
      form: { getFieldDecorator },
    } = this.props;
    const { records: list, total, pages, current } = data;
    const { QRCodeModalVisible, QRCodeUrl } = this.state;
    const pagination = {
      onChange: this.handleSearch,
      total,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };

    return (
      <PageHeaderWrapper title={title}>
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 24 }}>
            <Form.Item>
              {getFieldDecorator('keyword', {
                initialValue: '',
              })(<Search placeholder="请输入发售ID或名称" style={{ width: 168 }} allowClear />)}
            </Form.Item>
            {addList && (
              <Form.Item>
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <Select style={{ width: 168 }}>
                    <Option value="">请选择发售状态</Option>
                    <Option value="NOT_STARTED">未开始</Option>
                    {/* <Option value="PREHEATING">预热中</Option> */}
                    <Option value="PROCESSING">进行中</Option>
                    <Option value="OVER">已结束</Option>
                  </Select>
                )}
              </Form.Item>
            )}
            <Form.Item>
              <Button className={styles['btn-search']} type="primary" onClick={this.handleSearch}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleClearForm} type="default">
                清空
              </Button>
            </Form.Item>
            {addList && (
              <Button
                className={styles['btn-new']}
                type="primary"
                icon="plus"
                onClick={() =>
                  router.push({
                    pathname: '/activity/sale/all/new',
                  })
                }
              >
                新建发售
              </Button>
            )}
          </Form>
          <Table
            columns={getColumns({
              handleOnline: this.handleOnline,
              handleOffline: this.handleOffline,
              checkMiniProgrameQRCode: this.checkMiniProgrameQRCode,
            })}
            dataSource={mapDataToCols(list)}
            pagination={pagination}
            align="center"
            loading={loading}
            rowKey="id"
          />
          <Modal visible={QRCodeModalVisible} onOk={this.handleClose} onCancel={this.handleClose} footer={null}>
            <div className={styles.flexBox}>
              <img src={QRCodeUrl} alt="QRCode" onError={this.onLoadQRCodeError} />
              <Button onClick={this.handleDownLoad}>保存图片</Button>
            </div>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
