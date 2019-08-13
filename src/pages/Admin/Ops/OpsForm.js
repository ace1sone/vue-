import React from 'react';
import { Card, Button, Form, Col, Row, Input, DatePicker, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import moment from 'moment';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UploadAction from '@/common/UploadAction';

import styles from './Form.less';

@Form.create()
class OpsForm extends React.Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    if (!_.isEmpty(params.id)) {
      dispatch({
        type: 'ops/detail',
        payload: {
          id: params.id,
        },
      });
    }
    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ops/clearDetail',
    });
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      ops: { detail },
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      const val = values;
      val.startAt = val.startAt.format('YYYY-MM-DD HH:mm:ss');
      val.endAt = val.endAt.format('YYYY-MM-DD HH:mm:ss');
      const { imgUrls = [], ...others } = values;
      const imgUrl = typeof imgUrls === 'string' ? imgUrls : imgUrls.map(ele => ele.url).join();
      if (!error) {
        if (!detail.id) {
          dispatch({
            type: 'ops/save',
            payload: { ...others, imgUrl },
            success: res => {
              if (res.header.code === 2000) this.goBack();
            },
          });
        } else {
          dispatch({
            type: 'ops/update',
            payload: { ...others, imgUrl, id: detail.id },
            success: res => {
              if (res.header.code === 2000) this.goBack();
            },
          });
        }
      }
    });
  };

  goBack = () => {
    router.goBack();
  };

  render() {
    const {
      ops: { detail },
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        <Card title="基础信息" className={styles.card} bordered={false}>
          <Form align="left">
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="开始时间">
                  {getFieldDecorator('startAt', {
                    initialValue: moment(detail.startAt) || moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    rules: [{ required: true, message: '不能为空' }],
                  })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="结束时间">
                  {getFieldDecorator('endAt', {
                    initialValue: moment(detail.endAt) || moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    rules: [{ required: true, message: '不能为空' }],
                  })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="停服维护图片">
                  {getFieldDecorator('imgUrls', {
                    initialValue: detail.imgUrl || [],
                    rules: [{ required: true, message: '图片不能为空' }],
                  })(<UploadAction maxCount={1} />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="渠道">
                  {getFieldDecorator('channel', {
                    initialValue: detail.channel || '',
                    rules: [
                      {
                        required: false,
                        message: '渠道必填的哦！',
                      },
                    ],
                  })(
                    <Select style={{ width: 168 }}>
                      <Select.Option value="">请选择</Select.Option>
                      <Select.Option value={11}>鉴定师</Select.Option>
                      <Select.Option value={15}>发售剧场</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="版本">
                  {getFieldDecorator('version', {
                    initialValue: detail.version || '',
                    rules: [{ required: false, message: '版本不能为空' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} />
            </Row>
          </Form>
        </Card>
        <FooterToolbar style={{ width }}>
          <Button onClick={() => this.goBack()}>取消</Button>
          <Button type="primary" onClick={this.validate} loading={submitting}>
            保存
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ ops, loading }) => ({
  ops,
  submitting: loading.effects['ops/save'],
}))(OpsForm);
