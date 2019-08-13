import React from 'react';
import { Menu, Card, Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EvenlySplitRow from '@/components/EvenlySplitRow';

import { COUNTRY_SELECT } from '../../Spu/spuForm.config';

import TableDetail from './TableDetail';
import ImageList from './ImageList';

import DynamicText from './DynamicText';
import styles from './brandform.less';

const { Option } = Select;
const { TextArea } = Input;

class BrandDetail extends React.Component {
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

  goBack = () => {
    router.goBack();
  };

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  render() {
    const {
      form,
      dispatch,
      match: { params },
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
    getFieldDecorator('keys', {
      initialValue: [],
    });
    const keys = getFieldValue('keys');
    const seriesForms = keys.map((k, i) => (
      <div
        key={k.seriesId || i}
        style={{ background: '#f9f9f9', marginBottom: 20, padding: 10, position: 'relative' }}
      >
        {getFieldDecorator(`seriesDTOList[${i}]`, {
          initialValue: k || { seriesAttachList: [], seriesShowList: [] },
        })(
          <TableDetail
            index={i}
            dispatch={dispatch}
            allBrands={allBrands}
            ref={ele => {
              this.tableform[i] = ele;
            }}
          />
        )}
      </div>
    ));

    return (
      <PageHeaderWrapper>
        <Menu mode="horizontal" selectable defaultSelectedKeys={['spuInfo']} onClick={this.handleMenuClick} style={{ marginBottom: 20 }}>
          <Menu.Item key="brandInfo">品牌信息</Menu.Item>
          <Menu.Item key="picInfo">Logo管理</Menu.Item>
          <Menu.Item key="showmgmt">展示管理</Menu.Item>
          <Menu.Item key="series">系列管理</Menu.Item>
        </Menu>
        <Form {...formItemLayout}>
          <div id="brandInfo" className={styles.card}>
            <Card title="品牌信息">
              <EvenlySplitRow>
                <Form.Item label="品牌ID">{getFieldDecorator('id')(<Input readOnly className={styles.nobordInput} />)}</Form.Item>
                <Form.Item label="使用状态">{getFieldDecorator('delFlagStr')(<Input readOnly className={styles.nobordInput} />)}</Form.Item>
              </EvenlySplitRow>

              <div>
                {getFieldDecorator('englishName')(
                  <DynamicText
                    ref={ele => {
                      this.englishInput = ele;
                    }}
                    label="品牌名称（英文）："
                    placeholder="请输入品牌名称（英文）"
                    basic={{ fieldCode: '1', fieldName: '名称_英文' }}
                    options={{ required: true, rules: [{ required: true, message: '品牌名称不能为空' }] }}
                  />
                )}
              </div>

              <div>
                {getFieldDecorator('chineseName')(
                  <DynamicText label="品牌名称（中文）：" placeholder="请输入品牌名称（中文）" basic={{ fieldCode: '2', fieldName: '名称_中文' }} />
                )}
              </div>

              <div>
                {getFieldDecorator('englishAlias')(
                  <DynamicText label="品牌别名（英文）：" placeholder="请输入品牌别名（英文）" basic={{ fieldCode: '3', fieldName: '别名_英文' }} />
                )}
              </div>

              <div>
                {getFieldDecorator('chineseAlias')(
                  <DynamicText label="品牌别名（中文）：" placeholder="请输入品牌别名（中文）" basic={{ fieldCode: '4', fieldName: '别名_中文' }} />
                )}
              </div>

              <div>
                {getFieldDecorator('shortName')(
                  <DynamicText label="品牌简称：" placeholder="请输入品牌简称" basic={{ fieldCode: '5', fieldName: '简称' }} />
                )}
              </div>

              <div>
                {getFieldDecorator('contacter')(
                  <DynamicText
                    label="主理人/相关人："
                    placeholder="请输入主理人/相关人"
                    official={false}
                    basic={{ fieldCode: '6', fieldName: '相关人' }}
                  />
                )}
              </div>

              <div>
                {getFieldDecorator('designer')(
                  <DynamicText label="设计师：" placeholder="请输入设计师" official={false} basic={{ fieldCode: '7', fieldName: '设计师' }} />
                )}
              </div>

              <EvenlySplitRow>
                <Form.Item label="所属国家">
                  {getFieldDecorator('country')(
                    <Select placeholder="请选择" disabled className={styles.nobordInput}>
                      {COUNTRY_SELECT.map($ => (
                        <Option value={$.value} key={$.value}>
                          {$.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="系列数">{getFieldDecorator('seriesCount')(<Input readOnly className={styles.nobordInput} />)}</Form.Item>
              </EvenlySplitRow>
              <EvenlySplitRow minCols={1}>
                <Form.Item label="简介：" {...updloadFormItemLayout}>
                  {getFieldDecorator('desc')(<TextArea readOnly className={styles.nobordInput} autosize />)}
                </Form.Item>
              </EvenlySplitRow>
            </Card>
          </div>
          <div id="picInfo" className={styles.card}>
            <Card title="Logo管理" className={styles.card}>
              <EvenlySplitRow minCols={1}>
                <Form.Item label="Logo大图" {...updloadFormItemLayout}>
                  {getFieldDecorator('big_logo', { rules: [{ required: true, message: '图片不能为空' }] })(<ImageList />)}
                </Form.Item>
              </EvenlySplitRow>

              <EvenlySplitRow minCols={1}>
                <Form.Item label="Logo白底图" {...updloadFormItemLayout}>
                  {getFieldDecorator('blank_log', { rules: [{ required: true, message: '图片不能为空' }] })(<ImageList />)}
                </Form.Item>
              </EvenlySplitRow>

              <EvenlySplitRow minCols={1}>
                <Form.Item label="其他" {...updloadFormItemLayout}>
                  {getFieldDecorator('other')(<ImageList />)}
                </Form.Item>
              </EvenlySplitRow>
            </Card>
          </div>

          <div id="showmgmt">
            <Card title="展示管理" className={styles.card}>
              <EvenlySplitRow minCols={1}>
                <Form.Item label="海报" {...updloadFormItemLayout}>
                  {getFieldDecorator('poster')(<ImageList />)}
                </Form.Item>
              </EvenlySplitRow>

              <EvenlySplitRow minCols={1}>
                <Form.Item label="视频" {...updloadFormItemLayout}>
                  {getFieldDecorator('video')(<ImageList />)}
                </Form.Item>
              </EvenlySplitRow>
            </Card>
          </div>
          <div id="series">
            <Card title="系列管理" bordered={false} style={{ marginBottom: 40 }} >
              {seriesForms}
            </Card>
          </div>
        </Form>
        <FooterToolbar style={{ width }}>
          <Button onClick={() => this.goBack()}>返回</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ brandDetail }) => ({
  brandDetail
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
    name: 'BrandDetailForm',
    onValuesChange,
    mapPropsToFields,
  })(BrandDetail)
);
