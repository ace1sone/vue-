import React from 'react';
import { Card, Button, Form, Col, Row, Input, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';
import qs from 'query-string';
import UploadAction from '@/common/UploadAction';
import { formItemLayout, formItemFillRow } from '../../Task/Common/FormLayout';
import { npcStatus } from '../SwitchForm';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Detail.less';

const { TextArea } = Input;

@Form.create()
class RolesForm extends React.Component {
  componentDidMount() {
    this.loadRole();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'npc/clearDetail', payload: {} });
  }

  goBack = () => {
    router.goBack();
  };

  loadRole = async () => {
    const { dispatch, location } = this.props;
    const { id } = qs.parse(location.search);
    if (!_.isEmpty(id)) {
      dispatch({ type: 'npc/loadRole', payload: { id } });
    }
  };

  submit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
      location,
    } = this.props;
    const { id } = qs.parse(location.search);
    validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        const { avatars, covers, ...others } = values;
        const avatar = typeof avatars === 'string' ? avatars : avatars.map(ele => ele.url).join();
        const cover = typeof covers === 'string' ? covers : covers.map(ele => ele.url).join();

        const params = {
          ...others,
          avatar,
          cover,
        };
        if (id) {
          await dispatch({
            type: 'npc/saveRole',
            payload: { npcInfo: { ...params, ...{ npcId: id } } },
          });
        } else {
          await dispatch({
            type: 'npc/saveRole',
            payload: { npcInfo: params },
          });
        }
        this.goBack();
      }
    });
  };

  render() {
    const {
      npc: { detail },
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper title="新建角色" wrapperClassName={styles.advancedForm}>
        <Spin spinning={loading === undefined ? false : !!loading}>
          <Card title="基础信息" bordered={false} style={{ marginBottom: 60 }}>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="NPC ID">
                  <span className="ant-form-text">{detail.id}</span>
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="状态">
                  {npcStatus(detail.status)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="NPC名称">
                  {getFieldDecorator('name', {
                    initialValue: detail.name || '',
                    rules: [
                      {
                        required: true,
                        message: 'NPC名称必填的哦！',
                      },
                      { max: 15, message: 'NPC名称不超过15个字符!' },
                    ],
                  })(<Input placeholder="请输入NPC名称,长度不超过15字" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="性别">
                  {getFieldDecorator('gender', {
                    initialValue: detail.gender || '',
                    rules: [
                      {
                        required: true,
                        message: '必填的哦！',
                      },
                      { max: 15, message: '性别不超过15个字符!' },
                    ],
                  })(<Input placeholder="请输入NPC性别" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="年龄">
                  {getFieldDecorator('age', {
                    initialValue: detail.age || '',
                    rules: [
                      {
                        required: true,
                        message: '必填的哦！',
                      },
                      { max: 15, message: '年龄不超过15个字符!' },
                    ],
                  })(<Input placeholder="请输入NPC年龄" type="text" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="星座">
                  {getFieldDecorator('constellation', {
                    initialValue: detail.constellation || '',
                    rules: [
                      {
                        required: true,
                        message: ' 必填的哦！',
                      },
                      { max: 15, message: '星座不超过15个字符!' },
                    ],
                  })(<Input placeholder="请输入NPC星座" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="地区">
                  {getFieldDecorator('area', {
                    initialValue: detail.area || '',
                    rules: [
                      {
                        required: true,
                        message: ' 必填的哦！',
                      },
                      { max: 30, message: '地区不超过30个字符!' },
                    ],
                  })(<Input placeholder="请输入地区" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="隶属">
                  {getFieldDecorator('subgroup', {
                    initialValue: detail.subgroup || '',
                    rules: [
                      {
                        required: true,
                        message: ' 必填的哦！',
                      },
                      { max: 15, message: '隶属不超过15个字符!' },
                    ],
                  })(<Input placeholder="请输入组织名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="NPC头像" {...formItemLayout}>
                  {getFieldDecorator('avatars', {
                    initialValue: detail.avatar || [],
                    rules: [{ required: true, message: '头像不能为空' }],
                  })(<UploadAction maxCount={1} desc="尺寸：500X500，支持.jpg .png 格式，大小≤1M" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="称号">
                  {getFieldDecorator('mark', {
                    initialValue: detail.mark || '',
                    rules: [{ max: 30, message: '称号不超过30个字符!' }],
                  })(<Input placeholder="请输入称号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="主图封面" {...formItemLayout}>
                  {getFieldDecorator('covers', {
                    initialValue: detail.cover || [],
                    rules: [{ required: true, message: '主图封面不能为空' }],
                  })(<UploadAction maxCount={1} desc="尺寸:1080X1080，支持.jpg .png 格式，大小≤1M" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={24}>
                <Form.Item {...formItemFillRow} label="签名">
                  {getFieldDecorator('signature', {
                    initialValue: detail.signature || '',
                    rules: [
                      {
                        required: true,
                        message: ' 必填的哦！',
                      },
                      { max: 30, message: '签名不超过30个字符' },
                    ],
                  })(<TextArea placeholder="请添加角色签名，限制30字以内" style={{ width: 960, height: 88 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={24}>
                <Form.Item {...formItemFillRow} label="个人经历">
                  {getFieldDecorator('experience', {
                    initialValue: detail.experience || '',
                    rules: [
                      {
                        required: true,
                        message: ' 必填的哦！',
                      },
                      { max: 500, message: '关于ta，不超过500个字符' },
                    ],
                  })(<TextArea placeholder="请添加个人经历，限制500字以内" style={{ width: 960, height: 88 }} />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <FooterToolbar style={{ width: '100%' }}>
            <Button onClick={() => this.goBack()}>取消</Button>
            <Button type="primary" onClick={this.submit} loading={loading}>
              提交
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
}))(RolesForm);
