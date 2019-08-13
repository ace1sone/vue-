import React from 'react';
import { Divider } from 'antd';
import StatusToggle from '@/components/StatusToggle';
import styles from './CatalogManager.less';

// eslint-disable-next-line
export const columns = (needDisable, handStatusChange, handleClickDetail, catalogModifyLoadings) => [
  {
    title: '后台类目ID',
    dataIndex: 'id',
    align: 'left',
    width: '32%',
    render: (value, record) => {
      if (needDisable || record.status !== 0) {
        return <span className={styles.titleDisable}>{value}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '后台类目名称',
    dataIndex: 'name',
    align: 'left',
    render: (value, record) => {
      if (needDisable || record.status !== 0) {
        return <span className={styles.titleDisable}>{value}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '操作',
    dataIndex: 'status',
    align: 'center',
    width: '90px',
    render: (value, record) => {
      // status 0-启用 1-禁用 2-冻结
      if (value === 2) {
        return (
          <div>
            <span className={styles.titleDisable}>冻结</span>
            <Divider type="vertical" />
            <a
              onClick={e => {
                e.stopPropagation();
                if (handleClickDetail) {
                  handleClickDetail(record);
                }
              }}
            >
              <span>详情</span>
            </a>
          </div>
        );
      }
      const linkEnabled = value === 0;
      return (
        <div>
          <StatusToggle
            enabled={linkEnabled}
            onClick={(enabled, e) => {
              e.stopPropagation();
              const loading = catalogModifyLoadings[record.id] === true;
              if (!loading && handStatusChange) {
                handStatusChange(record, enabled);
              }
            }}
          />
          <Divider type="vertical" />
          <a
            onClick={e => {
              e.stopPropagation();
              if (handleClickDetail) {
                handleClickDetail(record);
              }
            }}
          >
            <span>详情</span>
          </a>
        </div>
      );
    },
  },
];
