import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Icon, Card, Table, Input, Button, Modal } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './table.config';

import styles from './BrandManager.less';

const { Search } = Input;

class BrandManager extends React.Component {
  componentDidMount() {
    this.goToPage(1, 20);
  }

  goToPage = (page, s) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'brand/getBrands',
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
      type: 'brand/getBrands',
      payload: {
        searchWord: value || '',
        size: 20,
        current: 1,
        pageBar: {
          pageIndex: 1,
          pageSize: 20,
        },
      },
    });
  };

  handleFreeze = async item => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'brand/brandModify',
      payload: {
        proBrandDTO: { id: item.id, delFlag: Number(item.delFlag) === 0 ? 3 : 0, isModifyName: false },
      },
    });
    if (res.header.code === 4050) {
      Modal.confirm({
        icon: <Icon type="close-circle" style={{ color: '#F5222D' }} />,
        title: '警告',
        content: '该品牌已关联多个SPU请在无关联的前提下进行删除操作。',
        okText: '下载关联SPU列表',
        cancelText: '知道了',
        onOk: async () => {
          await dispatch({
            type: 'brand/brandSpuDownload',
            payload: {
              jointId: item.id,
              type: 3,
            },
          });
        },
      });
      return;
    }
    if (res.header.code !== 2000) return;
    this.search();
  };

  render() {
    const { specdata, loading } = this.props;
    const { total = 0, current = 1, size = 20 } = specdata || {};

    return (
      <PageHeaderWrapper title="品牌管理">
        <Card bordered={false}>
          <div style={{ marginTop: 10, marginBottom: 10, display: 'flex' }}>
            <Search placeholder="请输入品牌ID或品牌名称" onSearch={value => this.search(value)} enterButton style={{ width: 300 }} allowClear />
            <Button
              style={{ marginLeft: 'auto' }}
              type="primary"
              icon="plus"
              onClick={() =>
                router.push({
                  pathname: '/product/properties/brand/new',
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
            className={styles.brandsTable}
            columns={columns(this.handleFreeze)}
            dataSource={mapDataToCols(specdata.records || [])}
            align="center"
            loading={loading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ brand, loading }) => ({
  specdata: brand.data,
  loading: loading.models.brand,
}))(BrandManager);
