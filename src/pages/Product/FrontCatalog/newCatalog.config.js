import React from 'react';
import _ from 'lodash';

/** **前台新增类目 ** * */
const firstCategoryColumns = addhandle => [
  {
    title: '后台类目ID',
    dataIndex: 'id', // backClassId
    key: 'id',
    align: 'left',
    width: '30%',
  },
  {
    title: '后台类目名称',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    width: '40%',
  },
  {
    title: '操作',
    dataIndex: '',
    align: 'right',
    width: '35%',
    render: text => {
      let str = '添加';
      if (text.isAdd === 1 || text.isAdd === 2 || text.isAdd === 3) {
        str = '不可添加';
      }
      return (
        <a
          onClick={() => {
            if (text.isAdd === 0) {
              addhandle(text);
            }
          }}
          style={{
            backgroundColor: '#FFFFFF',
            border: '0px',
            boxShadow: '0 0 0',
            // color: '#3B99FD',
            fontSize: 12,
            color: text.isAdd === 0 ? '#3B99FDFF' : '#000000FF',
            opacity: text.isAdd === 0 ? '1' : '0.5',
          }}
        >
          {str}
        </a>
      );
    },
  },
];
const CategoryColumns = deleteClick => [
  {
    title: '后台类目名称',
    dataIndex: '',
    render: text => {
      let str = '';
      if (text.backClassName) {
        str = text.backClassName;
      } else {
        str = text.name;
      }
      return <span>{str}</span>;
    },
  },
  {
    title: '后台类目ID',
    dataIndex: '',
    render: text => <span>{text.change === 2 ? text.id : text.backClassId}</span>,
  },
  {
    title: '后台类目状态',
    dataIndex: '',
    width: 120,
    render: text => {
      let str = '已启用';
      if (text.backClassStatus === 0 || text.backClassStatus === null) {
        str = '已启用';
      } else if (text.backClassStatus === 3) {
        str = '已禁用';
      }
      return <span>{str}</span>;
    },
  },
  {
    title: '操作',
    dataIndex: '',
    width: 100,
    // render: (text, record, index) => (
    render: text => (
      <a
        onClick={() => {
          deleteClick(text);
          // this.setState(() => ({ deleteVisible: true }));
        }}
        name="delete"
      >
        删除
      </a>
    ),
  },
];

/** **后台新增类目 ** * */
const backColumnsDefault = (firstTitle = '规格名称:', secondTitle = '规格ID', type = 2) => [
  {
    title: firstTitle,
    dataIndex: type === 1 ? 'chineseName' : 'name',
    key: type === 1 ? 'chineseName' : 'name',
  },
  {
    title: secondTitle,
    dataIndex: 'attributeId',
    key: 'attributeId',
  },
];
const backColumnsCustom = (firstTitle = '规格描述:', secondTitle = '规格ID', type = 2, deleteClick) => {
  const columns = backColumnsDefault(firstTitle, secondTitle, type);
  const deleteColumn = {
    title: '操作',
    dataIndex: '',
    key: 'operation',
    render: text => (
      // render: () => (
      <a
        onClick={() => {
          deleteClick(text);
          // this.setState(() => ({ deleteVisible: true }));
        }}
        name="delete"
      >
        删除
      </a>
    ),
  };
  columns.push(deleteColumn);
  return columns;
};
const backNewCategoryColumns = (firstTitle = '规格描述:', secondTitle = '规格ID', type = 2, deleteClick) => {
  const columns = deleteClick ? backColumnsCustom(firstTitle, secondTitle, type, deleteClick) : backColumnsDefault(firstTitle, secondTitle, type);
  return columns;
};

const bgAddAssociatedColumns = (serial, ID, name1, name2, count, averageWdth, selectDatas, addHandle) => [
  {
    title: serial,
    dataIndex: '',
    width: '10%',
    align: 'right',
    render: (value, record, index) => <span>{index + 1}</span>,
  },
  {
    title: ID,
    dataIndex: 'attributeId',
    width: averageWdth,
  },
  {
    title: name1,
    dataIndex: name2 ? 'chineseName' : 'name',
    width: averageWdth,
  },
  {
    title: count,
    dataIndex: 'ssNum',
    width: '16%',
    align: 'right',
  },
  {
    title: '操作',
    dataIndex: '',
    width: '9%',
    render: text => (
      // render: () => (
      <a
        onClick={() => {
          if (_.find(selectDatas, x => text.attributeId === x.attributeId)) {
            return;
          }
          // if (selectDatas.length >= 2 && name2 !== null) return;
          addHandle(text);
          // this.setState(() => ({ deleteVisible: true }));
        }}
        style={{
          color: _.find(selectDatas, x => text.attributeId === x.attributeId) ? '#000000FF' : '#3B99FDFF',
          opacity: _.find(selectDatas, x => text.attributeId === x.attributeId) ? '0.5' : '1',
        }}
        name="delete"
      >
        {_.find(selectDatas, x => text.attributeId === x.attributeId) ? '已添加' : '添加'}
      </a>
    ),
  },
];
const bgAddColumns = (serial, ID, name1, name2, count, selectDatas = [], addHandle) => {
  let averageWdth = '21%';
  if (name2 === null) {
    averageWdth = '31.5%';
  }
  const columns = bgAddAssociatedColumns(serial, ID, name1, name2, count, averageWdth, selectDatas, addHandle);
  if (name2) {
    const name2Column = {
      title: name2,
      dataIndex: 'englishName',
      width: averageWdth,
    };
    columns.splice(3, 0, name2Column);
  }
  return columns;
};
export { firstCategoryColumns, CategoryColumns, backNewCategoryColumns, bgAddColumns };
