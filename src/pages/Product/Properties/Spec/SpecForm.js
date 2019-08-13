import React from 'react';
import { Card, Button, Form, Col, Row, Input, Select, Modal, notification, Icon, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import _ from 'lodash';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isRepeat } from '@/utils/utils';
import TableForm from './TableForm';

import styles from './specform.less';

const { Option } = Select;

const fieldLabels = {
  id: '规格ID',
  chineseName: '规格名称（中文）',
  englishName: '规格名称（英文）',
  status: '使用状态',
  ssNum: '规格标准数量',
};

@Form.create()
class SpecForm extends React.Component {
  state = {
    width: '100%',
  };

  tableform = [];

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    if (!_.isEmpty(params.id)) {
      dispatch({
        type: 'spec/querySpecInfoByNo',
        payload: {
          req: params.id,
        },
      });
    }
    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'spec/clearDetail',
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

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    let hasError = false;
    validateFieldsAndScroll((error, values) => {
      console.log(values);
      this.tableform.forEach(item => {
        item.validateFields(err => {
          if (err) hasError = true;
        });
      });

      if (!values.specStandardDTOList) {
        message.error('请添加规格标准');
        hasError = true;
      }

      values.specStandardDTOList.forEach(ele => {
        if (_.isEmpty(ele.ssDetailDTOList)) {
          message.error('属性不能为空');
          hasError = true;
        }
        if (isRepeat(ele.ssDetailDTOList.map(item => item.attributes))) {
          message.error('标准属性重复');
          hasError = true;
        }
      });

      if (!error && !hasError) {
        const { keys, ...others } = values;
        dispatch({
          type: 'spec/addOrEditSpec',
          payload: others,
          success: res => {
            if (res.header.code === 4050) {
              notification.error({ message: res.header.msg || '出错了，稍后再试' });
              return;
            }
            if (res.header.code === 2000) this.goBack();
          },
        });
      }
    });
  };

  goBack = () => {
    router.goBack();
  };

  // 动态form增加
  addStandard = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([
      { specStandardNo: '', chineseName: '', englishName: '', status: '', delFlag: 0, ssDetailDTOList: [], created_by: 1, updatedBy: 1, isAdd: true },
    ]);

    form.setFieldsValue({
      keys: nextKeys,
      ssNum: nextKeys.filter(ele => ele.delFlag !== 1).length,
    });
  };

  // 动态form删除
  removeStandards = async i => {
    const {
      form,
      match: { params },
      dispatch,
    } = this.props;
    const keys = form.getFieldValue('keys');
    const specStandardDTOList = form.getFieldValue('specStandardDTOList');

    let nextKeys;
    let nextSpecList;

    if (keys.length === 1) return;

    if (!_.isEmpty(params.id) && !keys[i].isAdd) {
      const res = await dispatch({
        type: 'spec/checkSpu',
        payload: {
          jointId: params.id,
          type: 1,
          subJointId: keys[i].id,
        },
      });

      if (res.data && !res.data.status) {
        Modal.confirm({
          icon: <Icon type="close-circle" style={{ color: '#F5222D' }} />,
          title: '警告',
          content: '该规格已关联多个SPU请在无关联的前提下进行删除操作。',
          okText: '下载关联SPU列表',
          cancelText: '知道了',
          onOk: async () => {
            await dispatch({
              type: 'spec/downloadSpu',
              payload: {
                jointId: params.id,
                type: 1,
                subJointId: keys[i].id,
              },
            });
          },
        });
      } else {
        specStandardDTOList[i].delFlag = 1;
        keys[i].delFlag = 1;
        nextKeys = keys;
        nextSpecList = specStandardDTOList;

        form.setFieldsValue({
          specStandardDTOList: nextSpecList,
          keys: nextKeys,
          ssNum: nextKeys.filter(ele => ele.delFlag !== 1).length,
        });
      }
    } else {
      nextKeys = keys.filter((key, idx) => idx !== i);
      nextSpecList = specStandardDTOList;

      form.setFieldsValue({
        specStandardDTOList: nextSpecList,
        keys: nextKeys,
        ssNum: nextKeys.filter(ele => ele.delFlag !== 1).length,
      });
    }
  };

  delete = () => {
    const {
      spec: { detail },
      dispatch,
    } = this.props;
    const { id } = detail;

    Modal.confirm({
      title: '确定删除该规格吗?',
      onOk: () => {
        dispatch({
          type: 'spec/delSpec',
          payload: { id, delFlag: 1 },
          success: res => {
            if (res.header.code === 4050) {
              Modal.info({
                title: '该规格下面有关联SPU',
                okText: '下载excel文档',
                onOk: async () => {
                  await dispatch({
                    type: 'spec/downloadSpu',
                    payload: {
                      jointId: id,
                      type: 1,
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
    console.log(this.props)
    const {
      spec: { detail },
      form: { getFieldDecorator, getFieldValue },
      match: { params },
      submitting,
      dispatch,
    } = this.props;
    
    const { width } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    // 动态生成tableform
    getFieldDecorator('keys', { initialValue: _.get(detail, 'specStandardDTOList', []) });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, i) => (
      <div
        key={k.id || i}
        style={{ background: '#f9f9f9', marginBottom: 20, padding: 10, position: 'relative', display: k.delFlag === 1 ? 'none' : 'block' }}
      >
        {keys.filter(ele => ele.delFlag !== 1).length > 1 ? (
          <Button style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => this.removeStandards(i)}>
            删除
          </Button>
        ) : null}
        {getFieldDecorator(`specStandardDTOList[${i}]`, {
          initialValue: k || { ssDetailDTOList: [] },
        })(
          <TableForm
            index={i}
            dispatch={dispatch}
            ref={ele => {
              this.tableform[i] = ele;
            }}
          />
        )}
      </div>
    ));

    return (
      <PageHeaderWrapper wrapperClassName={styles.advancedForm}>
        <Card title="规格基本信息" className={styles.card} bordered={false}>
          <Form align="left">
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.id}>
                  {getFieldDecorator('id', {
                    initialValue: detail.id || '',
                  })(<Input readOnly className={styles.nobordInput} placeholder="规格ID" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.status}>
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: detail.status || 0,
                  })(
                    <Select placeholder="请选择状态" style={{ display: 'none' }}>
                      <Option value={0}>启用</Option>
                      <Option value={1}>禁用</Option>
                    </Select>
                  )}
                  {detail.status === 0 ? '启用' : '禁用'}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.chineseName}>
                  {getFieldDecorator('chineseName', {
                    initialValue: detail.chineseName || '',
                    validateTrigger: 'onBlur',
                    rules: [{ required: true, message: '中文名不能为空' }],
                  })(<Input placeholder="中文规格名称（必填）" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.englishName}>
                  {getFieldDecorator('englishName', {
                    initialValue: detail.englishName || '',
                    validateTrigger: 'onBlur',
                    rules: [{ required: true, message: '英文名不能为空' }],
                  })(<Input placeholder="中文规格名称（必填）" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.ssNum}>
                  {getFieldDecorator('ssNum', {
                    initialValue: detail.ssNum || 0,
                  })(<Input readOnly className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="规格标准信息" bordered={false}>
          {formItems}
        </Card>

        <Button
          style={{ width: '100%', marginTop: 26, color: '#FAAD14', background: '#FFFBE6', border: '1px solid #FAAD14', marginBottom: 68 }}
          onClick={this.addStandard}
          icon="plus"
        >
          新增标准
        </Button>

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
          <Button type="primary" onClick={this.validate} loading={submitting}>
            保存
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ spec, loading }) => ({
  spec,
  submitting: loading.effects['spec/addOrEditSpec'],
}))(SpecForm);
