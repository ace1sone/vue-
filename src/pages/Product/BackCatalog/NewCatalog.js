import React from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Table, Row, Col, Radio, Modal, Alert, Spin } from 'antd';
import StickyBar from '@/components/StickyBar';
import _ from 'lodash';
import qs from 'query-string';
import { routerRedux } from 'dva/router';
import EvenlySplitRow from '@/components/EvenlySplitRow';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { autobind } from 'core-decorators';
import styles from './NewCatalog.less';
import { backNewCategoryColumns, bgAddColumns } from '../FrontCatalog/newCatalog.config';
import { inject } from '@/config';
import TabScrollSpy from '@/common/TabScrollSpy';

const { Search } = Input;

@autobind
@Form.create()
class NewCatalog extends React.Component {
  storeService = inject('storeService');

  allSpecOrDescDatas = [];

  specAllDatas = [];

  descAllDatas = [];

  searchKey = '';

  formItemLayout = {
    labelAlign: 'left',
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    colon: true,
  };

  superSpecDatas = {
    spec: [],
    desc: [],
    brand: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      specModal: false,
      descModel: false,
      deleteVisible: false,
      specDatas: [],
      descDatas: [],
      brandAttributeId: 1,
      defaultInputValue: '',
    };
  }

  componentDidMount() {
    const { location, dispatch } = this.props;

    dispatch({
      type: 'addBackCatalog/cleanDatas',
    });
    const { id } = qs.parse(location.search);
    this.isEnd = 0;
    this.status = 0;
    if (id) {
      this.loadCatalogDetail(id);
    } else {
      this.parentCatalog = this.storeService.getTemp('fcn_parentCatalog');
      this.topClassId = this.storeService.getTemp('fcn_topClassId');
      // console.log(this.parentCatalog, this.topClassId);
      this.level = 1;
      this.parenteID = 0;
      if (this.parentCatalog) {
        // this.parentForeNo = this.parentCatalog.foreNo;
        this.level = this.parentCatalog.level + 1;
        this.parenteName = this.parentCatalog.name;
        this.parenteID = this.parentCatalog.id;
      }
      this.loadParAttrisData();
    }
  }

  loadCatalogDetail = async Id => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'addBackCatalog/backCatalogDetail',
      payload: {
        id: Id,
      },
    });
    this.level = 1;
    this.parenteID = 0;
    this.id = Id;
    if (res.data) {
      //
      this.isEnd = res.data.isEnd;
      this.status = res.data.status;
      this.topClassId = res.data.topClassId;
      this.level = res.data.level;
      this.parenteName = res.data.name;
      this.parenteID = res.data.parentClassId;
      this.superSpecDatas = res.data.parAttList;
      this.setState(() => ({
        brandAttributeId: res.data.isBrandByPar,
        defaultInputValue: res.data.name,
        specDatas: res.data.attList.spec || [],
        descDatas: res.data.attList.desc || [],
      }));
      this.specAllDatas = res.data.attList.spec ? [...res.data.attList.spec] : [];
      this.descAllDatas = res.data.attList.desc ? [...res.data.attList.desc] : [];
      this.forceUpdate();
    }
  };

  loadParAttrisData = async () => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'addBackCatalog/fetchParAttrisData',
      payload: { req: this.parenteID },
    });
    this.superSpecDatas = res.data;
    this.forceUpdate();
  };

  loadSpec = async type => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'addBackCatalog/fetchSpec',
      payload: { id: this.parenteID, type },
    });
    this.allSpecOrDescDatas = res.data;
    this.forceUpdate();
  };

  handleCancel = () => {
    this.setState(() => ({ specModal: false, descModel: false, deleteVisible: false }));

    this.allSpecOrDescDatas = [];
  };

  showAddSpec = () => {
    const { specModal, specDatas } = this.state;
    return (
      <Modal title="新增关联规格" visible={specModal} onOk={this.handleCancel} centered width={816} maskClosable={false} onCancel={this.handleCancel}>
        <div
          style={{
            height: 312,
          }}
        >
          <div>
            <Search
              placeholder="请输入规格ID或规格名称"
              onSearch={value => {
                this.searchKey = value;
                this.forceUpdate();
              }}
              enterButton
              style={{ width: 300 }}
              allowClear
            />
            {/* <Button
              onClick={() => {
                this.searchKey = '';
                this.forceUpdate();
              }}
              type="default"
              style={{ marginLeft: 24 }}
            >
              清空
            </Button> */}
          </div>

          <div
            style={{
              marginTop: 20,
            }}
          >
            <Table
              size="small"
              bordered
              pagination={false}
              columns={bgAddColumns('序号', '规格ID', '规格名称(中文)', '规格名称(英文)', '规格标准数量', specDatas, data => {
                // console.log(data);
                const newData = data;
                newData.change = 2;
                this.specAllDatas.push(newData);

                const { specDatas: oldspec } = this.state;
                oldspec.push(data);
                this.setState({
                  specDatas: oldspec,
                });
              })}
              dataSource={this.allSpecOrDescDatas.filter(
                item => item.id.toString() === this.searchKey || item.name === this.searchKey || !this.searchKey
              )}
              scroll={{ y: 224 }}
            />
          </div>
        </div>
      </Modal>
    );
  };

  showAddDesc = () => {
    const { descModel, descDatas } = this.state;
    return (
      <Modal title="新增关联描述" visible={descModel} onOk={this.handleCancel} centered width={816} maskClosable={false} onCancel={this.handleCancel}>
        <div
          style={{
            height: 312,
          }}
        >
          <Search
            placeholder="请输入描述ID或描述名称"
            onSearch={value => {
              this.searchKey = value;
              this.forceUpdate();
            }}
            enterButton
            style={{ width: 300 }}
            allowClear
          />
          {/* <Button
            onClick={() => {
              this.searchKey = '';
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
            }}
          >
            <Table
              size="small"
              bordered
              pagination={false}
              columns={bgAddColumns('序号', '描述ID', '描述名称', null, '描述子属性数量', descDatas, data => {
                // console.log(data);
                const newData = data;
                newData.change = 2;
                this.descAllDatas.push(newData);

                const { descDatas: olddesc } = this.state;
                olddesc.push(data);
                this.setState({
                  descDatas: olddesc,
                });
              })}
              dataSource={this.allSpecOrDescDatas.filter(
                item => item.id.toString() === this.searchKey || item.name === this.searchKey || !this.searchKey
              )}
              scroll={{ y: 224 }}
            />
          </div>
        </div>
      </Modal>
    );
  };

  deleteModal = () => {
    const { deleteVisible } = this.state;
    return (
      <Modal
        title={false}
        afterClose={() => {
          this.deleteCatalog = false;
          if (this.delete) {
            this.check = false;
            this.delete = false;
            this.deleteCatalog = true;
            this.checkForeById();
          } else if (this.again) {
            this.again = false;
            this.deleteBackCatalog();
          }
        }}
        destroyOnClose
        visible={deleteVisible}
        onOk={() => {
          if (this.deleteCatalog) {
            if (this.check === false) {
              this.again = true;
            } else {
              this.delete = true;
            }
          } else {
            const { dispatch } = this.props;
            dispatch({
              type: 'addBackCatalog/downSpu',
              payload: { id: this.id },
            });
          }
          this.handleCancel();
        }}
        centered
        width={437}
        maskClosable={false}
        onCancel={this.handleCancel}
        okText={this.deleteCatalog ? '确定' : '下载关联SPU列表'}
      >
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
          {this.deleteTip}
        </p>
      </Modal>
    );
  };

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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

  commitData = () => {
    const { brandAttributeId, defaultInputValue } = this.state;
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    const nameInputValue = _.trim(defaultInputValue);
    if (nameInputValue === '' || nameInputValue === undefined || nameInputValue == null) {
      // message.error('请输入类目名称');
      validateFieldsAndScroll(() => {});
      return;
    }
    const { dispatch } = this.props;

    const spec = [];
    const TempSpecAllDatas = this.specAllDatas.filter(item => item.change);

    TempSpecAllDatas.map(item =>
      item.change === 1
        ? spec.push({ id: item.id, attributeId: item.attributeId, type: 1, name: item.name, delFlag: 1 })
        : spec.push({ attributeId: item.id, type: 1, name: item.name })
    );

    const desc = [];
    const TempDescAllDatas = this.descAllDatas.filter(item => item.change);

    TempDescAllDatas.map(item =>
      item.change === 1
        ? desc.push({ id: item.id, attributeId: item.attributeId, type: 2, name: item.name, delFlag: 1 })
        : desc.push({ attributeId: item.id, type: 2, name: item.name })
    );

    const param = {
      attList: {
        spec,
        desc,
        brand: [{ attributeId: brandAttributeId, type: 3, name: brandAttributeId === 0 ? '否' : '是' }],
      },
      delFlag: 0,
      level: this.level,
      name: nameInputValue,
      parentClassId: this.parenteID,
    };
    if (this.id) {
      const key = 'id';
      param[key] = this.id;
    }
    dispatch({
      type: 'addBackCatalog/addCatalog',
      payload: param,
    });
  };

  parentInfo = (title, columns, dataSource) => (
    <div style={{ backgroundColor: '#0000000A', padding: 20 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#000000FF' }}>{title}</p>
      <Table size="small" bordered pagination={false} columns={columns} dataSource={dataSource} />
    </div>
  );

  checkForeById = async () => {
    if (this.id) {
      const { dispatch } = this.props;
      const res = await dispatch({
        type: 'addBackCatalog/checkForeByClassId',
        payload: { id: this.id },
      });
      if (!res.data.status) {
        this.deleteTip = '删除该后台类目会直接影响前端页面展示,是否继续操作?';
        this.setState(() => ({ deleteVisible: true }));
      } else {
        this.deleteBackCatalog();
      }
    }
  };

  deleteBackCatalog = async () => {
    const { dispatch } = this.props;
    const deleteRes = await dispatch({
      type: 'addBackCatalog/delCatalog',
      payload: { id: this.id, delFlag: 1 },
    });
    if (deleteRes.data) {
      dispatch(routerRedux.goBack());
    } else {
      this.deleteTip = deleteRes;
      this.setState(() => ({ deleteVisible: true }));
    }
  };

  checkSpec = async data => {
    if (!data.change && data.change !== 2) {
      const { dispatch } = this.props;
      const res = await dispatch({
        type: 'addBackCatalog/checkSpuByBackClass',
        payload: { classId: this.id, jointId: data.attributeId, type: 1 },
      });
      if (!res.data.status) {
        this.deleteTip = '该规格已关联N个SPU请在无关联的前提下进行删除操作。';
        this.setState(() => ({ deleteVisible: true }));
      } else {
        this.deleteSpec(data);
      }
    } else {
      this.deleteSpec(data);
    }
  };

  deleteSpec = data => {
    const tempSpecAllDatas = this.specAllDatas.filter(item => !(item.change === 2 && item.id === data.id));
    const newSpecAllDatas = tempSpecAllDatas.map(item => {
      const newItem = item;
      if (newItem.id === data.id) {
        newItem.delFlag = 1;
        newItem.change = 1;
      }
      return newItem;
    });
    this.specAllDatas = newSpecAllDatas;

    const { specDatas: oldDatas } = this.state;
    const filterDatas = oldDatas.filter(item => item.id !== data.id);
    this.setState({
      specDatas: filterDatas,
    });
  };

  checkDesc = async data => {
    if (!data.change && data.change !== 2) {
      const { dispatch } = this.props;
      const res = await dispatch({
        type: 'addBackCatalog/checkSpu',
        payload: { jointId: data.attributeId, type: 2 },
      });
      if (!res.data.status) {
        this.deleteTip = '该描述已关联N个SPU请在无关联的前提下进行删除操作。';
        this.setState(() => ({ deleteVisible: true }));
      } else {
        this.deleteDesc(data);
      }
    } else {
      this.deleteDesc(data);
    }
  };

  deleteDesc = data => {
    const tempDescAllDatas = this.descAllDatas.filter(item => !(item.change === 2 && item.id === data.id));
    const newDescAllDatas = tempDescAllDatas.map(item => {
      const newItem = item;
      if (newItem.id === data.id) {
        newItem.delFlag = 1;
        newItem.change = 1;
      }
      return newItem;
    });
    this.descAllDatas = newDescAllDatas;

    const { descDatas: oldDatas } = this.state;
    const filterDatas = oldDatas.filter(item => item.id !== data.id);
    this.setState({
      descDatas: filterDatas,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
    } = this.props;
    const { spec, desc } = this.superSpecDatas;
    const { specDatas, descDatas, brandAttributeId, defaultInputValue } = this.state;
    // eslint-disable-next-line
    const statusText = this.status === 2 ? '冻结' : this.status === 0 ? '启用' : '禁用';
    const statusStyle = this.status === 2 ? { borderWidth: 0, color: '#0000003F' } : { borderWidth: 0, color: '#3B99FD' };

    const headerTabs = [
      {
        id: 'catalogInfo', // target div id
        label: '类目信息',
      },
      {
        id: 'connectSpec',
        label: '关联规格',
      },
      {
        id: 'connectDesc',
        label: '关联描述',
      },
      {
        id: 'connectBrand',
        label: '关联品牌',
      },
    ];

    return (
      <Spin spinning={loading}>
        <PageHeaderWrapper>
          <TabScrollSpy tabs={headerTabs}>
            <Form {...this.formItemLayout}>
              <div
                id="catalogInfo"
                style={{
                  marginBottom: 20,
                }}
              >
                <Card title="后台类目信息">
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
                        {this.id}
                      </span>
                    </Form.Item>
                    <Form.Item
                      style={{
                        fontWeight: 600,
                      }}
                      label="类目状态:"
                    >
                      <Button style={statusStyle}>{statusText}</Button>
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item
                      style={{
                        fontWeight: 600,
                        marginLeft: -15,
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
                        {this.isEnd === 0 ? '是' : '否'}
                      </span>
                    </Form.Item>
                    {/* <Form.Item label="父级类目:">{this.topForeName}</Form.Item> */}
                  </EvenlySplitRow>
                </Card>
              </div>
              <div
                id="connectSpec"
                style={{
                  marginBottom: 20,
                }}
              >
                <Card title="关联规格">
                  {this.level > 1 ? this.parentInfo('父类目继承规格', backNewCategoryColumns('规格名称:', '规格ID', null), spec) : null}
                  <div style={{ padding: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#000000FF' }}>关联规格</p>
                    <Table
                      size="middle"
                      bordered
                      pagination={false}
                      columns={backNewCategoryColumns('规格名称:', '规格ID', null, data => {
                        this.checkSpec(data);
                      })}
                      dataSource={specDatas}
                    />
                    {this.deleteModal()}
                    <Button
                      style={{
                        marginTop: 20,
                        height: 40,
                      }}
                      type="dashed"
                      onClick={() => {
                        this.loadSpec(1);
                        this.setState(() => ({ specModal: true }));
                      }}
                      block
                    >
                      + 新增关联规格
                    </Button>
                    {this.showAddSpec()}
                  </div>
                </Card>
              </div>
              <div
                id="connectDesc"
                style={{
                  marginBottom: 20,
                }}
              >
                <Card title="关联描述">
                  {this.level > 1 ? this.parentInfo('父类目继承描述', backNewCategoryColumns('描述名称:', '描述ID', null), desc) : null}
                  <div style={{ padding: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#000000FF' }}>关联描述</p>
                    <Table
                      size="middle"
                      bordered
                      pagination={false}
                      columns={backNewCategoryColumns('描述名称:', '描述ID', null, data => {
                        // this.checkDesc(data);
                        this.deleteDesc(data);
                      })}
                      dataSource={descDatas}
                    />
                    <Button
                      style={{
                        marginTop: 20,
                        height: 40,
                      }}
                      type="dashed"
                      onClick={() => {
                        this.loadSpec(2);
                        this.setState(() => ({ descModel: true }));
                      }}
                      block
                    >
                      + 新增关联描述
                    </Button>
                    {this.showAddDesc()}
                  </div>
                </Card>
              </div>
              <div
                id="connectBrand"
                style={{
                  marginBottom: 60,
                }}
              >
                <Card title="关联品牌">
                  <Row gutter={24}>
                    <Col lg={16} md={20} sm={24}>
                      <Form.Item label="是否关联品牌">
                        <Radio.Group
                          disabled={this.level !== 1}
                          style={{ marginLeft: 20 }}
                          value={brandAttributeId}
                          onChange={e => {
                            this.setState({
                              brandAttributeId: e.target.value,
                            });
                          }}
                        >
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Form>
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
                  if (this.isEnd === 1) {
                    this.deleteTip = '删除该后台类目其子类目一并删除,是否继续操作?';
                    this.deleteCatalog = true;
                    this.check = true;
                    this.setState(() => ({ deleteVisible: true }));
                  } else {
                    this.deleteCatalog = true;
                    this.checkForeById();
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
          </TabScrollSpy>
        </PageHeaderWrapper>
      </Spin>
    );
  }
}

const mapStateToProps = ({ addBackCatalog }) => ({
  loading: addBackCatalog.loading,
});

export default connect(mapStateToProps)(NewCatalog);
