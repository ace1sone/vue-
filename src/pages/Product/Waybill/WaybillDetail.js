import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Form, Row, Col, Card, Button, Menu, message } from 'antd';
import { autobind } from 'core-decorators';
import { get, isEmpty } from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DetailForm from './waybillDetailForm';
import styles from './WaybillDetail.less';
import ProductInfo from './ProductInfo';
import OperateInfo from './OperateInfo';
import RepeatModal from './RepeatModal';

const Description = ({ title, detail, row }) => {
  return (
    <Col span={row ? 24 : 12}>
      <div className="description">
        <span className="title">{title}: </span>
        <span className="detail">{detail}</span>
      </div>
    </Col>
  );
};

const mb1 = { marginBottom: '16px' };
@connect(({ waybill }) => ({
  waybill,
}))
@Form.create({
  mapPropsToFields(props) {
    const detail = get(props, ['waybill', 'waybillDetail']);
    return {
      expressCompany: Form.createFormField({ value: `${get(detail, ['expressCompany']) ? get(detail, ['expressCompany']) : '1'}` }),
      expressNumber: Form.createFormField({ value: get(detail, ['expressNumber']) }),
      paymentMethod: Form.createFormField({ value: '2' }),
    };
  },
})
@autobind
class WaybillDetail extends React.Component {
  state = {
    repeat: [],
    visibleModal: false,
  };

  componentDidMount() {
    const { id } = get(this.props, 'location.query');
    return id ? this.loadData(id) : this.gotoWaybillList();
  }

  getExpressCompanies() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waybill/getExpressCompanies',
    });
  }

  getWaybillDetail(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'waybill/getWaybillDetail',
      payload: { id, extraField: 'reverse' },
    });
  }

  gotoWaybillList = () => router.push('/order/b2cOrder/waybills');

  getWaybillLogs = opt => {
    const { dispatch } = this.props;
    dispatch({ type: 'waybill/getWaybillLogs', payload: opt });
  };

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    if (targetDiv) targetDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  setD = (key, direct) => e => this.setState({ [key]: direct ? e : e.target.value });

  handleCancel = () => this.setState({ visibleModal: false });

  handleOk = e =>
    get(this.props, ['waybill', 'waybillDetail', 'shippingStatus']) === 1 ? this.handleShip(e, 'ship', false) : this.handleShip(e, 'update', false);

  async handleShip(e, type, check = true) {
    e.preventDefault();
    const { form, dispatch, history } = this.props;
    form.validateFields(async (err, values) => {
      if (err) return message.error(`${type === 'update' ? '更新运单' : '发货'}错误, 请检查并重试`);
      const waybill = get(this.props, ['waybill', 'waybillDetail']);

      if (check) {
        const repeat = await dispatch({ type: 'waybill/checkRepeat', payload: { expressNumber: [values.expressNumber] } });
        if (repeat && get(repeat, 'data.length') > 0) return this.setState({ repeat: repeat.data, visibleModal: true });
      }

      const payload =
        type === 'update'
          ? { ...values, id: get(waybill, ['id']), fee: get(waybill, ['fee']), remark: isEmpty(values.remark) ? '' : values.remark }
          : { ...values, id: get(waybill, ['id']), fee: values.paymentMethod === '2' ? get(waybill, ['fee']) : values.fee };
      const res =
        type === 'update' ? await dispatch({ type: 'waybill/updateWaybill', payload }) : await dispatch({ type: 'waybill/shipping', payload });
      if (res.success) return history.go(0);
    });
  }

  async loadData(id) {
    this.getWaybillDetail(id);
    this.getExpressCompanies();
    this.getWaybillLogs({ waybillId: id, page: 1, size: 10 });
  }

  render() {
    const waybill = get(this.props, ['waybill', 'waybillDetail']);
    const order = get(this.props, ['waybill', 'orderDetail']);
    const gw = (key, ifnone = '') => get(waybill, key, ifnone);
    const go = (key, ifnone = '') => get(order, key, ifnone);
    const status = (() => {
      if (get(waybill, 'shippingStatus') === 7) return 'reverseWithClose';
      if (!isEmpty(get(order, 'reverseStatus'))) return 'reverse';
      if (get(waybill, 'shippingStatus') === 1) return 'shipping';
      return 'editing';
    })();
    const { repeat, visibleModal } = this.state;
    const { form } = this.props;

    const CurrentState = form.getFieldsValue();
    const formatCurrent = { ...waybill, orderDetail: order.goods, orderAddress: order.address, ...CurrentState };

    return (
      <PageHeaderWrapper title="单件发货">
        <Menu mode="horizontal" selectable defaultSelectedKeys={['sendInfo']} onClick={this.handleMenuClick} style={mb1}>
          <Menu.Item key="sendInfo">发货信息</Menu.Item>
          <Menu.Item key="productInfo">商品信息</Menu.Item>
          <Menu.Item key="receiveInfo">收货信息</Menu.Item>
          <Menu.Item key="operatorInfo">操作记录</Menu.Item>
        </Menu>

        <Card title="发货信息" id="sendInfo" className={styles.sendInfo} bordered={false} style={mb1}>
          <Row>
            <Description title="运单号" detail={gw('code')} />
            <Description title="运单状态" detail={gw('shippingStatusName')} />
          </Row>
          <Row>
            <Description title="订单号" detail={gw('orderId')} />
            <Description title="创建时间" detail={gw('createTime')} />
          </Row>
          <Row>
            <Description title="买家id" detail={go('userId')} />
            <Description title="发货时间" detail={gw('shippingTime')} />
          </Row>
          <Row>
            <Description title="买家留言" detail={go('remark')} row />
          </Row>
          {(status === 'shipping' || status === 'editing') && <DetailForm {...this.props} status={status} />}
          {status === 'reverse' && (
            <React.Fragment>
              <Row>
                <Description title="快递公司" detail={gw('expressCompanyName')} />
                <Description title="快递单号" detail={gw('expressNumber')} />
              </Row>
              <Row>
                <Description title="结算方式" detail={gw('paymentMethodName')} />
                <Description title="运费（元）" detail={gw('fee')} />
              </Row>
              <Row>
                <Description title="操作备注" detail={go('remark')} row />
              </Row>
            </React.Fragment>
          )}
          {status === 'reverseWithClose' && (
            <React.Fragment>
              <Row>
                <Description title="快递公司" detail={gw('expressCompanyName')} />
                <Description title="快递单号" detail={gw('expressNumber')} />
              </Row>
              {gw('expressNumber') && (
                <Row>
                  <Description title="结算方式" detail={gw('paymentMethodName')} />
                  <Description title="运费（元）" detail={gw('fee')} />
                </Row>
              )}
              <Row>
                <Description title="操作备注" detail={' '} row />
              </Row>
            </React.Fragment>
          )}
        </Card>

        <Card title="商品信息" id="productInfo" bordered={false} style={mb1}>
          {go('goods') && <ProductInfo data={go('goods')} />}
        </Card>

        <Card title="买家收货信息" id="receiveInfo" bordered={false} style={mb1} className={styles.sendInfo}>
          <Row>
            <Description title="省/市/区" detail={`${go('address.province', '  ')}/${go('address.city', '  ')}/${go('address.county', '  ')}`} />
            <Description title="详细地址" detail={go('address.address')} />
          </Row>
          <Row>
            <Description title="收货人" detail={gw('consignee')} />
            <Description title="联系方式" detail={go('address.phone')} />
          </Row>
        </Card>

        <Card title="操作记录" id="operatorInfo" bordered={false} style={mb1}>
          <OperateInfo {...this.props} />
        </Card>
        <div className={styles.footer}>
          <Button onClick={this.gotoWaybillList}>返回</Button>
          {status === 'shipping' && (
            <Button className={styles.submitButton} onClick={e => this.handleShip(e, 'ship', true)}>
              发货
            </Button>
          )}
          {status === 'editing' && (
            <Button className={styles.submitButton} onClick={e => this.handleShip(e, 'update', true)}>
              更新
            </Button>
          )}
        </div>
        <RepeatModal current={formatCurrent} data={repeat} visible={visibleModal} handleOk={this.handleOk} handleCancel={this.handleCancel} />
      </PageHeaderWrapper>
    );
  }
}

export default WaybillDetail;
