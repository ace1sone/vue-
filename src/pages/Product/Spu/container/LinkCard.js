import React, { PureComponent } from 'react';
import { Button, Icon, message, Modal, Table } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { querySpecInfoByNo, queryDescInfoByNo } from '@/services/props';
import { searchAllSpec, searchAllDesc } from '@/services/product';
import { getGuid } from '@/utils/utils';
import styles from './LinkCard.less';
import { SPEC_COLUMNS, DESCRIPTION_COLUMNS } from './LinkCard.config';
import AttrModal from './AttrModal';
import AttrCard from './AttrCard';
import { getAddSpecColumns, mapSpecStateToColumns } from './spec.config';
import { getAddDecColumns, mapDescStateToColumns, getSubDescColumns, mapSubDataToCols } from './desc.config';

const formatObjectToState = (obj, firstKey, secondKey, name = 'name', id = 'id') => {
  const selectArr = (obj[firstKey] || []).map(_item => ({
    ..._item,
    name: _item[name],
    id: _item[id] || _item.id,
    compareId: _item.id,
  }));
  const allSelectArr = [...selectArr];
  const selectedId = obj.subJointId;
  const defaultSelectId = selectArr.length > 0 ? selectArr[0][id] - 0 : undefined;
  const selectName = selectArr.length > 0 ? selectArr[0].name : undefined;
  const selected = selectedId || defaultSelectId;
  const selectedTableSource = selectArr.find(__ => __.id === selected);
  const tableDataSource = selectedTableSource ? selectedTableSource[secondKey] : [];
  const getNewAttrs = () => [
    {
      key: getGuid(),
      selectArr,
      selected,
      name: selectName,
      allSelectArr,
      tableDataSource: tableDataSource || [],
    },
  ];
  const newObject = {
    ...obj,
  };
  return obj.attrs
    ? newObject
    : {
        key: obj[id],
        ...obj,
        name: obj.jointName || obj[name],
        id: obj[id],
        subJointId: selected,
        jointId: obj.jointId,
        attrs: getNewAttrs(),
      };
};

// descSubsetDetailDTOList
function serverDataToState(list, type) {
  const isSpec = type === 'spec';
  return isSpec
    ? list.map(__ => formatObjectToState(__, 'specStandardDTOList', 'ssDetailDTOList', 'chineseName'))
    : list.map(__ => formatObjectToState(__, 'descSubsetDTOList', 'descSubsetDetailDTOList'));
}

@connect(({ spuForm }) => ({
  spuForm,
}))
@autobind
class LinkCard extends PureComponent {
  static defaultProps = {
    onChange: () => {},
  };

  subDescSelectIndex = 0;

  state = {
    list: [],
    addLinkSpecVisible: false,
    addLinkDescriptionVisible: false,
    addSubDescriptionVisible: false,
    selectSpecList: [],
    selectDescList: [],
    descAttrsList: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { value, type } = props;
    const { list } = state;
    if (!_.isEqual(value, list)) {
      const newList = serverDataToState(value, type);
      return {
        list: newList,
      };
    }
    return null;
  }

  onSelectChange = (v, childIndex, parentIndex, item) => {
    const { list } = this.state;
    const { onChange, type } = this.props;
    const isSpec = type === 'spec';
    const getSelectArr = (arr = []) =>
      arr.reduce((pre, curr) => {
        if (v === curr.id) {
          const result = isSpec ? curr.ssDetailDTOList : curr.descSubsetDetailDTOList;
          return pre.concat(result || []);
        }
        return pre;
      }, []);
    list[parentIndex] = {
      ...item,
      subJointId: v,
      attrs: item.attrs.map((__, i) => {
        if (i === childIndex) {
          return {
            ...__,
            tableDataSource: getSelectArr(__.selectArr),
          };
        }
        return __;
      }),
    };
    const newList = [...list];
    this.setState({
      list: newList,
    });
    onChange(newList);
  };

  deleteList = item => {
    const { onChange } = this.props;
    const { list } = this.state;
    let newList = [];
    newList = list.filter(_item => _item.id !== item.id);
    this.setState({
      list: newList,
    });
    onChange(newList);
  };

  getSpecData = async (spuSearchWord = null) => {
    const { list } = this.state;
    const { data } = await searchAllSpec({ spuSearchWord });
    const newData = (data || []).filter(__ => !list.find(s => s.jointId === __.id));
    this.setState({
      selectSpecList: newData,
    });
  };

  getDescData = async (spuSearchWord = null) => {
    const { list } = this.state;
    const { data } = await searchAllDesc({ spuSearchWord });
    const newData = (data || []).filter(__ => !list.find(s => s.jointId === __.id));
    this.setState({
      selectDescList: newData,
    });
  };

  onAddSpec = async item => {
    const { list } = this.state;
    const { onChange } = this.props;
    const res = await querySpecInfoByNo({ req: item.id });
    const newData = formatObjectToState(res.data, 'specStandardDTOList', 'ssDetailDTOList', 'chineseName');
    list.push({ ...newData, jointId: newData.id });
    const newList = [...list];
    this.setState({
      list: newList,
      addLinkSpecVisible: false,
    });
    onChange(newList);
  };

  onAddDesc = async item => {
    const { list } = this.state;
    const { onChange } = this.props;
    const res = await queryDescInfoByNo({ req: item.id });
    const newData = formatObjectToState(res.data, 'descSubsetDTOList', 'descSubsetDetailDTOList');
    list.push({ ...newData, jointId: newData.id });
    const newList = [...list];
    this.setState({
      list: newList,
      addLinkDescriptionVisible: false,
    });
    onChange(newList);
  };

  getNewDescSubsetDTOListStatus = (descSubsetDTOList, attrs) =>
    descSubsetDTOList.map(__ => {
      const isSelected = attrs.findIndex(at => at.selected === __.id) > -1;
      return {
        ...__,
        key: __.id,
        selected: isSelected,
      };
    });

  onSubAdd = (desc, index) => {
    const { descSubsetDTOList, attrs } = desc;
    if (descSubsetDTOList.length === attrs.length) {
      message.error('没有更多子描述');
      return;
    }
    const newDescAttrsList = this.getNewDescSubsetDTOListStatus(descSubsetDTOList, attrs);
    this.subDescSelectIndex = index;
    this.setState({
      addSubDescriptionVisible: true,
      descAttrsList: newDescAttrsList,
    });
  };

  onAddSubDesc = (isSelected, item) => {
    const index = this.subDescSelectIndex;
    const { onChange } = this.props;
    const { list } = this.state;
    const selected = list[index];
    const { descSubsetDTOList } = selected;
    // 已选择
    if (!isSelected) return;
    const fSub = descSubsetDTOList.find(__ => __.id === item.id);
    selected.attrs = [
      ...selected.attrs,
      {
        ...fSub,
        // id: -fSub.id,
        key: getGuid(),
        selected: fSub.id,
        tableDataSource: fSub.descSubsetDetailDTOList || [],
      },
    ];
    list[index] = {
      ...selected,
    };
    const newList = [...list];
    const newDescAttrsList = this.getNewDescSubsetDTOListStatus(descSubsetDTOList, selected.attrs);
    this.setState({
      list: newList,
      descAttrsList: newDescAttrsList,
    });
    onChange(newList);
  };

  onSubDelete = (desc, _index, pIndex) => {
    const { onChange } = this.props;
    const { list } = this.state;
    const selected = list[pIndex];
    if (selected.attrs.length <= 1) {
      message.error('单个描述不能删除');
      return;
    }
    selected.attrs = selected.attrs.filter(__ => __.id !== desc.id);
    list[pIndex] = {
      ...selected,
    };
    const newList = [...list];
    this.setState({
      list: newList,
    });
    onChange(newList);
  };

  render() {
    const { type, spuForm, disabled } = this.props;
    const {
      list,
      addLinkSpecVisible,
      addLinkDescriptionVisible,
      addSubDescriptionVisible,
      selectSpecList,
      selectDescList,
      descAttrsList,
    } = this.state;
    const { backItem } = spuForm;
    const cardItemMap = {
      spec: {
        type: 'spec',
        columns: SPEC_COLUMNS,
        ADD_BTN_TEXT: '新增关联规格',
        onAdd: async () => {
          if (_.isEmpty(backItem) || !backItem.id) {
            message.error('请先选择后台类目');
            return;
          }
          if (list.length >= 2) {
            message.error('最多添加两个规格');
            return;
          }
          await this.getSpecData(backItem.id);
          this.setState({
            addLinkSpecVisible: true,
          });
        },
      },
      desc: {
        type: 'desc',
        columns: DESCRIPTION_COLUMNS,
        ADD_BTN_TEXT: '新增关联描述',
        onAdd: async () => {
          if (_.isEmpty(backItem) || !backItem.id) {
            message.error('请先选择后台类目');
            return;
          }
          await this.getDescData(backItem.id);
          this.setState({
            addLinkDescriptionVisible: true,
          });
        },
      },
    };
    const cardItem = cardItemMap[type];
    const specColumns = getAddSpecColumns(this.onAddSpec);
    const descColumns = getAddDecColumns(this.onAddDesc);

    const subDescModalProps = {
      title: '新增描述子集',
      visible: addSubDescriptionVisible,
      footer: null,
      onCancel: () => {
        this.setState({
          addSubDescriptionVisible: false,
        });
      },
    };

    const isEmptyBackItem = _.isEmpty(backItem);

    return (
      <>
        <AttrCard
          type={type}
          list={list}
          onDelete={this.deleteList}
          onSelect={this.onSelectChange}
          disabled={disabled}
          onSubAdd={this.onSubAdd}
          onSubDelete={this.onSubDelete}
        />
        <Button className={styles['large-btn']} type="dashed" block onClick={cardItem.onAdd} disabled={disabled || isEmptyBackItem}>
          <Icon type="plus" />
          <span>{cardItem.ADD_BTN_TEXT}</span>
        </Button>
        <AttrModal
          title="新增关联规格"
          visible={addLinkSpecVisible}
          onCancel={() => {
            this.setState({
              addLinkSpecVisible: false,
            });
          }}
          onSearch={this.getSpecData}
          tableProps={{
            columns: specColumns,
            dataSource: mapSpecStateToColumns(selectSpecList),
          }}
        />
        <AttrModal
          title="新增关联描述"
          visible={addLinkDescriptionVisible}
          onCancel={() => {
            this.setState({
              addLinkDescriptionVisible: false,
            });
          }}
          onSearch={v => {
            console.log('vvvvvv', v);
          }}
          tableProps={{
            columns: descColumns,
            dataSource: mapDescStateToColumns(selectDescList),
          }}
        />
        <Modal {...subDescModalProps}>
          <Table
            className={styles.table}
            columns={getSubDescColumns(this.onAddSubDesc)}
            dataSource={mapSubDataToCols(descAttrsList)}
            bordered
            size="small"
          />
        </Modal>
      </>
    );
  }
}
export default LinkCard;
