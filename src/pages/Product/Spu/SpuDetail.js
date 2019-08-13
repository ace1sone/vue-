import React from 'react';
import { Card, Button, Form, Input, Select, DatePicker, Row, Col, Spin, Popconfirm, InputNumber, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StickyBar from '@/components/StickyBar';
import EvenlySplitRow from '@/components/EvenlySplitRow';
import DynamicField from './container/DynamicField';
import ModalSelect from './container/ModalSelect';
import UploadAction from '@/common/UploadAction';
import TabScrollSpy from '@/common/TabScrollSpy';
import StatusToggle from '@/components/StatusToggle';
import qs from 'query-string';
import _ from 'lodash';
// import moment from 'moment';
import LinkCard from './container/LinkCard';
import InputRadio from './container/InputRadio';
import styles from './SpuDetail.less';
import catalogTable from './catalogTable.config';
import brandTable from './brandTable.config';
import {
  country as COUNTRY_SELECT,
  season as SEASON_SELECT,
  priceUnit as PRICE_UNIT_SELECT,
  skuUnit as SKU_UNIT_SELECT,
  gender as GENDER_SELECT,
  age as AGE_SELECT,
} from '@/constant/form.config';

const { Option } = Select;
const { TextArea } = Input;

// action 1修改，2查看
const SEARCH_MENU = {
  EDIT: '1',
  LOOK: '2',
};
@autobind
class SpuDetail extends React.Component {
  state = {};

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'spuForm/clearForm',
    });
  }

  linkCatalogOk = (newBackItem = {}) => {
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const backItem = getFieldValue('backItem');
    if (!backItem || backItem.id !== newBackItem.id) {
      setFieldsValue({
        spec: [],
        desc: [],
      });
    }
  };

  handleDeleteSpu = () => {
    const { dispatch, location } = this.props;
    const { id } = qs.parse(location.search);
    Modal.confirm({
      title: '是否删除该spu?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'spuForm/updateStatusSpu',
          payload: {
            spuId: id,
            delFlag: 1,
          },
        });
      },
    });
  };

  validateName = (rule, value, cb) => {
    if (!value || !value.name) {
      cb();
      return;
    }
    if (value.isChecked === undefined) {
      cb('是否为官方必选');
      return;
    }
    cb();
  };

  handleSelectBrand(value) {
    const { dispatch, form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const seriesId = getFieldValue('seriesId');
    if (seriesId !== value.id) {
      setFieldsValue({
        seriesId: undefined,
      });
      dispatch({
        type: 'spuBrands/seriesByBrandSearch',
        payload: { brandId: value.id },
      });
    }
  }

  handleBrandPaginationChange(current, size) {
    const { dispatch } = this.props;
    dispatch({
      type: 'spuBrands/fetchList',
      payload: {
        size,
        current,
      },
    });
  }

  handleBrandSearch(value) {
    const { dispatch, brands, location } = this.props;
    const { action } = qs.parse(location.search);
    const options = {
      searchWord: value,
      current: brands.current || 1,
      size: brands.size,
    };
    if (action === SEARCH_MENU.EDIT) {
      options.from = 1;
    }
    dispatch({
      type: 'spuBrands/fetchList',
      payload: options,
    });
  }

  handleCatalogSearch(value) {
    const { dispatch } = this.props;
    const options = {
      chineseName: value,
    };
    dispatch({
      type: 'platformCatalog/fetchList',
      payload: options,
    });
  }

  handleFormSubmit() {
    const { form, dispatch, location, brands } = this.props;
    const { series } = brands;
    const { action, id } = qs.parse(location.search);
    form.validateFieldsAndScroll((errors, values) => {
      console.log('errors', errors);
      console.log('values', values);
      if (errors) return;
      const { seriesId } = values;
      const findSeries = series.list.find(__ => __.id === seriesId && __.value);
      const newValues = {
        ...values,
        seriesId: findSeries ? findSeries.value : null,
        seriesEnglishName: findSeries ? findSeries.englishName : null,
      };
      if (action === SEARCH_MENU.EDIT) {
        dispatch({
          type: 'spuForm/updateSpu',
          payload: { ...newValues, id },
        });
        return;
      }
      dispatch({
        type: 'spuForm/saveSpu',
        payload: newValues,
      });
    });
  }

  render() {
    const {
      form,
      dispatch,
      brands,
      platformCatalogList,
      isCatalogLoading,
      isBrandLoading,
      formLoading,
      saveLoading,
      updateLoading,
      location,
      spuForm,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelAlign: 'left',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      colon: false,
    };

    const updloadFormItemLayout = {
      ...formItemLayout,
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const { action, id } = qs.parse(location.search);
    const isLook = action === SEARCH_MENU.LOOK;
    const isNew = !id;
    const isEdit = id && action === SEARCH_MENU.EDIT;
    // 0-启用，1-删除，3-禁用
    const { delFlag } = spuForm;
    const { series } = brands;
    const backItem = getFieldValue('backItem');

    const headerTabs = [
      {
        id: 'spuInfo', // target div id
        label: 'SPU信息',
      },
      {
        id: 'picInfo',
        label: '图片信息',
      },
      {
        id: 'spec',
        label: '关联规格',
      },
      {
        id: 'desc',
        label: '关联描述',
      },
    ];

    return (
      <PageHeaderWrapper>
        <TabScrollSpy tabs={headerTabs}>
          <Spin size="large" tip="加载中..." spinning={!!formLoading}>
            <Form {...formItemLayout}>
              <div id="spuInfo" className={styles.card}>
                <Card title="SPU信息">
                  <EvenlySplitRow>
                    <Form.Item label="SPU ID">{getFieldDecorator('id')(<Input disabled />)}</Form.Item>
                    <Form.Item label="使用状态">
                      <StatusToggle enabled={isNew ? 0 : delFlag} disabled={isLook} />
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="关联后台类目名称">
                      {getFieldDecorator('backItem')(
                        <ModalSelect
                          title="关联后台类目"
                          onSearch={this.handleCatalogSearch}
                          dataSource={catalogTable.mapDataToCols(platformCatalogList)}
                          columns={catalogTable.columns}
                          loading={isCatalogLoading}
                          onOK={this.linkCatalogOk}
                          disabled={isLook}
                          search={false}
                          modalProps={{ width: 816 }}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="关联后台类目ID">
                      <span>{backItem ? backItem.id : ''}</span>
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="品牌名（英文)">
                      {getFieldDecorator('brand')(
                        <ModalSelect
                          title="关联品牌"
                          onSearch={this.handleBrandSearch}
                          dataSource={brandTable.mapDataToCols(brands.records)}
                          columns={brandTable.columns}
                          loading={isBrandLoading}
                          onOK={this.handleSelectBrand}
                          disabled={isLook}
                          modalProps={{ width: 816 }}
                          tableProps={{
                            pagination: {
                              total: brands.total,
                              current: brands.current,
                              onChange: this.handleBrandPaginationChange,
                            },
                          }}
                        />
                      )}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="系列名称（英文)">
                      {getFieldDecorator('seriesId')(
                        <Select placeholder="系列" disabled={isLook}>
                          {series.list.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="SPU英文名(官方)">
                      {getFieldDecorator('spuEnglishName', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<Input disabled={isLook} />)}
                    </Form.Item>
                  </EvenlySplitRow>
                  {getFieldDecorator('spuSubEnglishNameItem', {
                    rules: [
                      {
                        message: '是否为官方必选',
                        validator: this.validateName,
                      },
                    ],
                  })(<InputRadio inputLabel="SPU英文名(副名)" radioLable="是否为官方名称" disabled={isLook} />)}
                  {getFieldDecorator('spuChineseNameItem', {
                    rules: [
                      {
                        message: '是否为官方必选',
                        validator: this.validateName,
                      },
                    ],
                  })(<InputRadio disabled={isLook} inputLabel="SPU中文名" radioLable="是否为官方名称" />)}
                  {getFieldDecorator('spuSubChineseNameItem', {
                    rules: [
                      {
                        message: '是否为官方必选',
                        validator: this.validateName,
                      },
                    ],
                  })(<InputRadio inputLabel="SPU中文名(副名)" radioLable="是否为官方名称" disabled={isLook} />)}
                  {getFieldDecorator('spuEnglishAlias', {})(
                    <DynamicField disabled={isLook} label="SPU英文别名" wrapper={<EvenlySplitRow />}>
                      <Input disabled={isLook} />
                    </DynamicField>
                  )}
                  {getFieldDecorator('spuChineseAlias')(
                    <DynamicField label="SPU中文别名" wrapper={<EvenlySplitRow />} disabled={isLook}>
                      <Input disabled={isLook} />
                    </DynamicField>
                  )}
                  <EvenlySplitRow>
                    <Form.Item label="产地">
                      {getFieldDecorator('place')(
                        <Select mode="multiple" placeholder="请选择" disabled={isLook}>
                          {COUNTRY_SELECT.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="发售国家">
                      {getFieldDecorator('country', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(
                        <Select
                          disabled={isLook}
                          placeholder="请选择"
                          showSearch
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {COUNTRY_SELECT.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="品牌自有款号">
                      {getFieldDecorator('sectionNumber', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<Input placeholder="英文字母、数字、符号限制" disabled={isLook} />)}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="发售季节">
                      {getFieldDecorator('saleSeason', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(
                        <Select placeholder="季节" disabled={isLook}>
                          {SEASON_SELECT.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="发售日期">
                      {getFieldDecorator('deployTime', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<DatePicker format="YYYY-MM-DD" disabled={isLook} />)}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="发售价格">
                      {getFieldDecorator('salePrice', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<InputNumber placeholder="价格" disabled={isLook} min={0} />)}
                    </Form.Item>
                    <Form.Item label="货币单位">
                      {getFieldDecorator('coinUnit', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(
                        <Select placeholder="货币单位" disabled={isLook}>
                          {PRICE_UNIT_SELECT.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="SKU单位">
                      {getFieldDecorator('skuUnit', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(
                        <Select placeholder="SKU单位" disabled={isLook}>
                          {SKU_UNIT_SELECT.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="适用人群(性别)">
                      {getFieldDecorator('salePeople', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(
                        <Select placeholder="性别" disabled={isLook}>
                          {GENDER_SELECT.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow>
                    <Form.Item label="使用人群(年龄)">
                      {getFieldDecorator('saleAge', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(
                        <Select placeholder="人群" disabled={isLook}>
                          {AGE_SELECT.map($ => (
                            <Option value={$.value} key={$.value}>
                              {$.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow minCols={1}>
                    <Form.Item label="文字介绍(中文)" {...updloadFormItemLayout}>
                      {getFieldDecorator('chineseIntroduction', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<TextArea placeholder="文字介绍" style={{ width: 380, height: 88 }} disabled={isLook} />)}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow minCols={1}>
                    <Form.Item label="文字介绍(英文)" {...updloadFormItemLayout}>
                      {getFieldDecorator('englishIntroduction')(
                        <TextArea placeholder="文字介绍" style={{ width: 380, height: 88 }} disabled={isLook} />
                      )}
                    </Form.Item>
                  </EvenlySplitRow>
                </Card>
              </div>
              <div id="picInfo" className={styles.card}>
                <Card title="图片信息" className={styles.card}>
                  <EvenlySplitRow minCols={1}>
                    <Form.Item label="SPU白底图" {...updloadFormItemLayout}>
                      {getFieldDecorator('whiteBg', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<UploadAction disabled={isLook} maxCount={1} />)}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow minCols={1}>
                    <Form.Item label="SPU海报图" {...updloadFormItemLayout}>
                      {getFieldDecorator('poster', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<UploadAction disabled={isLook} maxCount={5} />)}
                    </Form.Item>
                  </EvenlySplitRow>
                  <EvenlySplitRow minCols={1}>
                    <Form.Item label="SPU细节图" {...updloadFormItemLayout}>
                      {getFieldDecorator('detail', {
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ],
                      })(<UploadAction disabled={isLook} maxCount={5} />)}
                    </Form.Item>
                  </EvenlySplitRow>
                </Card>
              </div>
              <div id="spec" className={styles.card}>
                <Card title="关联规格">{getFieldDecorator('spec')(<LinkCard type="spec" disabled={isLook} />)}</Card>
              </div>
              <div id="desc" className={styles.card} style={{ marginBottom: 100 }}>
                <Card title="关联描述">{getFieldDecorator('desc')(<LinkCard type="desc" disabled={isLook} />)}</Card>
              </div>
            </Form>
          </Spin>
          <StickyBar position="bottom">
            <Row type="flex" justify="space-between">
              <Col>
                {isEdit && (
                  <Button type="danger" disabled={isLook} onClick={this.handleDeleteSpu}>
                    删除
                  </Button>
                )}
              </Col>
              <Col>
                {(isNew || isEdit) && (
                  <Popconfirm onConfirm={() => dispatch(routerRedux.push('/product/spu'))} title="是否取消？">
                    <Button className={styles['btn-footer']}>取消</Button>
                  </Popconfirm>
                )}
                {(isNew || isEdit) && (
                  <Button
                    className={styles['btn-footer']}
                    type="primary"
                    onClick={this.handleFormSubmit}
                    disabled={isLook}
                    loading={saveLoading || updateLoading}
                  >
                    保存
                  </Button>
                )}
                {isLook && (
                  <Button
                    className={styles['btn-footer']}
                    onClick={() => {
                      dispatch(routerRedux.goBack());
                    }}
                  >
                    返回
                  </Button>
                )}
              </Col>
            </Row>
          </StickyBar>
        </TabScrollSpy>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ spuForm, platformCatalog, spuBrands, loading }) => ({
  spuForm,
  brands: spuBrands,
  platformCatalogList: platformCatalog.records,
  isCatalogLoading: loading.models.platformCatalog,
  isBrandLoading: loading.models.spuBrands,
  formLoading: loading.effects['spuForm/getSpu'],
  saveLoading: loading.effects['spuForm/saveSpu'],
  updateLoading: loading.effects['spuForm/updateSpu'],
  catalogId: spuForm.catalogId,
});

const createField = fieldValue => Form.createFormField({ value: fieldValue });

const mapPropsToFields = ({ spuForm }) => Object.keys(spuForm).reduce((pre, curr) => ({ ...pre, [curr]: createField(spuForm[curr]) }), {});

const onValuesChange = (props, changedValues, allValues) => {
  const { dispatch } = props;
  if (!_.isEmpty(changedValues)) {
    dispatch({
      type: 'spuForm/updateForm',
      payload: {
        ...allValues,
        ...changedValues,
      },
    });
  }
};

export default connect(mapStateToProps)(
  Form.create({
    name: 'spu_detail',
    onValuesChange,
    mapPropsToFields,
  })(SpuDetail)
);
