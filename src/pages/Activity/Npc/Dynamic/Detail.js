import React from 'react';
import { Card, Button, Form, Col, Row, Input, Spin, Menu, Select, Radio, DatePicker, Table, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import qs from 'query-string';
import moment from 'moment';
import UploadAction from '@/common/UploadAction';
import { spuColumns, activityColumns } from './components/TableColumns';
import { formItemLayout, formItemFillRow, formItemLayoutWithOutLabel } from '../../Task/Common/FormLayout';
import SpuDialog from './components/SpuDialog';
import ActivityDialog from './components/ActivityDialog';
import { npcType, npcpublish } from '../SwitchForm';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Detail.less';

const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class DynamicForm extends React.Component {
  state = {
    spuModal: false,
    actModal: false,
    // roles: [],
  };

  componentDidMount() {
    this.loadDynamic();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'npc/clearDetail', payload: {} });
  }

  goBack = () => {
    router.goBack();
  };

  loadDynamic = async () => {
    const { dispatch, location } = this.props;
    const { id } = qs.parse(location.search);
    if (!_.isEmpty(id)) {
      await dispatch({ type: 'npc/loadDyn', payload: { id } });
    }
    this.loadRoles();
  };

  loadRoles = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'npc/getValidRoles',
      payload: {},
    });
  };

  submit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
      location,
    } = this.props;
    const { id, type } = qs.parse(location.search);
    validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        const { covers, actInfo, relatedProducts, publishType, publishTime, urls, content, ...others } = values;
        let cover;
        let url;
        const multimedias = [];
        if (covers) {
          // 视频、音频
          cover = typeof covers === 'string' ? covers : covers.map(ele => ele.url).join();
          url = typeof urls === 'string' ? urls : urls.map(ele => ele.url).join();
          multimedias.push({ url, cover });
        } else {
          // 图文 (多张图片)
          cover = null;
          urls.forEach((every, index) => {
            multimedias.push({ url: every.url || null, cover, weight: index + 1 });
          });
        }
        if (!content && !urls.length > 0) {
          message.error('动态文案或配图必须填写一个');
          return;
        }
        const activities = []; // 活动
        actInfo.forEach(every => {
          activities.push({ id: every.id });
        });
        const spuInfos = []; // 商品
        relatedProducts.forEach(every => {
          spuInfos.push({ spuId: every.spuId, weight: every.weight });
        });
        if (!id && publishType === 'TIMING' && moment(publishTime).valueOf() <= moment(Date.now()).valueOf()) {
          message.error('发放时间不能小于或等于当前时间');
          return;
        }
        const params = {
          ...others,
          activities,
          spuInfos,
          multimedias,
          publishTime: publishType === 'TIMING' ? moment(publishTime).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
          publishType,
          postType: type,
          content,
        };
        if (id) {
          await dispatch({
            type: 'npc/saveDyn',
            payload: { npcPost: { ...params, ...{ id } } },
          });
        } else {
          await dispatch({
            type: 'npc/saveDyn',
            payload: { npcPost: params },
          });
        }
        this.goBack();
      }
    });
  };

  handleMenuClick = e => {
    const targetDiv = document.getElementById(e.key);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  addSpuTable = data => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    relatedProducts.push({ ...data, weight: relatedProducts.length + 1 });
    setFieldsValue({ relatedProducts });
  };

  removeSpuTable = async row => {
    const { spuId } = row;
    const { form } = this.props;
    const relatedProducts = form.getFieldValue('relatedProducts');
    const newSpus = relatedProducts.filter(key => key.spuId !== spuId);
    newSpus.forEach((__, i) => {
      const child = __;
      child.weight = i + 1;
    });
    form.setFieldsValue({
      relatedProducts: newSpus,
    });
  };

  removeActivity = row => {
    const { id } = row;
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const actInfo = getFieldValue('actInfo');
    setFieldsValue({
      actInfo: actInfo.filter(ele => ele.id !== id),
    });
  };

  addActivity = data => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const actInfo = getFieldValue('actInfo');
    if (actInfo.length >= 1) {
      message.info('只能添加一个活动');
      return;
    }
    actInfo.push(data);
    setFieldsValue({ actInfo });
  };

  upBlock = each => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    const curr = _.findIndex(relatedProducts, every => every.spuId === each.spuId);
    if (curr === 0) {
      message.error('这已经是第一个啦，不能再往上移啦！');
      return;
    }
    [relatedProducts[curr], relatedProducts[curr - 1]] = [relatedProducts[curr - 1], relatedProducts[curr]];
    [relatedProducts[curr].weight, relatedProducts[curr - 1].weight] = [curr + 1, curr];
    setFieldsValue({ relatedProducts });
  };

  downBlock = each => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const relatedProducts = getFieldValue('relatedProducts');
    const curr = _.findIndex(relatedProducts, every => every.spuId === each.spuId);
    if (curr === relatedProducts.length - 1) {
      message.error('这已经是最后一个啦，不能再往下移啦！');
      return;
    }
    [relatedProducts[curr], relatedProducts[curr + 1]] = [relatedProducts[curr + 1], relatedProducts[curr]];
    [relatedProducts[curr].weight, relatedProducts[curr + 1].weight] = [curr + 1, curr + 2];
    setFieldsValue({ relatedProducts });
  };

  render() {
    const {
      npc: { detail, validRolesData },
      form: { getFieldDecorator, getFieldValue },
      loading,
      location,
    } = this.props;
    const { type, id } = qs.parse(location.search);
    const { spuModal, actModal } = this.state;
    getFieldDecorator('relatedProducts', { initialValue: !_.isEmpty(detail.spuInfos) ? detail.spuInfos : [] });
    getFieldDecorator('actInfo', { initialValue: !_.isEmpty(detail.activities) ? detail.activities : [] });
    const relatedProducts = getFieldValue('relatedProducts');
    const actInfo = getFieldValue('actInfo');

    return (
      <PageHeaderWrapper title="新建动态" wrapperClassName={styles.advancedForm}>
        <Menu mode="horizontal" selectable defaultSelectedKeys={['basicInfo']} onClick={this.handleMenuClick} style={{ marginBottom: 20 }}>
          <Menu.Item key="basicInfo">基础信息</Menu.Item>
          <Menu.Item key="content">动态内容</Menu.Item>
          <Menu.Item key="product">关联商品</Menu.Item>
          <Menu.Item key="activity">关联发售</Menu.Item>
        </Menu>
        <Spin spinning={loading === undefined ? false : !!loading}>
          <div className={styles.card} id="basicInfo">
            <Card title="基础信息" bordered={false}>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="动态 ID">
                    <span className="ant-form-text">{detail.id}</span>
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="状态">
                    {npcpublish(detail.status)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="动态名称">
                    {getFieldDecorator('title', {
                      initialValue: detail.title || '',
                      rules: [
                        {
                          required: true,
                          message: '动态名称必填的哦！',
                        },
                        { max: 20, message: '动态名称不能超过20个字!' },
                      ],
                    })(<Input placeholder="请输入动态名称,限制20字以内" />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="类型">
                    {npcType(type)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发布NPC">
                    {getFieldDecorator('npcId', {
                      initialValue: detail.npcId || null,
                      rules: [{ required: true, message: '必填' }],
                    })(
                      <Select style={{ width: 264 }} placeholder="请选择需要发布内容的NPC">
                        <Option value={null}>请选择</Option>
                        {validRolesData &&
                          validRolesData.length > 0 &&
                          validRolesData.map(item => (
                            <Option key={item.npcId} value={item.npcId}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="发布方式">
                    {getFieldDecorator('publishType', {
                      initialValue: detail.publishType || 'IMMEDIATELY',
                    })(
                      <Radio.Group disabled={!!id}>
                        <Radio value="IMMEDIATELY">手动发布</Radio>
                        <Radio value="TIMING">定时发布</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item {...formItemLayoutWithOutLabel}>
                    {getFieldDecorator('publishTime', {
                      initialValue: detail.publishTime ? moment(detail.publishTime) : undefined,
                      rules: [
                        {
                          required: getFieldValue('publishType') === 'TIMING',
                          message: '时间必填的哦！',
                        },
                      ],
                    })(<DatePicker showTime allowClear disabled={!_.isEmpty(id) || getFieldValue('publishType') === 'IMMEDIATELY'} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col sm={24}>
                  <Form.Item {...formItemFillRow} label="备注">
                    {getFieldDecorator('remark', {
                      initialValue: detail.remark || '',
                      rules: [{ max: 300, message: '不能超过300字' }],
                    })(<TextArea placeholder="请添加备注信息，限制300字以内" style={{ width: 960, height: 88 }} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </div>
          <div className={styles.card} id="content">
            <Card title="动态内容" bordered={false}>
              <Row gutter={24}>
                <Col sm={24}>
                  <Form.Item {...formItemFillRow} label="动态文案">
                    {getFieldDecorator('content', {
                      initialValue: detail.content || '',
                      rules: [{ max: 500, message: '长度不超过500个字' }],
                    })(<TextArea placeholder="请添加动态文案，长度不超过500个字，支持中文、英文和数字" style={{ width: 960, height: 88 }} />)}
                  </Form.Item>
                </Col>
              </Row>

              {type === 'IMAGE' && (
                <Row gutter={24}>
                  <Col sm={24}>
                    <Form.Item label="配图" {...formItemFillRow}>
                      {getFieldDecorator('urls', {
                        initialValue: (detail.multimedias && detail.multimedias.map(ele => ({ url: ele.url }))) || [],
                      })(<UploadAction maxCount={9} maxSize={1024 * 1024 * 1} desc="支持.jpg .png 格式，大小≤1M" />)}
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {type !== 'IMAGE' && (
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="主图封面" {...formItemLayout}>
                      {getFieldDecorator('covers', {
                        initialValue: (detail.multimedias && detail.multimedias.map(ele => ({ url: ele.cover }))) || [],
                        rules: [{ required: true, message: '主图封面不能为空' }],
                      })(<UploadAction maxCount={1} maxSize={1024 * 1024 * 1} desc="尺寸:800X800，支持.jpg .png 格式，大小≤1M" />)}
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {type === 'AUDIO' && (
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="音频" {...formItemLayout}>
                      {getFieldDecorator('urls', {
                        initialValue: (detail.multimedias && detail.multimedias.map(ele => ({ url: ele.url }))) || [],
                        rules: [{ required: true, message: '音频不能为空' }],
                      })(
                        <UploadAction
                          maxCount={1}
                          supportTypes={['audio/mp3']}
                          maxSize={1024 * 1024 * 5}
                          timeout={60000}
                          desc="支持 .mp3格式，大小≤5M"
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {type === 'VIDEO' && (
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="视频" {...formItemLayout}>
                      {getFieldDecorator('urls', {
                        initialValue: (detail.multimedias && detail.multimedias.map(ele => ({ url: ele.url }))) || [],
                        rules: [{ required: true, message: '视频不能为空' }],
                      })(
                        <UploadAction
                          maxCount={1}
                          videoSize={50}
                          timeout={600000}
                          supportTypes={['video/mp4']}
                          desc="尺寸:750X1440，支持 .mp4格式，图片大小≤50M"
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Card>
          </div>
          <div className={styles.card} id="product">
            <Card title="关联商品" bordered={false}>
              {relatedProducts.length > 0 && (
                <Table
                  columns={spuColumns(this.removeSpuTable, this.upBlock, this.downBlock)}
                  rowKey="spuId"
                  dataSource={relatedProducts || []}
                  pagination={false}
                />
              )}
              <Button className={styles['add-spu-btn']} type="dashed" icon="plus" onClick={() => this.setState({ spuModal: true })}>
                添加商品
              </Button>
              <SpuDialog
                visible={spuModal}
                onCancel={() => this.setState({ spuModal: false })}
                onAdd={this.addSpuTable}
                spuDatas={relatedProducts || []}
              />
            </Card>
          </div>
          <div className={styles.card} id="activity">
            <Card title="关联发售" bordered={false} style={{ marginBottom: 80 }}>
              {actInfo.length > 0 && (
                <Table columns={activityColumns(this.removeActivity)} rowKey="id" dataSource={actInfo || []} pagination={false} />
              )}
              {actInfo.length > 0 ? null : (
                <Button className={styles['add-spu-btn']} type="dashed" icon="plus" onClick={() => this.setState({ actModal: true })}>
                  添加发售
                </Button>
              )}
              <ActivityDialog
                visible={actModal}
                actInfo={actInfo || []}
                onCancel={() => this.setState({ actModal: false })}
                onAdd={this.addActivity}
              />
            </Card>
          </div>
          <FooterToolbar style={{ width: '100%' }}>
            <Button onClick={() => this.goBack()}>取消</Button>
            <Button type="primary" onClick={this.submit} loading={loading}>
              保存
            </Button>
          </FooterToolbar>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ npc, loading }) => ({
  npc,
  loading: loading.models.npc,
}))(DynamicForm);
