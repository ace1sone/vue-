import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Select, InputNumber } from 'antd';
import { getGuid } from '@/utils/utils';
import _ from 'lodash';
import styles from './SkuTableForm.less';

const { Option } = Select;

class SkuTableForm extends React.Component {
  constructor(props) {
    super(props);
    let skuList = [];
    if (props.defaultSkuList) {
      if (props.inStock) {
        skuList = props.defaultSkuList.map(e => {
          const attributes = {};
          e.basisDTOS.forEach(basis => {
            attributes[basis.standardId] = basis.basisId;
          });
          return {
            id: e.id,
            spuId: e.spuId,
            nums: e.receiptNumber,
            attributes,
          };
        });
      } else {
        skuList = props.defaultSkuList.map(e => {
          const attributes = {};
          e.basisDTOS.forEach(basis => {
            attributes[basis.standardId] = basis.basisId;
          });
          const sku = props.skuStockList.find(__ => __.skuId === e.skuId);
          const usableStockNum = sku ? sku.usableStockNum : undefined;
          return {
            id: e.id,
            spuId: e.spuId,
            skuId: e.skuId,
            nums: e.outboundNumber,
            stock: usableStockNum,
            attributes,
          };
        });
      }
    }
    this.state = {
      skuList,
    };
  }

  componentDidMount() {
    const { action } = this.props;
    if (action === 'new') {
      this.addEmptyLine();
    }
  }

  getSkuColunms() {
    const specStandardList = this.getSpecStandardList();
    const { action, inStock } = this.props;
    const { skuList } = this.state;
    const moreThanOneSpec = skuList.length > 1;
    const editMode = action !== 'view';
    const columns = [];

    specStandardList.forEach(spec => {
      columns.push({
        title: spec.chineseName || spec.englishName,
        dataIndex: 'attributes',
        key: spec.id,
        width: '260px',
        render: (value, record) => {
          if (editMode) {
            return (
              <Select placeholder="请选择" style={{ width: '100%' }} value={value[spec.id]} onChange={v => this.handleSelectChange(v, record, spec)} key={record.id}>
                {spec.ssDetailDTOList.map(v => (
                  <Option value={v.id} key={v.id}>
                    {v.attributes}
                  </Option>
                ))}
              </Select>
            );
          }
          if (!spec.ssDetailDTOList) return <span>{value[spec.id]}</span>;
          const tmp = spec.ssDetailDTOList.filter(ele => ele.id === value[spec.id]);
          return <span>{tmp.length > 0 && tmp[0].attributes}</span>;
        },
      });
    });
    for (let i = 2 - specStandardList.length; i > 0; i -= 1) {
      columns.push({
        title: '',
        dataIndex: '',
        width: '260px',
      });
    }
    if (editMode && !inStock) {
      columns.push({
        title: '最大可出库数量',
        dataIndex: 'stock',
        width: '260px',
      });
    }
    const numTitle = inStock ? '入库数量' : '出库数量';
    columns.push({
      title: numTitle,
      dataIndex: 'nums',
      render: (value, record) => {
        if (editMode) {
          let disabled = true;
          if (inStock) {
            disabled = _.size(record.attributes) !== specStandardList.length;
          } else {
            disabled = !record.stock;
          }
          const maxNums = record.stock;
          return (
            <InputNumber
              disabled={disabled}
              style={{ width: 160 }}
              min={0}
              max={maxNums}
              value={value}
              onChange={v => this.handleStockInputChange(v, record)}
            />
          );
        }
        return <span>{value}</span>;
      },
    });
    columns.push({
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '144px',
      render: (value, record) => {
        if (editMode && moreThanOneSpec) {
          return (
            <a onClick={e => this.handleClickDelete(record, e)}>
              <span style={{ color: '#F5222D' }}>删除</span>
            </a>
          );
        }
        return null;
      },
    });
    return columns;
  }

  getSpecStandardList() {
    const { specStandardList } = this.props;
    return specStandardList || [];
  }

  getMatchSkuDefaultData(skuLine) {
    const { defaultSkuList } = this.props;
    return defaultSkuList.find(e => {
      const attributes = {};
      e.basisDTOS.forEach(basis => {
        attributes[basis.standardId] = basis.basisId;
      });
      return _.isEqual(attributes, skuLine.attributes);
    });
  }

  getMatchSkuStockData(skuLine) {
    const { skuStockList } = this.props;
    return skuStockList.find(item => {
      const attributes = {};
      item.skuDetailList.forEach(e => {
        attributes[e.standardId] = e.basisId;
      });
      return _.isEqual(skuLine.attributes, attributes);
    });
  }

  hasEmptyRecord = () => {
    const { skuList } = this.state;
    const specStandardList = this.getSpecStandardList();
    const specCount = specStandardList.length;

    return skuList.some(item => !item.nums || item.attributes.length < specCount);
  };

  getRequestParams = () => {
    const { inStock } = this.props;
    if (inStock) {
      return this.getInStockRequestParams();
    }
    return this.getOutStockRequestParams();
  };

  getInStockRequestParams = () => {
    const { spuInfo } = this.props;
    const { skuList } = this.state;
    const specStandardList = this.getSpecStandardList();
    const spuBase = {
      spuId: spuInfo.spuId,
      brandName: spuInfo.brandName,
      spuName: spuInfo.englishName || spuInfo.chineseName,
      seriesName: spuInfo.seriesName,
    };
    const standardMap = {};
    const standDetailMap = {};
    specStandardList.forEach(stand => {
      standardMap[stand.id] = stand;
      const detailMap = {};
      stand.ssDetailDTOList.forEach(e => {
        detailMap[e.id] = e;
      });
      standDetailMap[stand.id] = detailMap;
    });

    return skuList.map(skuItem => {
      const basisDTOS = [];
      specStandardList.forEach(stand => {
        const standardId = stand.id;
        const basisId = skuItem.attributes[stand.id];
        const basisValue = standDetailMap[standardId][basisId].attributes;

        basisDTOS.push({
          type: 1,
          standardId,
          detailsBasisName: stand.chineseName || stand.englishName,
          basisId,
          detailsBasisValue: basisValue,
        });
      });
      const sku = {
        ...spuBase,
        receiptNumber: skuItem.nums,
        basisDTOS,
      };
      if (!isNaN(skuItem.id)) Object.assign(sku, { id: skuItem.id });
      return sku;
    });
  };

  getOutStockRequestParams = () => {
    const { skuList } = this.state;
    const { action } = this.props;
    return skuList.map(e => {
      const id = action === 'new' ? undefined : e.id;
      return {
        delFlag: 0,
        id,
        skuId: e.skuId,
        spuId: e.spuId,
        outboundNumber: e.nums,
      };
    });
  };

  hasDuplicateRecord = () => {
    const { skuList } = this.state;
    // return skuList.map(e => e.attributes).some((item, index, array) => _.some(array.slice(index + 1), item));
    return _.uniqWith(skuList.map(e => e.attributes), _.isEqual).length < skuList.length;
  };

  handleSelectChange(v, record, spec) {
    const { skuList } = this.state;
    const { inStock } = this.props;
    const line = record;
    line.attributes[spec.id] = v;
    if (!inStock) {
      const sku = this.getMatchSkuStockData(line);
      if (sku) {
        line.stock = sku.usableStockNum;
        line.skuId = sku.skuId;
        line.spuId = sku.spuId;
      } else {
        line.stock = undefined;
        line.skuId = undefined;
        line.spuId = undefined;
      }
    }

    const matchDefaultData = this.getMatchSkuDefaultData(line);
    if (matchDefaultData) {
      line.nums = inStock ? matchDefaultData.receiptNumber : matchDefaultData.outboundNumber;
    } else {
      line.nums = undefined;
    }
    this.setState({
      skuList: [...skuList],
    });
  }

  handleStockInputChange(v, record) {
    const { skuList } = this.state;
    const line = record;
    if (v) {
      line.nums = parseInt(v, 10);
    } else {
      line.nums = undefined;
    }
    this.setState({
      skuList: [...skuList],
    });
  }

  handleClickDelete(record) {
    const { skuList } = this.state;
    if (skuList.length < 2) {
      return;
    }
    const filterList = skuList.filter(v => v.id !== record.id);
    this.setState({
      skuList: filterList,
    });

    const { deleteItemCallback } = this.props;
    if (deleteItemCallback) deleteItemCallback(record);
  }

  canAddNewLine() {
    const { action } = this.props;
    if (action === 'view') {
      return false;
    }
    const { skuList } = this.state;
    const maxLineCount = this.maxLineCount();
    return skuList.length < maxLineCount;
  }

  maxLineCount() {
    const specStandardList = this.getSpecStandardList();
    let maxLineCount = 0;
    specStandardList.forEach(spec => {
      const ssDetailDTOListLength = spec.ssDetailDTOList.length;
      if (ssDetailDTOListLength !== 0) {
        if (maxLineCount === 0) {
          maxLineCount = ssDetailDTOListLength;
        } else {
          maxLineCount *= ssDetailDTOListLength;
        }
      }
    });
    return maxLineCount;
  }

  addEmptyLine() {
    const { skuList } = this.state;
    const line = {
      id: getGuid('stock'),
      nums: undefined,
      stock: undefined,
      attributes: {}, // { specStandardId: specDetailId }
    };
    this.setState({ skuList: [...skuList, line] });
  }

  render() {
    const { skuList } = this.state;
    return (
      <div className={styles.skuTableForm}>
        <Table
          bordered={false}
          size="small"
          rowKey={item => item.id}
          columns={this.getSkuColunms()}
          pagination={false}
          dataSource={skuList}
        />
        {this.canAddNewLine() ? (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8, color: '#3B99FD' }}
            type="dashed"
            icon="plus"
            onClick={() => this.addEmptyLine()}
          >
            添加SKU
          </Button>
        ) : null}
      </div>
    );
  }
}

SkuTableForm.propTypes = {
  spuInfo: PropTypes.object,
  specStandardList: PropTypes.array,
  action: PropTypes.string, // new/edit/view
  inStock: PropTypes.bool, // 入库
  defaultSkuList: PropTypes.array,
  skuStockList: PropTypes.array,
};

SkuTableForm.defaultProps = {
  spuInfo: undefined,
  specStandardList: [],
  action: 'new',
  inStock: true,
  defaultSkuList: undefined,
  skuStockList: [],
};

export default SkuTableForm;
