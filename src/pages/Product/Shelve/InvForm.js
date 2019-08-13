import React from 'react';
import { Affix, Card, Button, Form, Col, Row, Input, Table, Avatar, Menu, message, Modal } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import InvTableForm from './InvTableForm';
import styles from './Form.less';

const { confirm } = Modal;

@Form.create()
class InvForm extends React.Component {
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
        type: 'shelve/invDetail',
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

  validate = (checkDangerPrice = true) => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    let hasError = false;
    validateFieldsAndScroll(async (error, values) => {
      let dangerPrice = false;
      this.tableform.forEach(item => {
        item.validateFields((err, value) => {
          if (err) {
            message.error('售价不能为空');
            hasError = true;
          }

          // check 0
          if (checkDangerPrice) {
            const sellPrice = _.toNumber(_.get(value, ['sellingPrice']));
            if (sellPrice === 0) {
              dangerPrice = true;
            }
          }
        });
      });

      if (checkDangerPrice && dangerPrice) {
        const res = await new Promise((resolve, reject) => {
          confirm({
            title: '提示',
            content: 'SKU价格为0的商品会被自动下架是否要继续保存',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              resolve(true);
            },
            onCancel() {
              reject();
            },
          });
        });

        if (!res) {
          return;
        }
      }

      if (!error && !hasError) {
        const { keys, ...others } = values;
        dispatch({
          type: 'shelve/saveInv',
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
      shelve: { invDetail },
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
    getFieldDecorator('keys', { initialValue: _.get(invDetail, 'skuRespList', []) });
    const keys = getFieldValue('keys');
    // debugger
    const formItems = keys.map((k, i) => (
      <div key={k.id || i} style={{ background: '#f9f9f9', marginBottom: 20, padding: 10 }}>
        {getFieldDecorator(`skuRespList[${i}]`, {
          initialValue: k || {},
        })(
          <InvTableForm
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
            <Menu.Item key="stockInfo">库存信息</Menu.Item>
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
                      initialValue: invDetail.spuId || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="商品状态">
                    {invDetail.sellingStatus === 1 ? '售卖中' : '已下架'}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="SPU 名称">
                    {getFieldDecorator('spuName', {
                      initialValue: invDetail.spuName || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="系列名称（英文）">
                    {getFieldDecorator('seriesName', {
                      initialValue: invDetail.seriesName || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="SPU 图片">
                    {invDetail.skuImg ? (
                      <Avatar size={64} shape="square" src={invDetail.skuImg} icon="user" style={{ border: '1px solid #ccc' }} />
                    ) : (
                      ''
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="品牌名称（英文）">
                    {getFieldDecorator('brandName', {
                      initialValue: invDetail.brandName || '',
                    })(<Input readOnly className={styles.nobordInput} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <div id="stockInfo" className={styles.card}>
          <Card title="库存信息" bordered={false} style={{ marginBottom: 40 }}>
            {formItems}
          </Card>
        </div>
        <div id="activeRecord" className={styles.card}>
          <Card title="操作记录" bordered={false} style={{ marginBottom: 40 }}>
            <Table columns={this.recodesColumns} dataSource={invDetail.logList || []} />
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
  submitting: loading.effects['shelve/saveInv'],
}))(InvForm);
