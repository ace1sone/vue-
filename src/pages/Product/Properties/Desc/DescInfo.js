import React, { PureComponent } from 'react';
import { Card, Input, Button, Row, Col, Form } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import _ from 'lodash';
import TableDetail from './TableDetail';
import styles from './Desc.less';

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class DescInfo extends PureComponent {
  state = {
    width: '100%',
  };

  tableform = [];

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;

    if (id) {
      dispatch({
        type: 'desc/queryDescInfoByNo',
        payload: {
          req: id,
        },
      });
    }

    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'desc/clearDetail',
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

  dataCards = () => {
    const { data } = this.props;

    const descSubsetDTOList = _.get(data, 'descSubsetDTOList', []);
    return descSubsetDTOList.map((item, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className={styles.cardSection} key={index}>
        <TableDetail data={item} index={index} />
      </div>
    ));
  };

  render() {
    const {
      form: { getFieldDecorator },
      data,
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
        <Card title="描述基本信息" className={styles.card} bordered={false}>
          <Form align="left" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="描述ID">
                  {getFieldDecorator('id', {
                    initialValue: data.id || '',
                  })(<Input readOnly placeholder="描述ID" className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="使用状态">
                  {getFieldDecorator('status', {
                    initialValue: data.status === 0 ? '启用' : '禁用',
                  })(<Input readOnly placeholder="状态" className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="描述名称">
                  {getFieldDecorator('name', {
                    initialValue: data.name || '',
                  })(<Input readOnly placeholder="描述名称" className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="描述子集数量">
                  {getFieldDecorator('ssNum', {
                    initialValue: data.ssNum || 0,
                  })(<Input className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="描述子集" bordered={false} className={styles.card}>
          {this.dataCards()}
        </Card>
        <FooterToolbar style={{ width }}>
          <Button onClick={() => router.goBack()}>返回</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ desc, loading }) => ({
  data: desc.detail,
  submitting: loading.effects['desc/addOrEditSpec'],
}))(DescInfo);
