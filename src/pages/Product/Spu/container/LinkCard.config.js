export const SPEC_COLUMNS = [
  {
    key: 'row',
    style: 'row',
    data: [
      {
        key: '规格名称:',
        fieldname: 'name',
      },
      {
        key: '系列ID:',
        fieldname: 'id',
      },
    ],
  },
  {
    key: '规格标准:',
    fieldname: 'specValue',
    selectArr: [{ value: '1', label: '中国码' }, { value: '2', label: '欧洲码' }],
    tableDataSource: [
      {
        key: 1,
        index: 1,
        attrbute: 's0109019',
        status: 1,
      },
      {
        key: 2,
        index: 2,
        attrbute: 's0109020',
        status: 0,
      },
    ],
  },
];

export const DESCRIPTION_COLUMNS = [
  {
    key: 'row',
    style: 'row',
    data: [
      {
        key: '描述名称:',
        fieldname: 'name',
      },
      {
        key: '描述ID:',
        fieldname: 'id',
      },
    ],
  },
  {
    key: '描述子属性1:',
    fieldname: 'descriptionValue',
    selectArr: [{ value: '1', label: '中国码' }, { value: '2', label: '欧洲码' }],
    tableDataSource: [
      {
        key: 1,
        index: 1,
        attrbute: 's0109019',
        status: 1,
      },
      {
        key: 2,
        index: 2,
        attrbute: 's0109020',
        status: 0,
      },
    ],
  },
  {
    key: '描述子属性2:',
    fieldname: 'descriptionValue',
    selectArr: [{ value: '1', label: '中国码' }, { value: '2', label: '欧洲码' }],
    tableDataSource: [
      {
        key: 1,
        index: 1,
        attrbute: 's0109019',
        status: 1,
      },
      {
        key: 2,
        index: 2,
        attrbute: 's0109020',
        status: 0,
      },
      {
        key: 3,
        index: 3,
        attrbute: 's0109020',
        status: 0,
      },
    ],
  },
];

export default {
  SPEC_COLUMNS,
  DESCRIPTION_COLUMNS,
};
