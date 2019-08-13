import React from 'react';
import { Card, Button, Form, Col, Row, Modal } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { formItemLayout, formItemLayoutWithOutLabel } from '../Common/FormLayout';
import AwardsDialog from '../Common/AwardsDialog';

import UploadAction from '@/common/UploadAction';

@Form.create()
class TaskData extends React.Component {
  state = {
    awardsModal: false,
    disabled: false,
  };

  static getDerivedStateFromProps(nextProps, preState) {
    if (!_.isEqual(nextProps, preState) && nextProps.detail.statistics) {
      return {
        disabled: nextProps.detail.statistics.issued,
      };
    }
    return null;
  }

  handleAwards = async () => {
    const {
      form: { getFieldValue },
      detail: { id },
      dispatch,
    } = this.props;
    if (!getFieldValue('imgUrls') || getFieldValue('imgUrls').length === 0) {
      Modal.warning({
        title: '提示',
        content: '还没上传中奖名单哦！',
        onOk: this.goBack,
        okText: '确认',
        cancelText: '取消',
      });
    } else {
      const imgUrls = getFieldValue('imgUrls');
      const res = await dispatch({ type: 'task/upload', payload: { url: imgUrls[0].url, id } });
      if (res.header && res.header.code === 2000) {
        this.setState({ awardsModal: true });
      }
    }
  };

  handleExport = () => {
    const {
      dispatch,
      detail: { id },
    } = this.props;
    dispatch({ type: 'task/export', payload: { id } });
  };

  render() {
    const {
      loading,
      detail,
      form: { getFieldDecorator },
      onRefrech,
    } = this.props;
    const { statistics } = detail;
    const { awardsModal, disabled } = this.state;

    return (
      <Card title="任务数据" bordered={false}>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="当前登记总人数">
              <span className="ant-form-text">{statistics ? statistics.participantsNumber : 0}</span>
              {detail.status && detail.status !== 'WAITING' && (
                <Button type="default" onClick={this.handleExport} loading={loading}>
                  导出报表
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="上传中奖名单">
              {detail.status &&
                detail.status === 'ENDED' &&
                getFieldDecorator('imgUrls', {
                  initialValue: [],
                })(
                  <UploadAction
                    uploadPrize
                    maxCount={1}
                    supportTypes={['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                  />
                )}
              {detail.status && detail.status === 'ENDED' && <span style={{ color: ' rgba(0, 0, 0, 0.45)' }}>支持格式:.xlsx .xls</span>}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayoutWithOutLabel}>
              {detail.status && detail.status === 'ENDED' && (
                <Button type="primary" onClick={this.handleAwards} disabled={disabled}>
                  发放
                </Button>
              )}
            </Form.Item>
            <AwardsDialog visible={awardsModal} id={detail.id} onClose={() => this.setState({ awardsModal: false })} onRefrech={onRefrech} />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default connect(({ task, loading }) => ({
  task,
  loading: loading.effects['task/getValidSpus'],
}))(TaskData);
