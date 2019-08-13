import React from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Button, Row, Col, Select, DatePicker } from 'antd';
import { autobind } from 'core-decorators';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { get, isEmpty } from 'lodash';
import router from 'umi/router';
import { tableColumns, mapDataToCols } from './waybill.config';
import styles from './WaybillManager.less';

const dateFormat = 'YYYY/MM/DD';
const { RangePicker } = DatePicker;
const { Option } = Select;
const initialState = {
  orderCode: '',
  shippingStatus: '0',
  timeType: 'orderTime',
  timeRange: [],
  expressNumber: '',
  page: 1,
  size: 10, 
  extraField: "reverse"
};
@connect(({ waybill, loading }) => ({
  waybill,
  loading
}))
@autobind
class waybillManager extends React.Component {

  state = initialState;

  componentDidMount() {
    this.getShippingStatus();
    this.getWaybills();
  }

  onPageChange(current, size) {
    const { dispatch } = this.props;
    const opt = this.searchConditions();
    dispatch({
      type: 'waybill/getWaybills',
      payload: {
        page: current,
        size,
        ...opt,
        extraField: get(this.state, ['extraField'])
      }
    });
  }

  onSearch() {
    const opt = this.searchConditions();
    this.getWaybills(opt);
  }

  onSearchClear = () => this.setState(initialState, () => this.getWaybills())

  getShippingStatus() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waybill/getShippingStatus',
      payload: {}
    });
  }

  getWaybills(opt) {
    const { dispatch } = this.props;
    const { page, size } = this.state;
    dispatch({
      type: 'waybill/getWaybills',
      payload: { page, size, ...opt, extraField: get(this.state, ['extraField']) }
    });
  }

  async getExpressReport() {
    const { dispatch } = this.props;
    const opt = this.searchConditions();
    const res = await dispatch({ type: 'waybill/getExpressReport', payload: { ...opt } });
    this.downLoad(res);
  }

  async getShippingReport() {
    const { dispatch } = this.props;
    const opt = this.searchConditions();
    const res = await dispatch({ type: 'waybill/getShippingReport', payload: opt });
    this.downLoad(res);
  }

  setD = (key, direct) => e => this.setState({ [key]: direct ? e : e.target.value });

  downLoad = (response, name = "report.xlsx") => {
    const source = new Blob([get(response, 'data')])
    const url = window.URL.createObjectURL(source);
    const aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = url;
    aLink.setAttribute("download", name);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
    window.URL.revokeObjectURL(url);
  }

  toBulk = () => router.push('/order/b2cOrder/waybills/bulk');

  searchConditions() {
    const { orderCode, shippingStatus, timeType, timeRange, expressNumber } = this.state;
    const time = get(timeRange, 'length') === 2 && (timeType === 'orderTime'
      ? { "orderTimeStart": timeRange[0].format('YYYY-MM-DD 00:00:00'), "orderTimeEnd": timeRange[1].format('YYYY-MM-DD 00:00:00') }
      : { "shippingTimeStart": timeRange[0].format('YYYY-MM-DD 00:00:00'), "shippingTimeEnd": timeRange[1].format('YYYY-MM-DD 00:00:00') })
    const status = shippingStatus === '0' ? undefined : { shippingStatus };
    const opt = { orderCode, ...status, expressNumber, ...time };
    Object.entries(opt).map(v => isEmpty(v[1]) && Reflect.deleteProperty(opt, v[0]));
    return opt
  }

  render() {
    const { orderCode, shippingStatus, timeType, timeRange, expressNumber } = this.state;
    const { waybill } = this.props;
    const { records, total, current } = get(waybill, 'list');
    const shippingList = get(waybill, 'shippingStatus');
    const pagination = {
      onChange: this.onPageChange,
      total,
      current
    };
    const shippingStatusList = shippingList && Object.entries(shippingList).map(v => <Option value={v[0]} key={v[0]}>{v[1]}</Option>);
    const loading = !!get(this.props, ['loading', 'models', 'waybill']);

    return (
      <PageHeaderWrapper title="全部运单">
        <Card bordered={false}>

          <Row type="flex" justify="start" className={styles.mb1}>
            <Col span={6}>
              <Input
                placeholder="请输入订单号"
                style={{ width: 240 }}
                value={orderCode}
                onChange={this.setD('orderCode')}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Select
                style={{ width: 240 }}
                placeholder="发货状态"
                value={shippingStatus}
                onChange={this.setD('shippingStatus', true)}
              >
                <Option value="0">全部</Option>
                {shippingStatusList}
              </Select>
            </Col>
            <Col span={12} className={styles.noneBorder}>
              <Select value={timeType} onChange={this.setD('timeType', true)}>
                <Option value="orderTime">下单时间</Option>
                <Option value="shippingTime">发货时间</Option>
              </Select>
              <RangePicker value={timeRange} format={dateFormat} placeholder={['开始时间', '结束时间']} onChange={this.setD('timeRange', true)} />
            </Col>
          </Row>

          <Row className={styles.mb1}>
            <Col span={6}>
              <Input
                placeholder="请输入快递单号"
                style={{ width: 240 }}
                value={expressNumber}
                onChange={this.setD('expressNumber')}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Button onClick={this.onSearch} className={styles.buttonI}>搜索</Button>
              <Button onClick={this.onSearchClear}>清空</Button>
            </Col>
            <Col span={12}>
              <Button className={styles.button} onClick={this.getShippingReport}>导出发货报表</Button>
              <Button className={styles.button} onClick={this.getExpressReport}>导出顺丰报表</Button>
              <Button className={styles.button}>批量导出发货</Button>
              <Button className={styles.buttonI} onClick={this.toBulk}>批量发货</Button>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Table
                className={styles.waybillTable}
                columns={tableColumns}
                dataSource={mapDataToCols(records)}
                pagination={pagination}
                align="center"
                loading={loading}
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default waybillManager;
