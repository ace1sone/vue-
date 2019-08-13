import React from 'react';
import { Card, Button, Form, Col, Row, Input, Avatar, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UploadAction from '@/common/UploadAction';

import styles from './Form.less';

@Form.create()
class SkuServiceForm extends React.Component {
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
        type: 'skuservice/detail',
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
      type: 'skuservice/clearDetail',
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
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      console.log('values', values);
      const { detailarr = [], iconarr = [], ...others } = values;
      const detail = typeof(detailarr)==='string' ? detailarr : detailarr.map(ele => ele.url).join();
      const icon = typeof(iconarr)==='string' ? iconarr : iconarr.map(ele => ele.url).join();
      if (!error) {
        dispatch({
          type: 'skuservice/addOrEdit',
          payload: { ...others, detail, icon },
          success: res => {
            if (res.header.code === 2000) this.goBack();
          },
        });
      }
    });
  };

  goBack = () => {
    router.goBack();
  };

  render() {
    const {
      skuservice: { detail },
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

    console.log(detail);

    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        <Card title="基础信息" className={styles.card} bordered={false}>
          <Form align="left">
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="商品服务名称">
                  {getFieldDecorator('name', {
                    initialValue: detail.name || '',
                    rules: [{ required: true, message: '商品服务名称不能为空' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="商品服务ID">
                  {getFieldDecorator('id', {
                    initialValue: detail.id || '',
                  })(<Input readOnly className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="服务图标">
                  {getFieldDecorator('iconarr', {
                    initialValue: detail.icon || [],
                    rules: [{ required: true, message: '图片不能为空' }],
                  })(<UploadAction maxCount={1} />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} />
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="服务详情">
                  {getFieldDecorator('detailarr', {
                    initialValue: detail.detail || [],
                    rules: [{ required: true, message: '图片不能为空' }],
                  })(<UploadAction maxCount={1} />)}
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

export default connect(({ skuservice, loading }) => ({
  skuservice,
  submitting: loading.effects['skuservice/addOrEdit'],
}))(SkuServiceForm);
