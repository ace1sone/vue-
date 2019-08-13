import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import { Card, Input, Modal, Spin, Table } from 'antd';
import { autobind } from 'core-decorators';

import styles from './CatalogManager.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CatalogTable from '@/common/CatalogTable';
import { columns } from './catalogTable.config';
import { inject } from '@/config';
import { findCatalogInDatas, levelStr, getAttributeStr, catalogNeedDisable, canAddNewCatalog } from './catalogUtil';

const { Search } = Input;

@autobind
class CatalogManager extends React.Component {
  storeService = inject('storeService');

  state = {
    detailModalVisible: false,
    catalogDetail: null,
    parentSpuModalVisible: false,
    catalogParentSpuList: null,
  };

  spuSelectedList = [];

  componentDidMount() {
    this.getCatalogs();
  }

  getCatalogs(id = 0, level = 1) {
    const { dispatch } = this.props;
    dispatch({
      type: 'backCatalog/fetchBackCatalog',
      payload: { id, level },
    });
  }

  handleClickAddNew = (parentClassId, level) => {
    const { dispatch, catalogDatas, selectedCatalogIds } = this.props;
    let parentCatalog = null;
    if (level !== 1) {
      parentCatalog = findCatalogInDatas(catalogDatas, parentClassId, level - 1);
      if (!parentCatalog) return;
    }
    this.storeService.storeTemp('fcn_parentCatalog', parentCatalog);
    const topClassId = level === 1 ? '0' : selectedCatalogIds[0];
    this.storeService.storeTemp('fcn_topClassId', topClassId);
    dispatch(
      routerRedux.push({
        pathname: '/product/backCatalog/new',
      })
    );
  };

  handleRowSelected = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'backCatalog/selectCatalog',
      payload: {
        id: record.id,
        level: record.level,
      },
    });
  };

  handStatusChange = async (record, enable) => {
    const { dispatch } = this.props;
    if (enable) {
      // 可直接启用
      this.doStatusChange(record, enable);
      return;
    }
    // 判断是否关联前台类目
    const res = await dispatch({
      type: 'backCatalog/checkForeByClassId',
      payload: {
        id: record.id,
      },
    });
    if (res.data.status === false) {
      Modal.confirm({
        title: '警告',
        content: `[${
          record.name
        }] 该类目已被前台类目调用，若继续禁用,该类目的子类目操作装备保持原状变为不可操作状态,前台类目关联的该类目及其子类目变为不可展示且不可操作状态。`,
        okText: '禁用',
        okType: 'danger',
        cancelText: '取消',
        icon: 'close-circle',
        onOk: () => {
          this.doStatusChange(record, enable);
        },
      });
    } else {
      this.doStatusChange(record, enable);
    }
  };

  doStatusChange = (record, enable) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'backCatalog/changeStatus',
      payload: {
        params: {
          id: record.id,
          status: enable ? 0 : 1,
        },
        id: record.id,
        level: record.level,
      },
    });
  };

  handleClickDetail = async record => {
    this.setState({
      detailModalVisible: true,
      catalogDetail: record,
    });
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'backCatalog/backCatalogDetail',
      payload: {
        id: record.id,
      },
    });
    this.setState({
      catalogDetail: res.data,
    });
  };

  handleDetailOk = async () => {
    // 清理spuSelectedList
    this.spuSelectedList = [];
    this.setState({
      detailModalVisible: false,
      parentSpuModalVisible: true,
      catalogParentSpuList: null,
    });
    const { dispatch } = this.props;
    const { catalogDetail } = this.state;
    const res = await dispatch({
      type: 'backCatalog/catalogParentSpuList',
      payload: {
        id: catalogDetail.parentClassId,
      },
    });
    this.setState({
      catalogParentSpuList: res.data,
    });
  };

  handleDetailCancel = e => {
    const title = e.currentTarget.innerText.replace(' ', '');
    if (title === '编辑') {
      const { dispatch } = this.props;
      const { catalogDetail } = this.state;
      dispatch(
        routerRedux.push({
          pathname: '/product/backCatalog/new',
          query: { id: catalogDetail.id },
        })
      );
      return;
    }
    this.setState({
      detailModalVisible: false,
      catalogDetail: null,
    });
  };

  handleParentSpuCancel = () => {
    this.dismissSpuModal();
  };

  handleParentSpuOk = async () => {
    if (_.isEmpty(this.spuSelectedList)) {
      this.dismissSpuModal();
      return;
    }
    const { dispatch } = this.props;
    const { catalogDetail } = this.state;
    const spuNoList = this.spuSelectedList.map(item => item.id);
    const res = await dispatch({
      type: 'backCatalog/modifySpuNewBackItem',
      payload: {
        params: {
          oldBackItemId: catalogDetail.parentClassId,
          newChildBackItemId: catalogDetail.id,
          spuNoList,
        },
      },
    });
    if (res.data) {
      this.dismissSpuModal();
    }
  };

  dismissSpuModal() {
    this.spuSelectedList = [];
    this.setState({
      parentSpuModalVisible: false,
    });
  }

  searchCatalog(searchWord) {
    const { dispatch } = this.props;
    if (_.isEmpty(searchWord)) {
      this.getCatalogs();
    } else {
      dispatch({
        type: 'backCatalog/searchCatalog',
        payload: { searchWord },
      });
    }
  }

  renderCatalogTable(level) {
    const { selectedCatalogIds, catalogDatas, catalogModifyLoadings, catalogLevelLoadings } = this.props;
    const levelIndex = level - 1;
    const parentLevelIndex = levelIndex - 1;
    const parentId = selectedCatalogIds[parentLevelIndex] || 0;
    const needDisable = catalogNeedDisable(catalogDatas, parentId);
    if (levelIndex === 0 || selectedCatalogIds[parentLevelIndex]) {
      return (
        <CatalogTable
          dataIndexKey="id"
          level={level}
          columns={columns(needDisable, this.handStatusChange, this.handleClickDetail, catalogModifyLoadings)}
          dataSource={catalogDatas[levelIndex] || []}
          onClickAddNew={this.handleClickAddNew}
          onRowSelected={this.handleRowSelected}
          selectedId={selectedCatalogIds[levelIndex] || null}
          parentId={parentId}
          loading={catalogLevelLoadings[level] || false}
          canUseAddNew={canAddNewCatalog(catalogDatas, selectedCatalogIds, level)}
        />
      );
    }
    return null;
  }

  renderDetailModal() {
    const { detailModalVisible, catalogDetail } = this.state;
    const detail = catalogDetail || {};

    const attSpec = detail.attList ? detail.attList.spec : [];
    const parAttSpec = detail.parAttList ? detail.parAttList.spec : [];
    const attText = getAttributeStr(attSpec, parAttSpec);

    const attDesc = detail.attList ? detail.attList.desc : [];
    const parAttDesc = detail.parAttList ? detail.parAttList.desc : [];
    const descText = getAttributeStr(attDesc, parAttDesc);

    const okButtonDisable = detail.isParSpu !== 1;
    const { catalogDetailLoading } = this.props;
    // eslint-disable-next-line
    const statusText = detail.status === 2 ? '冻结' : detail.status === 0 ? '启用' : '禁用';
    return (
      <Modal
        title="类目基础信息"
        centered
        closable
        destroyOnClose
        visible={detailModalVisible}
        onOk={this.handleDetailOk}
        onCancel={this.handleDetailCancel}
        okText="继承父SPU"
        okButtonProps={{ disabled: okButtonDisable }}
        cancelText="编辑"
      >
        <Spin tip="Loading..." spinning={catalogDetailLoading}>
          <div>
            <div className={styles.detailHeader}>类目基础信息:</div>
            <div className={styles.detailTr}>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>后台类目ID:</span>
                <span>{detail.id}</span>
              </div>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>后台类目名称:</span>
                <span>{detail.name}</span>
              </div>
            </div>
            <div className={styles.detailTr}>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>后台类目级别:</span>
                <span>{levelStr(detail.level)}</span>
              </div>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>后台类目状态:</span>
                <span>{statusText}</span>
              </div>
            </div>
            <div className={styles.detailTr}>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>叶子类目:</span>
                <span>{detail.isEnd === 0 ? '是' : '否'}</span>
              </div>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>已关联SPU数:</span>
                <span>{detail.spuNum || 0}</span>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.detailHeader}>类目关联规格:</div>
            <div className={styles.detailTr}>
              <span className={styles.detailTdItemKey}>规格:</span>
              <span>{attText}</span>
            </div>
          </div>

          <div>
            <div className={styles.detailHeader}>类目关联品牌:</div>
            <div className={styles.detailTr}>
              <span className={styles.detailTdItemKey}>是否关联品牌:</span>
              <span>{detail.isBrandByPar ? '是' : '否'}</span>
            </div>
          </div>

          <div>
            <div className={styles.detailHeader}>类目关联描述:</div>
            <div className={styles.detailTr}>
              <span className={styles.detailTdItemKey}>描述:</span>
              <span>{descText}</span>
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }

  renderParentSPUModal() {
    const { parentSpuModalVisible, catalogParentSpuList } = this.state;
    const { spuListLoading, spuModifyLoading } = this.props;
    const spuListColumns = [
      {
        title: '序号',
        width: 88,
        render: (value, record, index) => <sapn>{index + 1}</sapn>,
      },
      {
        title: '商品图片',
        align: 'center',
        width: 90,
        dataIndex: 'coverUrl',
        render: value => (value ? <img style={{ height: 40 }} src={value} alt="spu" /> : null),
      },
      {
        title: 'SPU 英文名 (官方)',
        dataIndex: 'spuEnglishName',
      },
      {
        title: 'SPU ID',
        dataIndex: 'id',
        width: 130,
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.spuSelectedList = selectedRows;
      },
    };
    return (
      <Modal
        title="继承父类SPU"
        centered
        closable
        destroyOnClose
        width={816}
        bordered
        dataIndexKey="spuNo"
        visible={parentSpuModalVisible}
        onCancel={this.handleParentSpuCancel}
        onOk={this.handleParentSpuOk}
        okText="确定"
        confirmLoading={spuModifyLoading}
      >
        <Table
          // style={{ height: 518 }}
          loading={spuListLoading}
          columns={spuListColumns}
          dataSource={catalogParentSpuList}
          pagination={false}
          bordered={false}
          rowSelection={rowSelection}
          size="default"
          scroll={{ y: 430 }}
        />
      </Modal>
    );
  }

  render() {
    return (
      <PageHeaderWrapper title="后台类目管理">
        <Card bordered={false}>
          <div className={styles.top}>
            <Search
              placeholder="请目输入类目ID或类名称"
              onSearch={value => this.searchCatalog(value)}
              enterButton="搜索"
              style={{ width: 300 }}
              allowClear
              onChange={event => {
                if (_.isEmpty(event.currentTarget.value)) {
                  this.getCatalogs();
                }
              }}
            />
          </div>
          <div className={styles.catalogContainer}>
            {this.renderCatalogTable(1)}
            {this.renderCatalogTable(2)}
            {this.renderCatalogTable(3)}
            {this.renderCatalogTable(4)}
          </div>
        </Card>
        {this.renderDetailModal()}
        {this.renderParentSPUModal()}
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ backCatalog, loading }) => {
  const catalogDetailLoading = loading.effects['backCatalog/backCatalogDetail'];
  const spuListLoading = loading.effects['backCatalog/catalogParentSpuList'];
  const spuModifyLoading = loading.effects['backCatalog/modifySpuNewBackItem'];
  return {
    ...backCatalog,
    loading,
    catalogDetailLoading,
    spuListLoading,
    spuModifyLoading,
  };
};

export default connect(mapStateToProps)(CatalogManager);
