import React from 'react';
import { Card, Button, Form, Input, Table, Modal, Alert, Spin, message } from 'antd';
import EvenlySplitRow from '@/components/EvenlySplitRow';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StickyBar from '@/components/StickyBar';
import qs from 'query-string';
import _ from 'lodash';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import styles from './NewCatalog.less';
import CatalogTable from '@/common/CatalogTable';
import { firstCategoryColumns, CategoryColumns } from './newCatalog.config';
import { inject } from '@/config';

const { Search } = Input;
const formItemLayout = {
  labelAlign: 'left',
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
  colon: true,
};
@autobind
@Form.create()
class NewCatalog extends React.Component {
  storeService = inject('storeService');

  catalogAllDatas = [];

  disableAddBackCatalog = [];

  constructor(props) {
    super(props);
    this.state = {
      FirstVisible: false,
      OtherVisible: false,
      deleteVisible: false,
      defaultInputValue: '',
      backCatalogDatas: { 0: [], 1: [], 2: [] },
      otherBackCatalogDatas: [],
      selectedCatalogIds: [],
      catalogDatas: [],
      searchKey: '',
    };
  }

  componentDidMount() {
    const { location, dispatch } = this.props;
    dispatch({
      type: 'addFrontCatalog/cleanDatas',
    });
    this.deleteData = null;
    const { id, parentId, topId } = qs.parse(location.search);
    this.delFlag = 0;
    this.isLeaf = true;
    if (id) {
      this.parentId = parentId;
      this.loadCatalogDetail(id, topId);
    } else {
      this.parentCatalog = this.storeService.getTemp('fcn_parentCatalog');
      // console.log(this.parentCatalog);
      this.topClassId = this.storeService.getTemp('fcn_topClassId');
      // console.log(this.parentCatalog, this.topClassId);
      // this.parentForeNo = '0';
      this.level = 1;
      this.parentId = 0;
      this.id = 0;
      if (this.parentCatalog) {
        this.parentId = this.parentCatalog.id;
        // this.parentForeNo = this.parentCatalog.foreNo;
        this.level = this.parentCatalog.level + 1;
        this.parenteName = this.parentCatalog.name;
      }
      this.forceUpdate();
    }
  }

  loadCatalogDetail = async (Id, parentId, topId) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'addFrontCatalog/foreCatalogDetail',
      payload: { id: Id },
    });
    // console.log(res);
    this.level = 1;
    if (res.data) {
      this.id = res.data.relaionDTO.id;
      this.delFlag = res.data.relaionDTO.delFlag;
      this.isLeaf = res.data.relaionDTO.isLeaf;
      const { detailList } = res.data;

      const newBackDetailList = detailList.filter(item => item !== null);

      this.catalogAllDatas = [...newBackDetailList];
      this.topClassId = topId;
      this.level = res.data.relaionDTO.level;
      this.originName = res.data.relaionDTO.name;

      this.parenteName = res.data.relaionDTO.parentName;
      this.setState(() => ({
        defaultInputValue: res.data.relaionDTO.name,
        catalogDatas: [...newBackDetailList],
      }));
    }
  };

  deleteBackItem = () => {
    if (this.deleteData === null) {
      return;
    }
    const tempCatalogAllDatas = this.catalogAllDatas.filter(item => !(item.change === 2 && item.id === this.deleteData.id));
    const newCatalogAllDatas = tempCatalogAllDatas.map(item => {
      const newItem = item;
      if (newItem.id === this.deleteData.id) {
        newItem.delFlag = 1;
        newItem.change = 1; // change 1,删除之前添加过得后台类目  2,新增关联的后台类目.  change不存在:已经关联但是没删除的
      }
      return newItem;
    });
    this.catalogAllDatas = newCatalogAllDatas;
    const { catalogDatas: oldDatas } = this.state;
    const filterDatas = oldDatas.filter(item => item.id !== this.deleteData.id);

    let newParentId = this.deleteData.parentClassId;
    const { backCatalogDatas } = this.state;
    for (let i = this.deleteData.level - 1; i >= 0; i -= 1) {
      for (let j = 0; j < backCatalogDatas[i].length; j += 1) {
        if (backCatalogDatas[i][j].id === newParentId) {
          if (backCatalogDatas[i][j].isAdd !== 2) {
            backCatalogDatas[i][j].isAdd = 0;
          }
          if (this.disableAddBackCatalog) {
            _.remove(this.disableAddBackCatalog, backCatalogDatas[i][j].id);
          }

          newParentId = backCatalogDatas[i][j].parentClassId;
          break;
        }
      }
    }

    this.deleteData = null;
    this.setState({
      catalogDatas: filterDatas,
    });
  };

  deleteFrontCatalog = () => {
    const nameInputValue = this.originName;
    const { dispatch } = this.props;
    const foreClassRelationDTO = {
      parentId: this.parentId,
      level: this.level,
      delFlag: 1,
      name: '',
      topName: this.parentCatalog ? this.parentCatalog.topName : nameInputValue,
    };
    foreClassRelationDTO.id = this.id;
    const param = {
      foreClassRelationDTO,
      proForeClassDetailList: [],
    };
    dispatch({
      type: 'addFrontCatalog/delLinksCatalog',
      payload: param,
    });
  };

  handleOk = () => {
    const { FirstVisible, OtherVisible, deleteVisible } = this.state;
    if (FirstVisible === true) {
      // console.log('第一级新增类目');
    } else if (OtherVisible === true) {
      // console.log('其他新增类目');
    } else if (deleteVisible === true) {
      // console.log('第删除类目');
      if (this.deleteData === null) {
        this.deleteFrontCatalog();
      } else {
        this.deleteBackItem();
      }
    }
    this.setState(() => ({ FirstVisible: false, OtherVisible: false, deleteVisible: false }));
  };

  handleCancel = () => {
    this.deleteData = null;
    this.setState(() => ({
      FirstVisible: false,
      OtherVisible: false,
      deleteVisible: false,
      // backCatalogDatas: { 1: [], 2: [],3:[] },
      otherBackCatalogDatas: [],
      // selectedCatalogIds: [],
    }));
  };

  handleRowSelected = record => {
    const { selectedCatalogIds } = this.state;
    const newIds = selectedCatalogIds.slice(0, record.level - 1);
    newIds.push(record.id);
    this.setState(() => ({ selectedCatalogIds: newIds }));

    this.loadFirstBackCatalogDatas(record.id, record.level, record);
  };

  loadFirstBackCatalogDatas = async (Id, level, record) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'addFrontCatalog/fetchFirstCatalog',
      payload: { id: Id, currForeId: this.id },
    });
    const { backCatalogDatas, catalogDatas } = this.state;
    const newDatas = res.data.map(item => {
      const newItem = item;

      if (_.find(catalogDatas, x => Id === (x.isAdd === 2 ? x.id : x.backClassId))) {
        newItem.isAdd = 1;
      } else if (_.find(catalogDatas, x => item.id === (x.isAdd === 2 ? x.id : x.backClassId))) {
        newItem.isAdd = 1; //
      } else if (_.find(this.disableAddBackCatalog, x => item.id === x)) {
        newItem.isAdd = 1;
      }
      if (record) {
        if (record.isAdd === 2 || record.isAdd === 3) {
          newItem.isAdd = 3;
        }
      }
      return newItem;
    });
    backCatalogDatas[level] = newDatas;
    this.setState(() => ({ backCatalogDatas }));
    this.forceUpdate();
  };

  loadChildBackCatalogDatas = async Id => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'addFrontCatalog/fetchChildCatalog',
      payload: { id: Id },
    });
    this.setState(() => ({ otherBackCatalogDatas: res.data || [] }));
    this.forceUpdate();
  };

  renderCatalogTable = level => {
    const { selectedCatalogIds, backCatalogDatas, catalogDatas } = this.state;
    // console.log(backCatalogDatas);
    const levelIndex = level - 1;
    const parentLevelIndex = levelIndex - 1;
    if (levelIndex === 0 || selectedCatalogIds[parentLevelIndex]) {
      return (
        <CatalogTable
          dataIndexKey="id"
          level={level}
          columns={firstCategoryColumns(data => {
            const newData = data;
            newData.isAdd = 2;
            const { parentClassId } = data;
            let newParentId = parentClassId;

            for (let i = data.level - 1; i >= 0; i -= 1) {
              for (let j = 0; j < backCatalogDatas[i].length; j += 1) {
                if (backCatalogDatas[i][j].id === newParentId) {
                  if (backCatalogDatas[i][j].isAdd !== 2) {
                    backCatalogDatas[i][j].isAdd = 1;
                  }
                  this.disableAddBackCatalog.push(backCatalogDatas[i][j].id);
                  newParentId = backCatalogDatas[i][j].parentClassId;
                  break;
                }
              }
            }
            catalogDatas.push(newData);

            newData.change = 2;
            this.catalogAllDatas.push(newData);
          })}
          hasAddNew={false}
          dataSource={backCatalogDatas[levelIndex] || []}
          onRowSelected={this.handleRowSelected}
          selectedId={selectedCatalogIds[levelIndex] || null}
          parentId={selectedCatalogIds[parentLevelIndex] || '0'}

          // loading={catalogLevelLoadings[level] || false}
        />
      );
    }
    return null;
  };

  showAddFirstCategory = () => {
    const { FirstVisible } = this.state;
    return (
      <Modal
        title="新增关联后台类目"
        visible={FirstVisible}
        onOk={this.handleOk}
        centered
        width={1210}
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: 415,
          }}
        >
          {this.renderCatalogTable(1)}
          {this.renderCatalogTable(2)}
          {this.renderCatalogTable(3)}
          {this.renderCatalogTable(4)}
        </div>
      </Modal>
    );
  };

  OtherCategoryItem = item => {
    const { catalogDatas } = this.state;
    // const opacity = item.key < 0 ? 1 : 1;
    let color = '#c0c0c0';
    let btnTitle = '已添加';
    if (item.isAdd === 0) {
      color = _.find(catalogDatas, x => item.id === x.id) ? '#c0c0c0' : '#3B99FD';
      btnTitle = _.find(catalogDatas, x => item.id === x.id) ? '已添加' : '添加';
    }
    return (
      <div
        style={
          item.key < 0
            ? {
                lineHeight: '40px',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '50%',
                backgroundColor: '#E8E8E8',
              }
            : {
                lineHeight: '40px',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '50%',
              }
        }
      >
        <div
          style={{
            display: 'flex',
            width: '35%',
            borderBottom: '1px solid #d9d9d9',
            borderRight: '1px solid #d9d9d9',
            paddingLeft: '3%',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              width: '100%',
              display: 'flex',
              // opacity,
              color: '#000000FF',
            }}
          >
            {item.id}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            width: '45%',
            borderBottom: '1px solid #d9d9d9',
            borderRight: '1px solid #d9d9d9',
            paddingLeft: '3%',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              display: 'flex',
              width: '100%',
              // opacity,
              color: '#000000FF',
            }}
          >
            {item.name}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            width: '20%',
            borderBottom: '1px solid #d9d9d9',
            borderRight: '1px solid #d9d9d9',
            // color: '#000000',
            // opacity,
            paddingLeft: '3%',
            alignItems: 'center',
          }}
        >
          <a
            style={{
              width: '100%',
              display: 'flex',
              color: item.key < 0 ? '#000000FF' : color,
              opacity: _.find(catalogDatas, x => item.id === x.id) ? '0.5' : '1',
            }}
            onClick={() => {
              if (_.find(catalogDatas, x => item.id === x.id) || item.isAdd === 1) {
                return;
              }
              if (!item.key) {
                catalogDatas.push(item);

                const newData = item;
                newData.change = 2;
                this.catalogAllDatas.push(newData);
                this.forceUpdate();
              }
            }}
          >
            {item.key ? '操作' : btnTitle}
          </a>
        </div>
      </div>
    );
  };

  showOtherCatalogItem = datas => {
    const { searchKey } = this.state;
    const lowerKey = _.lowerCase(searchKey);
    const newDatas = datas.filter(item => item.id.toString().indexOf(lowerKey) >= 0 || item.name.indexOf(lowerKey) >= 0 || !searchKey);
    return newDatas.map(item => this.OtherCategoryItem(item));
  };

  showAddOtherCategory = () => {
    const { OtherVisible, otherBackCatalogDatas, searchKey } = this.state;
    // const { otherCatalogDatas } = this.props;
    return (
      <Modal
        title="新增关联后台类目"
        visible={OtherVisible}
        onOk={this.handleOk}
        centered
        width={816}
        maskClosable={false}
        footer={null}
        onCancel={this.handleCancel}
      >
        <div className={styles.top}>
          <Search
            placeholder="请输入类目ID或类目名称"
            onSearch={value => {
              this.setState(() => ({ searchKey: value }));
              // this.searchKey = value;
              this.forceUpdate();
            }}
            onChange={e => {
              const { value } = e.target;
              this.setState(() => ({ searchKey: value }));
            }}
            value={searchKey}
            // enterButton="搜索"
            enterButton
            style={{ width: 300 }}
            allowClear
          />
          {/* <Button
            onClick={() => {
              this.setState(() => ({ searchKey: '' }));
              // this.searchKey = '';
              this.forceUpdate();
            }}
            type="default"
            style={{ marginLeft: 24 }}
          >
            清空
          </Button> */}
          <div
            style={{
              marginTop: 20,
              borderTop: '1px solid #d9d9d9',
              borderLeft: '1px solid #d9d9d9',
              borderBottom: '1px solid #d9d9d9',
              // backgroundColor: '#858393',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                width: '100%',
                height: '40px',
                flexWrap: 'wrap',
              }}
            >
              {this.OtherCategoryItem({
                key: -2,
                id: '后台类目ID',
                name: '后台类目名称',
              })}
              {this.OtherCategoryItem({
                key: -2,
                id: '后台类目ID',
                name: '后台类目名称',
              })}
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                width: '100%',
                height: '250px',
                overflow: 'scroll',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {this.showOtherCatalogItem(otherBackCatalogDatas)}
              {/* {otherBackCatalogDatas.map(item => this.OtherCategoryItem(item))} */}
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  deleteCategory = () => {
    const { deleteVisible } = this.state;
    return (
      <Modal title={false} visible={deleteVisible} onOk={this.handleOk} centered width={437} maskClosable={false} onCancel={this.handleCancel}>
        <Alert
          style={{
            backgroundColor: '#fff',
            border: '0px',
            fontSize: 16,
            color: '#000',
            // paddingLeft: 40,
          }}
          type="error"
          message="警告"
          showIcon
        />
        <p
          style={{
            marginLeft: 20,
            marginTop: 10,
          }}
        >
          {this.deleteTipStr}
        </p>
      </Modal>
    );
  };

  // deleteClick = () => {
  //   this.setState(() => ({ deleteVisible: true }));
  // };

  commitData = () => {
    const { defaultInputValue, catalogDatas } = this.state;
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    const nameInputValue = _.trim(defaultInputValue);
    if (nameInputValue === '' || nameInputValue === undefined || nameInputValue == null) {
      validateFieldsAndScroll(() => {});
      return;
    }
    if (!this.id) {
      if (catalogDatas.length === 0) {
        message.error('关联的后台类目不能为空!');
        return;
      }
    }

    const { dispatch } = this.props;

    const proForeClassDetailList = this.catalogAllDatas.filter(item => item.change);

    const newproForeClassDetailList = proForeClassDetailList.map(item => {
      const newItem = {
        backClassName: item.change === 1 ? item.backClassName : item.name,
        backClassId: item.change === 1 ? item.backClassId : item.id,
        foreName: nameInputValue,
        level: this.level,
        delFlag: item.delFlag,
        createdBy: 999,
        updatedBy: 9999,
      };
      if (item.change === 1) {
        newItem.id = item.id;
        newItem.delFlag = 1;
      }
      return newItem;
    });
    const foreClassRelationDTO = {
      parentId: this.parentId,
      level: this.level,
      delFlag: 0,
      createdBy: 888,
      updatedBy: 888,
      name: nameInputValue,
      topName: this.parentCatalog ? this.parentCatalog.topName : nameInputValue,
    };
    if (this.id) {
      foreClassRelationDTO.id = this.id;
    } else {
      foreClassRelationDTO.topId = this.topClassId;
    }
    const param = {
      foreClassRelationDTO,
      proForeClassDetailList: newproForeClassDetailList,
    };
    if (this.id) {
      dispatch({
        type: 'addFrontCatalog/modifyCatalog',
        payload: param,
      });
    } else {
      dispatch({
        type: 'addFrontCatalog/addCatalog',
        payload: param,
      });
    }
  };

  catalogLevel = () => {
    switch (this.level) {
      case 1:
        return '一级类目';
      case 2:
        return '二级类目';
      case 3:
        return '三级类目';
      case 4:
        return '四级类目';
      default:
        return '一级类目';
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { catalogDatas, defaultInputValue } = this.state;
    return (
      <Spin spinning={loading}>
        <PageHeaderWrapper>
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <Card title="前台类目信息">
              <Form {...formItemLayout}>
                <EvenlySplitRow>
                  <Form.Item
                    style={{
                      fontWeight: 600,
                    }}
                    label="类目ID:"
                  >
                    <span
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      {this.id === 0 ? '' : this.id}
                    </span>
                  </Form.Item>
                  <Form.Item
                    style={{
                      fontWeight: 600,
                    }}
                    label="类目状态:"
                  >
                    <Button style={{ borderWidth: 0, color: '#3B99FD' }}>{this.delFlag === 0 ? '展示' : '不展示'}</Button>
                  </Form.Item>
                </EvenlySplitRow>
                <EvenlySplitRow>
                  <Form.Item
                    style={{
                      fontWeight: 600,
                    }}
                    label="类目名称:"
                  >
                    {getFieldDecorator('chineseName', {
                      initialValue: defaultInputValue,
                      rules: [{ required: true, message: '请输入类目名称' }],
                    })(
                      <Input
                        value={defaultInputValue}
                        onChange={e => {
                          this.setState({
                            defaultInputValue: e.target.value,
                          });
                        }}
                        placeholder="类目名称（必填）"
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    style={{
                      fontWeight: 600,
                    }}
                    label="类目级别:"
                  >
                    <span
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      {this.catalogLevel()}
                    </span>
                  </Form.Item>
                </EvenlySplitRow>
                <EvenlySplitRow>
                  <Form.Item
                    style={{
                      fontWeight: 600,
                    }}
                    label="叶子类目:"
                  >
                    <span
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      {this.isLeaf ? '是' : '否'}
                    </span>
                  </Form.Item>
                  <Form.Item
                    style={{
                      fontWeight: 600,
                    }}
                    label="父级类目:"
                  >
                    <span
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      {this.parenteName}
                    </span>
                  </Form.Item>
                </EvenlySplitRow>
              </Form>
            </Card>
          </div>
          <div
            style={{
              marginBottom: 60,
            }}
          >
            <Card title="关联后台类目">
              <Table
                bordered
                pagination={false}
                columns={CategoryColumns(data => {
                  this.deleteData = data;
                  if (this.id > 0 && data.change !== 2) {
                    this.deleteTipStr = '删除该后台类目会影响调用该后台类目的前台类目，是否继续操作？';
                    this.setState(() => ({ deleteVisible: true }));
                  } else {
                    this.deleteBackItem();
                  }
                })}
                dataSource={catalogDatas}
                className="table"
                style={{
                  paddingBottom: 20,
                }}
              />
              <Button
                style={{
                  height: 40,
                }}
                type="dashed"
                onClick={() => {
                  if (this.level === 1) {
                    this.loadFirstBackCatalogDatas('0', 0);
                    this.setState(() => ({ FirstVisible: true, backCatalogDatas: { 1: [], 2: [], 3: [] } }));
                  } else {
                    this.loadChildBackCatalogDatas(this.parentId);
                    this.setState(() => ({ OtherVisible: true }));
                  }
                }}
                block
              >
                + 新增关联后台类目
              </Button>

              {this.showAddFirstCategory()}
              {this.showAddOtherCategory()}
              {this.deleteCategory()}
            </Card>
          </div>

          <StickyBar
            position="bottom"
            style={{
              zIndex: 1000,
            }}
          >
            <Button
              style={{
                color: '#F5222DFF',
              }}
              hidden={!this.id > 0}
              onClick={() => {
                if (this.isLeaf) {
                  this.deleteFrontCatalog();
                } else {
                  this.deleteTipStr = '删除该前台类目其子类目一并删除,是否继续操作?';
                  this.setState(() => ({ deleteVisible: true }));
                }
              }}
            >
              删除
            </Button>
            <div
              style={{
                float: 'right',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                onClick={() => {
                  const { dispatch } = this.props;
                  dispatch(routerRedux.goBack());
                }}
                className={styles['btn-footer']}
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  this.commitData();
                }}
                className={styles['btn-footer']}
                type="primary"
              >
                提交
              </Button>
            </div>
          </StickyBar>
        </PageHeaderWrapper>
      </Spin>
    );
  }
}

const mapStateToProps = ({ addFrontCatalog }) => ({
  otherCatalogDatas: addFrontCatalog.otherCatalogDatas,
  loading: addFrontCatalog.loading,
});

export default connect(mapStateToProps)(NewCatalog);
