import React from 'react';
import { Menu, Card, Icon, Button, Form, Modal, Input, Select, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EvenlySplitRow from '@/components/EvenlySplitRow';
import UploadAction from '@/common/UploadAction';
import TabScrollSpy from '@/common/TabScrollSpy';

import { COUNTRY_SELECT } from '../../Spu/spuForm.config';
import { isRepeat } from '@/utils/utils';

import TableForm from './TableForm';

import DynamicInput from './DynamicInput';
import styles from './brandform.less';

const { Option } = Select;
const { TextArea } = Input;

class BrandForm extends React.Component {
  state = {
    width: '100%',
    allBrands: [],
  };

  englishInput = null;

  tableform = [];

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    this.searchAllBrands();

    if (!_.isEmpty(params.id)) {
      dispatch({
        type: 'brandDetail/brandDetail',
        payload: {
          brandId: params.id,
        },
      });
    }
    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'brandDetail/clearDetail',
    });
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  searchAllBrands = async () => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'brandDetail/searchAllBrands',
    });
    if (res.data && res.header.code === 2000) {
      this.setState({ allBrands: res.data });
    }
  };

  hasRepeat = (arr = []) => {
    if (_.isEmpty(arr)) return false;
    return isRepeat(arr.map(ele => ele.jointName));
  };

  validate = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    let hasError = false;

    validateFields((error, values) => {
      const allval = values;
      const seriesEnames = [];

      console.log('this.tableform', this.tableform);

      if (this.tableform.length === 0) {
        message.error('系列不能为空,请添加系列');
        hasError = true;
      }

      this.tableform
        .filter(ele => ele)
        .forEach((item, i) => {
          console.log(item);
          const englishNames = item.props.form.getFieldValue('englishNames');
          allval.seriesDTOList[i] = item.props.form.getFieldsValue();

          if (allval.seriesDTOList[i].isJoint === 0) {
            if (allval.seriesDTOList[i].jointList.some(item2 => !item2.jointId || !item2.jointName)) {
              message.error('联名品牌不能为空');
              hasError = true;
            }
            if (this.hasRepeat(allval.seriesDTOList[i].jointList)) {
              message.error('系列的联名品牌重复');
              hasError = true;
            }
          }

          if (!_.isEmpty(englishNames[0]) && englishNames[0].name) {
            seriesEnames.push(englishNames[0].name);
          }

          item.props.form.validateFields(err => {
            if (err) hasError = true;
          });

          // 检查子form英文名
          item.englishSeriesInput.instances['items[0]'].validateFields(err => {
            if (err) hasError = true;
          });
        });

      // 检查系列英文名重复
      if (isRepeat(seriesEnames)) {
        message.error('系列的第一个英文名重复');
        hasError = true;
      }

      // 检查英文名
      this.englishInput.instances['items[0]'].validateFields(err => {
        if (err) hasError = true;
      });

      console.log('表单检查的全部字段', allval);
      if (!error && !hasError) {
        const {
          match: { params },
        } = this.props;
        if (!_.isEmpty(params.id) && allval.id > 0) {
          dispatch({ type: 'brandDetail/brandModify', payload: allval, success: res => {
              console.log(res);
              if (res.header.msg === '4050') {
                Modal.confirm({
                  icon: <Icon type="close-circle" style={{ color: '#F5222D' }} />,
                  title: '警告',
                  content: '该品牌已关联多个SPU请在无关联的前提下进行修改操作。',
                  okText: '下载关联SPU列表',
                  cancelText: '知道了',
                  onOk: async () => {
                    await dispatch({
                      type: 'brandDetail/brandSpuDownload',
                      payload: {
                        jointId: params.id,
                        type: 3,
                      },
                    });
                  },
                });
                return;
              }
              if (res.header.code === 2000) this.goBack();
            } });
        } else {
          dispatch({
            type: 'brandDetail/brandSave',
            payload: allval,
            success: res => {
              if (res.header.code === 2000) this.goBack();
            },
          });
        }
      }
    });
  };

  goBack = () => {
    router.goBack();
  };

  // 动态form增加
  addSeries = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([
      {
        seriesId: '',
        chineseNames: [],
        englishNames: [],
        contacters: [],
        designers: [],
        shortName: [],
        englishAlias: [],
        chineseAlias: [],
        status: '',
        isJoint: 1,
        jointList: [],
        seriesAttachList: [],
        seriesShowList: [],
        delFlag: 0,
      },
    ]);

    form.setFieldsValue({
      keys: nextKeys,
      seriesCount: nextKeys.filter(ele => ele.delFlag !== 1).length,
    });
  };

  // 动态form删除
  removeSeries = i => {
    const {
      form,
      match: { params },
    } = this.props;

    // this.tableform = this.tableform.filter((ele, idx) => idx !== i);
    const keys = form.getFieldValue('keys');
    const seriesDTOList = form.getFieldValue('seriesDTOList');
    const deleteSeriesIds = form.getFieldValue('deleteSeriesIds');

    if (keys.length === 1) return;

    if (!_.isEmpty(params.id) && keys[i].id > 0) {
      deleteSeriesIds.push(keys[i].id);
    }

    const nextKeys = keys.filter((key, idx) => idx !== i);
    const seriesDTOLists = seriesDTOList.filter((key, idx) => idx !== i);

    form.setFieldsValue({
      deleteSeriesIds,
      keys: nextKeys,
      seriesDTOList: seriesDTOLists,
      seriesCount: nextKeys.length,
    });
  };

  delete = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    Modal.confirm({
      title: '确定删除该品牌吗?',
      onOk: () => {
        dispatch({
          type: 'brandDetail/brandDelete',
          payload: {
            proBrandDTO: {
              id: params.id,
              delFlag: 1,
              isModifyName: false,
            },
          },
          success: res => {
            if (res.header.code === 4050) {
              Modal.confirm({
                icon: <Icon type="close-circle" style={{ color: '#F5222D' }} />,
                title: '警告',
                content: '该品牌已关联多个SPU请在无关联的前提下进行删除操作。',
                okText: '下载关联SPU列表',
                cancelText: '知道了',
                onOk: async () => {
                  await dispatch({
                    type: 'brandDetail/brandSpuDownload',
                    payload: {
                      jointId: params.id,
                      type: 3,
                    },
                  });
                },
              });
              return;
            }

            if (res.header.code === 2000) this.goBack();
          },
        });
      },
    });
  };

  render() {
    const {
      form,
      dispatch,
      match: { params },
      submitting,
      submitting2,
    } = this.props;

    const { getFieldDecorator, getFieldValue } = form;

    const { width, allBrands } = this.state;

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

    // 动态生成tableform
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');

    // 动态生成删除系列的id字段
    getFieldDecorator('deleteSeriesIds', { initialValue: [] });

    const seriesForms = keys.map((k, i) => (
      <div key={k.seriesId || i} style={{ background: '#f9f9f9', marginBottom: 20, padding: 10, position: 'relative' }}>
        {keys.filter(ele => ele.delFlag !== 1).length > 1 ? (
          <Button style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => this.removeSeries(i)}>
            删除
          </Button>
        ) : null}
        {getFieldDecorator(`seriesDTOList[${i}]`, {
          initialValue: k || { seriesAttachList: [], seriesShowList: [] },
        })(
          <TableForm
            index={i}
            dispatch={dispatch}
            allBrands={allBrands}
            wrappedComponentRef={ele => {
              this.tableform[i] = ele;
            }}
          />
        )}
      </div>
    ));

    const headerTabs = [
      {
        id: 'brandInfo',
        label: '品牌信息',
      },
      {
        id: 'picInfo',
        label: 'Logo管理',
      },
      {
        id: 'showmgmt',
        label: '展示管理',
      },
      {
        id: 'series',
        label: '系列管理',
      },
    ];

    return (
      <PageHeaderWrapper>
        <TabScrollSpy tabs={headerTabs}>
          <Form {...formItemLayout}>
            <div id="brandInfo" className={styles.card}>
              <Card title="品牌信息">
                <EvenlySplitRow>
                  <Form.Item label="品牌ID">
                    {getFieldDecorator('id', {
                      initialValue: params.id || '',
                    })(<Input disabled />)}
                  </Form.Item>
                  <Form.Item label="使用状态">
                    {getFieldDecorator('delFlag', {
                      rules: [{ required: true, message: '请选择状态' }],
                    })(
                      <Select placeholder="请选择状态" disabled>
                        <Option value={0}>启用</Option>
                        <Option value={3}>禁用</Option>
                      </Select>
                    )}
                  </Form.Item>
                </EvenlySplitRow>

                <div>
                  {getFieldDecorator('englishName')(
                    <DynamicInput
                      ref={ele => {
                        this.englishInput = ele;
                      }}
                      label="品牌名称（英文）："
                      placeholder="请输入品牌名称（英文）"
                      basic={{
                        fieldCode: '1',
                        fieldName: '名称_英文',
                      }}
                      options={{
                        required: true,
                        rules: [
                          {
                            required: true,
                            message: '品牌名称不能为空',
                          },
                        ],
                      }}
                    />
                  )}
                </div>

                <div>
                  {getFieldDecorator('chineseName')(
                    <DynamicInput
                      label="品牌名称（中文）："
                      placeholder="请输入品牌名称（中文）"
                      basic={{
                        fieldCode: '2',
                        fieldName: '名称_中文',
                      }}
                    />
                  )}
                </div>

                <div>
                  {getFieldDecorator('englishAlias')(
                    <DynamicInput
                      label="品牌别名（英文）："
                      placeholder="请输入品牌别名（英文）"
                      basic={{
                        fieldCode: '3',
                        fieldName: '别名_英文',
                      }}
                    />
                  )}
                </div>

                <div>
                  {getFieldDecorator('chineseAlias')(
                    <DynamicInput
                      label="品牌别名（中文）："
                      placeholder="请输入品牌别名（中文）"
                      basic={{
                        fieldCode: '4',
                        fieldName: '别名_中文',
                      }}
                    />
                  )}
                </div>

                <div>
                  {getFieldDecorator('shortName')(
                    <DynamicInput
                      label="品牌简称："
                      placeholder="请输入品牌简称"
                      basic={{
                        fieldCode: '5',
                        fieldName: '简称',
                      }}
                    />
                  )}
                </div>

                <div>
                  {getFieldDecorator('contacter')(
                    <DynamicInput
                      label="主理人/相关人："
                      placeholder="请输入主理人/相关人"
                      official={false}
                      basic={{
                        fieldCode: '6',
                        fieldName: '相关人',
                      }}
                    />
                  )}
                </div>

                <div>
                  {getFieldDecorator('designer')(
                    <DynamicInput
                      label="设计师："
                      placeholder="请输入设计师"
                      official={false}
                      basic={{
                        fieldCode: '7',
                        fieldName: '设计师',
                      }}
                    />
                  )}
                </div>

                <EvenlySplitRow>
                  <Form.Item label="所属国家">
                    {getFieldDecorator('country')(
                      <Select
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
                  <Form.Item label="系列数">{getFieldDecorator('seriesCount')(<Input disabled />)}</Form.Item>
                </EvenlySplitRow>
                <EvenlySplitRow minCols={1}>
                  <Form.Item label="简介：" {...updloadFormItemLayout}>
                    {getFieldDecorator('desc')(<TextArea placeholder="请输入简介" style={{ width: 480, height: 88 }} />)}
                  </Form.Item>
                </EvenlySplitRow>
              </Card>
            </div>
            <div id="picInfo" className={styles.card}>
              <Card title="Logo管理" className={styles.card}>
                <EvenlySplitRow minCols={1}>
                  <Form.Item label="Logo大图" {...updloadFormItemLayout}>
                    {getFieldDecorator('big_logo', {
                      rules: [{ required: true, message: '图片不能为空' }],
                    })(<UploadAction />)}
                  </Form.Item>
                </EvenlySplitRow>

                <EvenlySplitRow minCols={1}>
                  <Form.Item label="Logo白底图" {...updloadFormItemLayout}>
                    {getFieldDecorator('blank_log', {
                      rules: [{ required: true, message: '图片不能为空' }],
                    })(<UploadAction />)}
                  </Form.Item>
                </EvenlySplitRow>

                <EvenlySplitRow minCols={1}>
                  <Form.Item label="其他" {...updloadFormItemLayout}>
                    {getFieldDecorator('other')(<UploadAction />)}
                  </Form.Item>
                </EvenlySplitRow>
              </Card>
            </div>

            <div id="showmgmt">
              <Card title="展示管理" className={styles.card}>
                <EvenlySplitRow minCols={1}>
                  <Form.Item label="海报" {...updloadFormItemLayout}>
                    {getFieldDecorator('poster')(<UploadAction />)}
                  </Form.Item>
                </EvenlySplitRow>

                <EvenlySplitRow minCols={1}>
                  <Form.Item label="视频" {...updloadFormItemLayout}>
                    {getFieldDecorator('video')(<UploadAction supportTypes={['video/mp4']} maxSize={1024 * 1024 * 10} timeout={60000} />)}
                  </Form.Item>
                </EvenlySplitRow>
              </Card>
            </div>
            <div id="series">
              <Card title="系列管理" bordered={false}>
                {seriesForms}
              </Card>

              <Button
                style={{ width: '100%', marginTop: 26, color: '#FAAD14', background: '#FFFBE6', border: '1px solid #FAAD14', marginBottom: 68 }}
                onClick={this.addSeries}
                icon="plus"
              >
                新增系列
              </Button>
            </div>
          </Form>
        </TabScrollSpy>
        <FooterToolbar
          style={{ width }}
          extra={
            !_.isEmpty(params.id) ? (
              <Button type="danger" onClick={() => this.delete()} style={{ marginRight: 'auto' }}>
                删除
              </Button>
            ) : null
          }
        >
          <Button onClick={() => this.goBack()}>取消</Button>
          <Button type="primary" onClick={this.validate} loading={params.id > 0 ? submitting2 : submitting}>
            保存
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

// export default connect(({ brand, loading }) => ({
//   brand,
//   submitting: loading.effects['brand/save'],
// }))(BrandForm);

const mapStateToProps = ({ brandDetail, loading }) => ({
  brandDetail,
  submitting: loading.effects['brandDetail/brandSave'],
  submitting2: loading.effects['brandDetail/brandModify'],
});

const createField = fieldValue => Form.createFormField({ value: fieldValue });

const mapPropsToFields = ({ brandDetail }) =>
  Object.keys(brandDetail).reduce((pre, curr) => ({ ...pre, [curr]: createField(brandDetail[curr]) }), {});

const onValuesChange = (props, changedValues, allValues) => {
  console.log(allValues);
  const { dispatch } = props;
  dispatch({
    type: 'brandDetail/updateForm',
    payload: allValues,
  });
};

export default connect(mapStateToProps)(
  Form.create({
    name: 'BrandForm',
    onValuesChange,
    mapPropsToFields,
  })(BrandForm)
);
