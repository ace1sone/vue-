import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Icon, Table, Input, Button, Modal } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './table.config';

class List extends React.Component {
  componentDidMount() {
    this.goToPage(1, 20);
  }

  goToPage = (page, s) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'skuservice/getSkuServices',
      payload: {
        size: s,
        current: page,
        pageBar: {
          pageIndex: page,
          pageSize: s,
        },
      },
    });
  };

  search = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'skuservice/getSkuServices',
      payload: {
        req: value || '',
        size: 20,
        current: 1,
        pageBar: {
          pageIndex: 1,
          pageSize: 20,
        },
      },
    });
  };

  deleteService = async id => {
    const { dispatch } = this.props;

    const checkSku = await dispatch({
      type: 'skuservice/checkSku',
      payload: { id },
    });

    if (!checkSku) {
      Modal.confirm({
        title: '已有N个SPU关联了该服务，继续删除关联SPU将不再拥有该服务，是否继续操作 ？',
        onOk: () => {
          dispatch({
            type: 'skuservice/del',
            payload: { id },
            success: res => {
              if (res.header.code === 2000) this.search();
            },
          });
        },
      });
    } else {
      dispatch({
        type: 'skuservice/del',
        payload: { id },
        success: res => {
          if (res.header.code === 2000) this.search();
        },
      });
    }
  };

  render() {
    const { servicedata } = this.props;
    const { total = 0, current = 1, size = 20 } = servicedata || {};

    return (
      <PageHeaderWrapper title="商品服务管理">
        <Card bordered={false}>
          <div style={{ marginTop: 10, marginBottom: 10, display: 'flex' }}>
            <Button
              style={{ marginLeft: 'auto' }}
              type="primary"
              icon="plus"
              onClick={() =>
                router.push({
                  pathname: '/product/skuservice/service/new',
                })
              }
            >
              新建
            </Button>
          </div>
          <Table
            pagination={{
              total: total || 0,
              current: current || 1,
              onChange: this.goToPage,
              onShowSizeChange: this.goToPage,
              pageSize: size,
            }}
            columns={columns(this.deleteService)}
            dataSource={mapDataToCols(servicedata.records || [])}
            align="center"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ skuservice, loading }) => ({
  servicedata: skuservice.data,
  loading: loading.models.skuservice,
});

export default connect(mapStateToProps)(List);
