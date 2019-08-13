import React from 'react';
// import { useCounter } from 'react-use';
import { Card, Button, Table, Select, Modal, Icon, Popconfirm } from 'antd';
import EvenlySplitRow from '@/components/EvenlySplitRow';
import cn from 'classnames';
import _ from 'lodash';
import styles from './LinkCard.less';
import { getColumns as getSpecColumns, mapDataToCols as mapSpecDataToCols } from './spec.config';
import { getColumns as getDescColumns, mapDataToCols as mapDescDataToCols } from './desc.config';

const { Option } = Select;

function AttrCard({ list = [], type = 'spec', onDelete = _.noop, onSelect = _.noop, onSubAdd = _.noop, onSubDelete = _.noop, disabled }) {
  const nameMap = {
    spec: [
      {
        key: '规格名称:',
        fieldname: 'name',
      },
      {
        key: '系列ID:',
        fieldname: 'jointId',
      },
    ],
    desc: [
      {
        key: '描述名称:',
        fieldname: 'name',
      },
      {
        key: '描述ID:',
        fieldname: 'jointId',
      },
    ],
  };

  const isSpec = type === 'spec';

  const attrName = isSpec ? '规格标准' : '描述子属性';
  const isDesc = !isSpec;

  const tableColumns = type === 'spec' ? getSpecColumns() : getDescColumns();
  function getTableDataSource(dataSource) {
    return type === 'spec' ? mapSpecDataToCols(dataSource) : mapDescDataToCols(dataSource);
  }

  function renderDelete(__, __i, _i) {
    return disabled ? (
      <span
        className={cn(styles['danger-action'], {
          [styles.disabled]: disabled,
        })}
      >
        删除
      </span>
    ) : (
      <Popconfirm
        title="是否删除?"
        onConfirm={() => {
          if (disabled) return;
          onSubDelete(__, __i, _i);
        }}
        okText="确认"
        cancelText="取消"
      >
        <span
          className={cn(styles['danger-action'], {
            [styles.disabled]: disabled,
          })}
        >
          删除
        </span>
      </Popconfirm>
    );
  }

  return list.map((item, _i) => (
    <Card
      key={item.id}
      title={item.title}
      className={cn(styles.card, styles.gray)}
      bordered={false}
      extra={
        <Button
          type="danger"
          disabled={disabled}
          onClick={() => {
            Modal.confirm({
              title: `是否删除关联${isSpec ? '规格' : '描述'}?`,
              okText: '确认',
              cancelText: '取消',
              onOk() {
                onDelete(item, _i);
              },
            });
          }}
        >
          删除
        </Button>
      }
    >
      <EvenlySplitRow>
        {nameMap[type].map(cid => (
          <div className={styles['card-item']} key={cid.fieldname}>
            <span className={styles['card-item-title']}>{cid.key}</span>
            <span className={styles['card-item-content']}>{item[cid.fieldname]}</span>
          </div>
        ))}
      </EvenlySplitRow>
      {item.attrs.map((__, __i) => (
        <div key={__.key}>
          <EvenlySplitRow minCols={1}>
            <div className={styles['card-item']}>
              <span className={styles['card-item-title']}>{attrName}:</span>
              {isDesc ? (
                <span style={{ marginLeft: '10px' }}>{__.name}</span>
              ) : (
                <Select
                  className={styles['card-item-content']}
                  style={{ width: 200 }}
                  placeholder={attrName}
                  defaultValue={__.selected}
                  onChange={v => onSelect(v, __i, _i, item)}
                  disabled={disabled}
                >
                  {__.selectArr.map(cis => (
                    <Option value={cis.id} key={cis.id}>
                      {cis.name}
                    </Option>
                  ))}
                </Select>
              )}
              {/* {isDesc && __i === item.attrs.length - 1 && (
                <span
                  className={styles['add-action']}
                  onClick={() => {
                    onSubAdd(__, __i, _i);
                  }}
                >
                  新增
                </span>
              )} */}
              {isDesc && renderDelete(__, __i, _i)}
            </div>
          </EvenlySplitRow>
          <Table className={styles.table} columns={tableColumns} dataSource={getTableDataSource(__.tableDataSource)} bordered size="small" />
        </div>
      ))}
      {isDesc && (
        <Button
          className={styles['large-btn']}
          type="dashed"
          block
          onClick={() => {
            onSubAdd(item, _i);
          }}
          disabled={disabled}
        >
          <Icon type="plus" />
          <span>新增描述子集</span>
        </Button>
      )}
    </Card>
  ));
}

export default AttrCard;
