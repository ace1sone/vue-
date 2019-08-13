import React from 'react';
import { Affix, Card, Button, Form, Col, Row, Input, Table, Avatar, Menu, message, Checkbox } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import PrdTableForm from './PrdTableForm';

import styles from './Form.less';

@Form.create()
class PrdForm extends React.Component {
  state = {
    width: '100%',
  };

  tableform = [];

  recodesColumns = [
    {
      title: '操作人',
      dataIndex: 'createdName',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '50%',
      render: item => {
        const formatLog = item ? item.split(';') : [];
        return (
          <div>
            {formatLog.map(v=>(<p>{v}</p>))}
          </div>
        );
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updatedAt',
      width: '30%',
      render: item => <p>{moment(item).format('YYYY-MM-DD HH:mm')}</p>,
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    if (!_.isEmpty(params.id)) {
      dispatch({
        type: 'shelve/prdDetail',
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
      type: 'shelve/clearDetail',
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
      shelve: { prdDetail },
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    let hasError = false;
    validateFieldsAndScroll((error, values) => {
      this.tableform.forEach(item => {
        item.validateFields(err => {
          if (err) {
            message.error('上架可售数不能为空');
            hasError = true;
          }
        });
      });
      if (!error && !hasError) {
        const { keys, jointServiceLists = [], ...others } = values;
        others.jointServiceList = prdDetail.allServiceList
          .filter(ele => jointServiceLists.indexOf(ele.name) !== -1)
          .map(ele => ({
            spuId: values.spuId,
            skuServiceId: ele.id,
            delFlag: 0,
            skuServiceName: ele.name,
            skuServiceIcon: ele.icon,
          }));
        dispatch({
          type: 'shelve/savePrd',
          payload: others,
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

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  render() {
    const {
      shelve: { prdDetail },
      form: { getFieldDecorator, getFieldValue },
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

    // 动态生成tableform
    getFieldDecorator('keys', { initialValue: _.get(prdDetail, 'skuRespList', []) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k, i) => (
      <div key={k.id || i} style={{ background: '#f9f9f9', marginBottom: 20, padding: 10 }}>
        {getFieldDecorator(`skuRespList[${i}]`, {
          initialValue: k || {},
        })(
          <PrdTableForm
            index={i}
            ref={ele => {
              this.tableform[i] = ele;
            }}
          />
        )}
      </div>
    ));

    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        <Affix offsetTop={60}>
          <Menu mode="horizontal" selectable defaultSelectedKeys={['basicInfo']} onClick={this.handleMenuClick} style={{ marginBottom: 20 }}>
            <Menu.Item key="basicInfo">基础信息</Menu.Item>
            <Menu.Item key="prdServiceInfo">商品服务信息</Menu.Item>
            <Menu.Item key="prdInfo">商品信息</Menu.Item>
            <Menu.Item key="activeRecord">操作记录</Menu.Item>
          </Menu>
        </Affix>
        <div id="basicInfo" className={styles.card}>
          <Card title="基础信息" className={styles.card} bordered={false}>
            <Form align="left">
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="SPU ID">
                    {getFieldDecorator('spuId', {
                      initialValue: prdDetail.spuId || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="商品状态">
                    {prdDetail.sellingStatus === 1 ? '售卖中' : '已下架'}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="SPU 名称">
                    {getFieldDecorator('spuName', {
                      initialValue: prdDetail.spuName || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="系列名称（英文）">
                    {getFieldDecorator('seriesName', {
                      initialValue: prdDetail.seriesName || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="SPU 图片">
                    {prdDetail.skuImg ? (
                      <Avatar size={64} shape="square" src={prdDetail.skuImg} icon="user" style={{ border: '1px solid #ccc' }} />
                    ) : (
                      ''
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="品牌名称（英文）">
                    {getFieldDecorator('brandName', {
                      initialValue: prdDetail.brandName || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <div id="prdServiceInfo" className={styles.card}>
          <Card title="商品服务信息" bordered={false} style={{ marginBottom: 40 }}>
            {prdDetail.allServiceList &&
              getFieldDecorator('jointServiceLists', {
                initialValue: prdDetail.allServiceList.filter(ele => ele.isUsed).map(ele => ele.name) || [],
              })(<Checkbox.Group options={prdDetail.allServiceList.map(ele => ele.name)} />)}
          </Card>
        </div>
        <div id="prdInfo" className={styles.card}>
          <Card title="商品信息" bordered={false} style={{ marginBottom: 40 }}>
            {formItems}
          </Card>
        </div>
        <div id="activeRecord" className={styles.card}>
          <Card title="操作记录" bordered={false} style={{ marginBottom: 60 }}>
            <Table columns={this.recodesColumns} dataSource={prdDetail.logList || []} pagination={false} />
          </Card>
        </div>
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
export default connect(({ shelve, loading }) => ({
  shelve,
  submitting: loading.effects['shelve/savePrd'],
}))(PrdForm);
