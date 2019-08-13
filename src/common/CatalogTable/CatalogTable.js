import React from 'react';
import { Table, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './CatalogTable.less';

class CatalogTable extends React.PureComponent {
  state = {
    innerSelectedId: null,
  };

  static getDerivedStateFromProps(props, state) {
    const { selectedId } = props;
    const { innerSelectedId } = state;
    if (selectedId !== undefined && selectedId !== innerSelectedId) {
      return {
        innerSelectedId: selectedId,
      };
    }
    return null;
  }

  componentDidMount() {
    const { selectedId } = this.props;
    this.setState({
      innerSelectedId: selectedId,
    });
  }

  getCatalogTitle() {
    const { level } = this.props;
    switch (level) {
      case 1:
        return '一级类目';
      case 2:
        return '二级类目';
      case 3:
        return '三级类目';
      default:
        return '四级类目';
    }
  }

  getTableStyle = () => {
    const { level } = this.props;
    switch (level) {
      case 1:
        return styles.catalog;
      default:
        return styles.catalogBehind;
    }
  };

  getRowClassName = record => {
    const { innerSelectedId } = this.state;
    const { dataIndexKey } = this.props;
    if (dataIndexKey && record[dataIndexKey] === innerSelectedId) {
      return styles.rowSelected;
    }
    return '';
  };

  handleOnRow = (record, index) => ({
    onClick: () => {
      const { dataIndexKey } = this.props;
      if (dataIndexKey) {
        this.setState({
          innerSelectedId: record[dataIndexKey],
        });
      }
      const { onRowSelected } = this.props;
      if (onRowSelected) {
        onRowSelected(record, index);
      }
    },
  });

  handleClickAddNew = () => {
    const { onClickAddNew, parentId, level } = this.props;
    if (onClickAddNew) {
      onClickAddNew(parentId, level);
    }
  };

  renderHeader() {
    const { hasAddNew, unAssignedCount, canUseAddNew } = this.props;
    return (
      <div className={hasAddNew ? styles.catalogGroupHeaderNew : styles.catalogGroupHeader}>
        <div className={hasAddNew ? styles.catalogHeaderLeftNew : styles.catalogHeaderLeft}>
          <span className={styles.catalogHeaderTitle}>{this.getCatalogTitle()}</span>
          {unAssignedCount > 0 ? <span className={styles.catalogUnAssignHeader}>还有{unAssignedCount}个类目未分配</span> : null}
        </div>
        <div className={styles.catalogHeaderRight}>
          {hasAddNew ? (
            <Button className={styles['btn-new']} type="primary" size="small" disabled={!canUseAddNew} onClick={this.handleClickAddNew}>
              新增类目
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    const { dataSource, columns, loading } = this.props;
    return (
      <div className={this.getTableStyle()}>
        {this.renderHeader()}
        <Table
          className={styles.catalogTable}
          dataSource={dataSource}
          rowKey="id"
          columns={columns}
          rowClassName={this.getRowClassName}
          onRow={this.handleOnRow}
          bordered={false}
          pagination={false}
          size="small"
          scroll={{ y: true }}
          loading={loading}
        />
      </div>
    );
  }
}

CatalogTable.propTypes = {
  columns: PropTypes.array,
  dataIndexKey: PropTypes.string.isRequired,
  dataSource: PropTypes.array,
  hasAddNew: PropTypes.bool,
  canUseAddNew: PropTypes.bool,
  level: PropTypes.number,
  loading: PropTypes.bool,
  onClickAddNew: PropTypes.func,
  onRowSelected: PropTypes.func,
  parentId: PropTypes.any,
  selectedId: PropTypes.any,
  unAssignedCount: PropTypes.number,
};

CatalogTable.defaultProps = {
  level: 1,
  loading: false,
  selectedId: undefined,
  hasAddNew: true,
  canUseAddNew: true,
  dataSource: [],
  columns: [],
  onRowSelected: null,
  onClickAddNew: null,
  parentId: null,
  unAssignedCount: 0,
};

export default CatalogTable;
