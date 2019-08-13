import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Input, Modal, Spin } from 'antd';

import { autobind } from 'core-decorators';
import _ from 'lodash';
import styles from './CatalogManager.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CatalogTable from '@/common/CatalogTable';
import { columns } from './catalogTable.config';
import { inject } from '@/config';
import { findCatalogInDatas, levelStr, catalogNeedDisable } from './catalogUtil';

const { Search } = Input;

@autobind
class CatalogManager extends React.Component {
  storeService = inject('storeService');

  state = {
    detailModalVisible: false,
    catalogDetail: null,
    backDetailList: null,
  };

  componentDidMount() {
    this.getFrontCatalog();
  }

  getFrontCatalog(parentClassId = 0, level = 1) {
    const { dispatch } = this.props;
    dispatch({
      type: 'frontCatalog/fetchFrontCatalog',
      payload: { parentClassId, level },
    });
  }

  handleSwitchChange = (record, checked) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'frontCatalog/modifyCatalog',
      payload: {
        params: {
          id: record.id,
          delFlag: checked ? 0 : 2,
        },
        id: record.id,
        level: record.level,
      },
    });
  };

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
        pathname: '/product/frontCatalog/new',
      })
    );
  };

  handleClickDetail = async record => {
    this.setState({
      detailModalVisible: true,
      catalogDetail: record,
      backDetailList: null,
    });
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'frontCatalog/foreCatalogWithBackItemDetail',
      payload: {
        id: record.id,
      },
    });
    if (res.data) {
      this.setState({
        catalogDetail: res.data.relaionDTO,
        backDetailList: res.data.backDetailList,
      });
    }
  };

  handleRowSelected = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'frontCatalog/selectCatalog',
      payload: {
        parentClassId: record.id,
        level: record.level,
      },
    });
  };

  handleDetailCancel = e => {
    const title = e.currentTarget.innerText.replace(' ', '');
    if (title === '编辑') {
      const { dispatch } = this.props;
      const { catalogDetail } = this.state;
      dispatch(
        routerRedux.push({
          pathname: '/product/frontCatalog/new',
          query: { id: catalogDetail.id, parentId: catalogDetail.parentId, topId: catalogDetail.topId },
        })
      );
      return;
    }
    this.setState({
      detailModalVisible: false,
      catalogDetail: null,
      backDetailList: null,
    });
  };

  searchFrontCatalog(searchWord) {
    const { dispatch } = this.props;
    if (_.isEmpty(searchWord)) {
      this.getFrontCatalog();
    } else {
      dispatch({
        type: 'frontCatalog/searchFrontCatalog',
        payload: { searchWord },
      });
    }
  }

  renderCatalogTable(level) {
    const { selectedCatalogIds, catalogDatas, catalogModifyLoadings, catalogLevelLoadings, catalogUnsignedNums } = this.props;
    const levelIndex = level - 1;
    const parentLevelIndex = levelIndex - 1;
    const parentId = selectedCatalogIds[parentLevelIndex] || 0;
    const needDisable = catalogNeedDisable(catalogDatas, parentId);
    if (levelIndex === 0 || selectedCatalogIds[parentLevelIndex]) {
      return (
        <CatalogTable
          dataIndexKey="id"
          level={level}
          columns={columns(needDisable, this.handleSwitchChange, this.handleClickDetail, catalogModifyLoadings)}
          dataSource={catalogDatas[levelIndex] || []}
          onClickAddNew={this.handleClickAddNew}
          onRowSelected={this.handleRowSelected}
          selectedId={selectedCatalogIds[levelIndex] || null}
          parentId={parentId}
          loading={catalogLevelLoadings[level] || false}
          unAssignedCount={catalogUnsignedNums[levelIndex] || 0}
        />
      );
    }
    return null;
  }

  renderDetailModal() {
    const { loading } = this.props;
    const { detailModalVisible, backDetailList, catalogDetail } = this.state;
    const detail = catalogDetail || {};
    const backList = (backDetailList || []).filter(__ => __);
    const catalogDetailLoading = loading.effects['frontCatalog/foreCatalogWithBackItemDetail'];
    const isBrandByPar = backList.some(__ => __.isBrandByPar);

    const allSpecs = backList.reduce((pre, curr) => {
      const specs = [...(_.get(curr, 'parAttList.spec') || []), ...(_.get(curr, 'attList.spec') || [])];
      return pre.concat(specs.map(__ => __.name));
    }, []);
    const allDescs = backList.reduce((pre, curr) => {
      const descs = [...(_.get(curr, 'parAttList.desc') || []), ...(_.get(curr, 'attList.desc') || [])];
      return pre.concat(descs.map(__ => __.name));
    }, []);
    const allSpecNames = [...new Set(allSpecs.filter(__ => __ !== null))];
    const allDescNames = [...new Set(allDescs.filter(__ => __ !== null))];

    const attText = allSpecNames.join('/');
    const descText = allDescNames.join('/');
    // eslint-disable-next-line
    const leafText = detail.isLeaf ? '是' : detail.isLeaf === false ? '否' : '';
    return (
      <Modal title="类目基础信息" centered closable destroyOnClose visible={detailModalVisible} onCancel={this.handleDetailCancel} cancelText="编辑">
        <Spin tip="Loading..." spinning={catalogDetailLoading}>
          <div>
            <div className={styles.detailHeader}>类目信息:</div>
            <div className={styles.detailTr}>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>前台类目ID:</span>
                <span>{detail.id}</span>
              </div>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>前台类目名称:</span>
                <span>{detail.name}</span>
              </div>
            </div>
            <div className={styles.detailTr}>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>前台类目级别:</span>
                <span>{levelStr(detail.level)}</span>
              </div>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>前台类目状态:</span>
                <span>{detail.delFlag === 0 ? '展示' : '隐藏'}</span>
              </div>
            </div>
            <div className={styles.detailTr}>
              <div className={styles.detailTdHalf}>
                <span className={styles.detailTdItemKey}>叶子类目:</span>
                <span>{leafText}</span>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.detailHeader}>后台类目关联详情:</div>
            <div className={styles.backCatalogContainer}>
              {backList.map(e => (
                <div className={styles.detailBackTdHalf}>
                  <span className={styles.detailTdItemKey}>{e.id}:</span>
                  <span>{e.name}</span>
                </div>
              ))}
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
              <span>{isBrandByPar ? '是' : '否'}</span>
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

  render() {
    // const { backItemUseRate } = this.props;
    return (
      <PageHeaderWrapper title="前台类目管理">
        <Card bordered={false}>
          <div className={styles.top}>
            <Search
              placeholder="请目输入类目ID或类名称"
              onSearch={value => this.searchFrontCatalog(value)}
              enterButton="搜索"
              style={{ width: 300 }}
              allowClear
              onChange={event => {
                if (_.isEmpty(event.currentTarget.value)) {
                  this.getFrontCatalog();
                }
              }}
            />
            {/* {backItemUseRate && backItemUseRate > 0 ? (
              <div className={styles.topRight}>
                后台类目使用率:<span className={styles.useRate}>{backItemUseRate}%</span>
              </div>
            ) : null} */}
          </div>
          <div className={styles.catalogContainer}>
            {this.renderCatalogTable(1)}
            {this.renderCatalogTable(2)}
            {this.renderCatalogTable(3)}
            {this.renderCatalogTable(4)}
          </div>
        </Card>
        {this.renderDetailModal()}
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ frontCatalog, loading }) => ({
  ...frontCatalog,
  loading,
});

export default connect(mapStateToProps)(CatalogManager);
