import React from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Tabs } from 'antd';
import _ from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './listTable.config';
import SaleDialog from './SaleDialog';

const { TabPane } = Tabs;

@connect(({ homemgmt, loading }) => ({
  homemgmt,
  loading: loading.models.homemgmt,
}))
@Form.create()
class List extends React.Component {
  state = {};

  componentWillMount() {
    this.loadSales(undefined, 15);
  }

  loadSales = (current = 1, channel) => {
    const { dispatch } = this.props;
    const params = {
      current,
      size: 10,
      channel: _.toNumber(channel),
    };
    dispatch({
      type: 'homemgmt/saleTabs',
      payload: params,
    });
  };

  handleChangeTabs = v => {
    this.loadSales(undefined, v);
  };

  // handleConfigTime = id => {
  //   console.log(id);
  // };

  render() {
    const {
      homemgmt: { sales },
      loading,
    } = this.props;
    const { records, total, pages, current } = sales;
    const pagination = {
      onChange: this.loadSales,
      total,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };
    const tab = [{ name: 'WOOF APP', key: '50' }, { name: 'WOOF 小程序', key: '15' }];

    return (
      <PageHeaderWrapper title="发售Tab栏">
        <Tabs defaultActiveKey="15" onTabClick={v => this.handleChangeTabs(v)}>
          {tab.map(eve => (
            <TabPane tab={eve.name} key={eve.key}>
              <Card bordered={false}>
                <Form layout="inline" style={{ marginBottom: 24 }}>
                  <SaleDialog recoData={records} />
                </Form>

                <Table
                  columns={getColumns(this.handleConfigTime)}
                  dataSource={mapDataToCols(records)}
                  pagination={pagination}
                  align="center"
                  loading={loading}
                  rowKey="key"
                />
              </Card>
            </TabPane>
          ))}
        </Tabs>
      </PageHeaderWrapper>
    );
  }
}

export default List;
