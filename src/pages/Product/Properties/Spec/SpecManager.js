import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Icon, Table, Input, Button, Modal } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './table.config';

const { Search } = Input;

class SpecManager extends React.Component {
  componentDidMount() {
    this.goToPage(1, 20);
  }

  goToPage = (page, s) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'spec/getSpecs',
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
      type: 'spec/getSpecs',
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

  handleFreeze = async item => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'spec/changeStatus',
      payload: {
        status: Number(item.status) === 0 ? 1 : 0,
        id: item.id,
      },
    });
    if (res.header.code === 4050) {
      Modal.confirm({
        icon: <Icon type="close-circle" style={{ color: '#F5222D' }} />,
        title: '警告',
        content: '该规格已关联多个SPU请在无关联的前提下进行删除操作。',
        okText: '下载关联SPU列表',
        onOk: async () => {
          await dispatch({
            type: 'spec/downloadSpu',
            payload: {
              jointId: item.id,
              type: 1,
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
      <PageHeaderWrapper title="规格管理">
        <Card bordered={false}>
          <div style={{ marginTop: 10, marginBottom: 10, display: 'flex' }}>
            <Search placeholder="请输入规格ID或规格名称" onSearch={value => this.search(value)} enterButton style={{ width: 300 }} allowClear />
            <Button
              style={{ marginLeft: 'auto' }}
              type="primary"
              icon="plus"
              onClick={() =>
                router.push({
                  pathname: '/product/properties/spec/new',
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

const mapStateToProps = ({ spec, loading }) => ({
  specdata: spec.data,
  loading: loading.models.spec,
});

export default connect(mapStateToProps)(SpecManager);
