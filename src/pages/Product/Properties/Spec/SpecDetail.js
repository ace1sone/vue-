import React from 'react';
import { Card, Button, Form, Col, Row, Input } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableDetail from './TableDetail';
import styles from './specform.less';

const fieldLabels = {
  specNo: '规格ID',
  chineseName: '规格名称（中文）',
  englishName: '规格名称（英文）',
  status: '使用状态',
  ssNum: '规格标准数量',
};

@Form.create()
class SpecDetail extends React.Component {
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
        type: 'spec/querySpecInfoByNo',
        payload: {
          req: params.id,
        },
      });
    }
    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'spec/clearDetail',
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

  goBack = () => {
    router.goBack();
  };

  render() {
    const {
      spec: { detail },
      form: { getFieldDecorator, getFieldValue },
      dispatch,
    } = this.props;
    console.log(this.props)
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

    // 动态生成tableform
    getFieldDecorator('keys', { initialValue: _.get(detail, 'specStandardDTOList', []) });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, i) => (
      <div
        key={k.specStandardNo || i}
        style={{ background: '#f9f9f9', marginBottom: 20, padding: 10, position: 'relative' }}
      >
        {getFieldDecorator(`specStandardDTOList[${i}]`, {
          initialValue: k || { ssDetailDTOList: [] },
        })(
          <TableDetail
            index={i}
            dispatch={dispatch} 
          />
        )}
      </div>
    ));

    return (
      <PageHeaderWrapper title="规格详情" wrapperClassName={styles.advancedForm}>
        <Card title="规格基本信息" className={styles.card} bordered={false}>
          <Form hideRequiredMark align="left">
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.specNo}>
                  {getFieldDecorator('specNo', {
                    initialValue: detail.id || '',
                  })(<Input readOnly placeholder="规格ID" className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.status}>
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: detail.status === 0 ? '启用' : '禁用',
                  })(<Input readOnly placeholder="状态" className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.chineseName}>
                  {getFieldDecorator('chineseName', {
                    initialValue: detail.chineseName || '',
                    rules: [{ required: true, message: '中文名不能为空' }],
                  })(
                    <Input
                      readOnly
                      placeholder="中文规格名称（必填）"
                      className={styles.nobordInput}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.englishName}>
                  {getFieldDecorator('englishName', {
                    initialValue: detail.englishName || '',
                    rules: [{ required: true, message: '英文名不能为空' }],
                  })(
                    <Input
                      readOnly
                      placeholder="中文规格名称（必填）"
                      className={styles.nobordInput}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.ssNum}>
                  {getFieldDecorator('ssNum', {
                    initialValue: detail.ssNum || 0,
                  })(<Input readOnly className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="规格标准信息" bordered={false} style={{ marginBottom: 40 }}>
          {formItems}
        </Card>
        <FooterToolbar style={{ width }}>
          <Button onClick={() => this.goBack()}>返回</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ spec }) => ({
  spec,
}))(SpecDetail);
