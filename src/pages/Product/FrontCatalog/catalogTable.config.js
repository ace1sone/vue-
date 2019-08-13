import React from 'react';
import { Switch } from 'antd';
import styles from './CatalogManager.less';

// eslint-disable-next-line
export const columns = (needDisable, handleSwitchChange, handleClickDetail, catalogModifyLoadings) => [
  {
    title: '前台类目ID',
    dataIndex: 'id',
    align: 'left',
    width: '32%',
    render: (value, record) => {
      if (needDisable || record.delFlag !== 0) {
        return <span className={styles.titleDisable}>{value}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '前台类目名称',
    dataIndex: 'name',
    align: 'left',
    render: (value, record) => {
      if (needDisable || record.delFlag !== 0) {
        return <span className={styles.titleDisable}>{value}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '展示',
    dataIndex: 'delFlag',
    align: 'center',
    width: '90px',
    render: (value, record) => {
      // delFlag 0-展示 1-删除 2-不展示
      const itemChecked = value === 0;
      const loading = catalogModifyLoadings[record.id] === true;
      return (
        <div>
          <Switch
            // defaultChecked={itemChecked}
            checked={itemChecked}
            loading={loading}
            size="small"
            onClick={(checked, event) => {
              event.stopPropagation();
              handleSwitchChange(record, checked);
            }}
          />
          <a
            onClick={e => {
              e.stopPropagation();
              if (handleClickDetail) {
                handleClickDetail(record);
              }
            }}
          >
            <span style={{ marginLeft: 10 }}>详情</span>
          </a>
        </div>
      );
    },
  },
];
