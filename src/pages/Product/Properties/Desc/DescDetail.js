import React, { PureComponent } from 'react';
import { Card, Input, Button, Row, Col, Form, Select, Popconfirm, notification, message } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import _ from 'lodash';
import shortid from 'shortid';
import TableForm from './TableForm';
import styles from './Desc.less';
import DescConfirm from './DescConfirm';

const { Option } = Select;

@connect(({ loading, desc }) => ({
  data: desc.detail,
  submitting: loading.effects['desc/addOrEditDesc'],
}))
@Form.create()
class DescDetail extends PureComponent {
  state = {
    width: '100%',
  };

  tableform = [];

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    // this.validate = debounce(this.validate, 1000);
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
      data,
    } = this.props;

    if (id) {
      dispatch({
        type: 'desc/queryDescInfoByNo',
        payload: {
          req: id,
        },
      });
    } else {
      // new one
      console.log('default new one');
      data.status = 0;
      data.name = '';
      data.ssNum = 1;
      data.key = shortid.generate();
      data.descSubsetDTOList = [
        {
          name: '',
          status: 0,
          key: shortid.generate(),
          descSubsetDetailDTOList: [],
        },
      ];
    }

    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'desc/clearDetail',
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
      this.tableform.forEach(item => {
        item.validateFields(err => {
          if (err) hasError = true;
        });
      });
      if (!error && !hasError) {
        const { keys, ...others } = values;

        if (_.find(others.descSubsetDTOList, e => e.descSubsetDetailDTOList.length === 0)) {
          message.error('子集属性不可为空');
          return;
        }

        dispatch({
          type: 'desc/addOrEditDesc',
          payload: others,
          success: res => {
            if (res.header.code === 4050) {
              notification.error({ message: res.header.msg || '出错了，稍后再试' });
              return;
            }

            if (res.header.code === 2000) router.goBack();
          },
        });
      }
    });
  };

  // continue if true
  checkSpu = async (id, subID) => {
    const { dispatch } = this.props;

    if (!id) {
      return true;
    }

    const res = await dispatch({
      type: 'desc/checkDesc',
      payload: {
        jointId: id,
        subJointId: subID,
        type: 2,
      },
    });

    if (res.header.code !== 2000) {
      return false;
    }

    if (res.data.status) return true;

    const result = await DescConfirm.show();
    if (result === 2) {
      return true;
    }
    if (result === 0) {
      this.downloadSpec(id);
    }

    return false;
  };

  // Delete desc
  handleDelete = async id => {
    const { dispatch } = this.props;

    if (!id || id === '') {
      router.goBack();
      return;
    }

    const result = await this.checkSpu(id);
    if (!result) return;

    dispatch({
      type: 'desc/delDesc',
      payload: { id },
      success: res => {
        if (res.header.code === 2000) router.goBack();
      },
    });
  };

  newMember = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat([{ id: null, name: '', status: 0, descSubsetDetailDTOList: [], key: shortid.generate() }]);
    const validCount = nextKeys.filter(k => k.delFlag !== 1).length;

    form.setFieldsValue({
      keys: nextKeys,
      ssNum: validCount,
    });

    setTimeout(() => window.scrollTo({ behavior: 'smooth', left: 0, top: document.body.scrollHeight }), 600);
  };

  // 动态form删除
  handleDeleteSubDesc = async i => {
    const { data } = this.props;
    const { form } = this.props;

    const list = _.get(data, 'descSubsetDTOList', []);
    const keys = form.getFieldValue('keys');

    let nextKeys;
    let nextList;

    console.log('hhh', keys, list);

    if (keys.length > i) {
      const subID = keys[i].id;
      if (subID) {
        const result = await this.checkSpu(data.id, subID);
        if (!result) return;
        list[i].delFlag = 1;
        keys[i].delFlag = 1;
        nextKeys = keys;
        nextList = list;
      } else {
        nextKeys = keys.filter((k, index) => i !== index);
        nextList = list.filter((k, index) => i !== index);
      }
    } else {
      console.log('eee');
    }

    const validCount = keys.filter(k => k.delFlag !== 1).length;

    form.setFieldsValue({
      keys: nextKeys,
      descSubsetDTOList: nextList,
      ssNum: validCount,
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting,
      data,
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
    getFieldDecorator('keys', { initialValue: _.get(data, 'descSubsetDTOList', []) });
    const keys = getFieldValue('keys');

    const validCount = keys.filter(k => k.delFlag !== 1).length;

    const formItems = keys.map((k, i) => (
      <div
        key={k.id || k.key}
        style={{
          background: '#f9f9f9',
          marginBottom: 24,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 16,
          paddingBottom: 24,
          position: 'relative',
          display: k.delFlag === 1 ? 'none' : 'block',
        }}
      >
        {validCount > 1 ? (
          <Button type="danger" style={{ position: 'absolute', top: 16, right: 24 }} onClick={() => this.handleDeleteSubDesc(i)}>
            删除
          </Button>
        ) : null}
        {getFieldDecorator(`descSubsetDTOList[${i}]`, {
          initialValue: k || { descSubsetDTOList: [] },
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
      <PageHeaderWrapper wrapperClassName={styles.advancedForm} ref={this.myRef}>
        <Card title="描述基本信息" className={styles.card} bordered={false}>
          <Form align="left">
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="描述ID">
                  {getFieldDecorator('id', {
                    initialValue: data.id || '',
                  })(<Input readOnly className={styles.nobordInput} placeholder="描述ID" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="使用状态">
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: data.status || 0,
                  })(
                    <Select placeholder="请选择状态" disabled style={{ display: 'none' }}>
                      <Option value={0}>启用</Option>
                      <Option value={1}>禁用</Option>
                    </Select>
                  )}
                  {data.status === 0 ? '启用' : '禁用'}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="描述名称">
                  {getFieldDecorator('name', {
                    initialValue: data.name || '',
                    rules: [{ required: true, message: '描述名称不能为空' }],
                  })(<Input placeholder="描述名称（必填）" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="描述子集数量">
                  {getFieldDecorator('ssNum', {
                    initialValue: data.ssNum || 0,
                  })(<Input readOnly className={styles.nobordInput} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="描述子集" bordered={false} style={{ marginBottom: 55 }}>
          {formItems}
          <Button
            style={{ width: '100%', marginTop: 0, color: '#FAAD14', background: '#FFFBE6', border: '1px solid #FAAD14' }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            新增描述子集
          </Button>
        </Card>
        <FooterToolbar
          style={{ width }}
          className={styles.footerBar}
          extra={
            <Popconfirm title="确认要删除吗" onConfirm={() => this.handleDelete(data.id)}>
              <Button type="danger">删除</Button>
            </Popconfirm>
          }
        >
          <Button onClick={() => router.goBack()}>取消</Button>
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default DescDetail;
