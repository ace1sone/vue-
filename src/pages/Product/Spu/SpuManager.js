import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Table, Input, Button } from 'antd';
import { autobind } from 'core-decorators';

import styles from './SpuManager.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getColumns, mapDataToCols } from './spuTable.config';

const { Search } = Input;
@connect(({ spu, loading }) => ({
  spu,
  loading: loading.models.spu,
}))
@autobind
class SpuManager extends React.Component {
  state = {};

  componentDidMount() {
    const { dispatch, spu } = this.props;
    const { current, size } = spu;
    dispatch({
      type: 'spu/fetchList',
      payload: { current, size },
    });
  }

  onSearch(spuSearchWord) {
    const { dispatch } = this.props;
    dispatch({
      type: 'spu/fetchList',
      payload: {
        spuSearchWord,
      },
    });
  }

  onSearchChange(e) {
    const spuSearchWord = e.target.value;
    const { dispatch } = this.props;
    if (!spuSearchWord) {
      dispatch({
        type: 'spu/fetchList',
        payload: {
          current: 1,
          size: 10,
          spuSearchWord,
        },
      });
    }
  }

  onPageChange(current, size) {
    const { dispatch } = this.props;
    dispatch({
      type: 'spu/fetchList',
      payload: {
        current,
        size,
      },
    });
  }

  onStatusChange = (enable, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'spu/modifySpuStatus',
      payload: {
        spuId: id,
        delFlag: enable ? 0 : 3,
      },
    });
  };

  render() {
    const { spu, dispatch, loading } = this.props;
    const { records: list, total, pages, current } = spu;
    const pagination = {
      onChange: this.onPageChange,
      total,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };

    return (
      <PageHeaderWrapper title="商品信息管理">
        <Card bordered={false}>
          <div className={styles.top}>
            <Search
              placeholder="请输入 SPU ID 或 SPU 名称"
              onSearch={this.onSearch}
              onChange={this.onSearchChange}
              style={{ width: 300 }}
              allowClear
              enterButton
            />
            <Button
              className={styles['btn-new']}
              type="primary"
              icon="plus"
              onClick={() =>
                dispatch(
                  routerRedux.push({
                    pathname: '/product/spu/new',
                  })
                )
              }
            >
              新建
            </Button>
          </div>
          <Table
            columns={getColumns({
              onStatusChange: this.onStatusChange,
            })}
            dataSource={mapDataToCols(list)}
            pagination={pagination}
            align="center"
            loading={loading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SpuManager;
