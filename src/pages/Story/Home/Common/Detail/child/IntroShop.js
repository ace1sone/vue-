import React from 'react';
import { Form, Modal, Input, Col, Row, Card, Button, message } from 'antd';
import _ from 'lodash';
import UploadAction from '@/common/UploadAction';
import IntroContentForm from './IntroContentForm';

const { TextArea } = Input;
@Form.create()
class IntroShop extends React.Component {
  detail = {};

  tableform = [];

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  handleOk = () => {
    const { onCancel } = this.props;
    this.validate(onCancel);
  };

  validateChildForm = () => {
    let error = false;
    const validateCb = err => {
      if (err) error = err;
    };
    this.tableform.forEach(form => {
      if (!form) return;
      form.props.form.validateFields(err => {
        if (err) {
          const key = Object.keys(err)[0];

          error = err[key].errors[0].message;
        }
      });

      if (form.childForm) form.childForm.validateChildForm(validateCb);
    });

    if (error) {
      message.error(error);
    }

    return !error;
  };

  validate = async callback => {
    const {
      form: { validateFieldsAndScroll },
      intro,
      onAdd,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      const val = values;

      // if (_.isEmpty(val.contents)) {
      //   message.error('内容不能为空');
      //   return;
      // }

      if (!this.validateChildForm()) return;

      const { keys, covers, contents = [], ...others } = { ...val };
      const cover = typeof covers === 'string' ? covers : covers.map(ele => ele.url).join('');

      if (!error) {
        const param = {
          activityID: intro.activityID || '',
          cover,
          contents: !_.isEmpty(contents)
            ? contents.map((ele, i) => ({
                ...ele,
                sortNumber: i,
              }))
            : [],
          ...others,
        };

        onAdd(param);
        callback();
      }
    });
  };

  // 动态form增加
  addBlock = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat([
      {
        delFlag: 0,
        sortNumber: keys.length,
      },
    ]);

    form.setFieldsValue({
      keys: nextKeys,
      seriesCount: nextKeys.filter(ele => ele.delFlag !== 1).length,
    });
  };

  // 动态form删除
  removeBlock = i => {
    const { form } = this.props;

    const keys = form.getFieldValue('keys');
    const contents = form.getFieldValue('contents');

    const nextKeys = keys.filter((key, idx) => idx !== i);
    const dialogsnew = contents.filter((key, idx) => idx !== i);

    form.setFieldsValue({
      keys: nextKeys,
      contents: dialogsnew,
      seriesCount: nextKeys.length,
    });
  };

  render() {
    const {
      visible,
      form: { getFieldDecorator, getFieldValue },
      intro,
      mode,
    } = this.props;

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
    getFieldDecorator('keys', { initialValue: intro.contents && intro.contents.length > 0 ? intro.contents : [] });
    const keys = getFieldValue('keys');

    const seriesForms = keys.map((k, i) => (
      <div key={k.sortNumber || 888888 + i} style={{ background: '#f9f9f9', marginBottom: 10, padding: '20px 22px', position: 'relative' }}>
        {mode !== 'view' && keys.length >= 1 ? (
          <Button style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => this.removeBlock(i, k)}>
            删除
          </Button>
        ) : null}

        {getFieldDecorator(`contents[${i}]`, {
          initialValue: k || {},
        })(
          <IntroContentForm
            index={i}
            wrappedComponentRef={ele => {
              this.tableform[i] = ele;
            }}
            mode={mode}
          />
        )}
      </div>
    ));
    return (
      <Modal
        title="发售简介"
        visible={visible}
        onOk={this.handleOk}
        centered
        width={1128}
        maskClosable={false}
        onCancel={this.handleCancel}
        okText="完成"
      >
        <div style={{ height: 683, overflowY: 'scroll' }}>
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="简介标题">
                {mode !== 'view'
                  ? getFieldDecorator('title', {
                      initialValue: intro.title || '',
                      rules: [{ required: false, message: '标题不能为空' }, { max: 30, message: '长度不超过30' }],
                    })(<Input placeholder="请输入简介标题，限制30字以内" />)
                  : intro.title}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="简介封面">
                {mode !== 'view' ? (
                  getFieldDecorator('covers', {
                    initialValue: intro.cover || [],
                  })(<UploadAction maxCount={1} />)
                ) : (
                  <img src={intro.cover} style={{ width: 100 }} alt="" />
                )}
                {mode !== 'view' && <p>尺寸：600X480，支持.jpg .png 格式，大小≤1M</p>}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item {...formItemLayout} label="简介摘要">
                {mode !== 'view'
                  ? getFieldDecorator('summary', {
                      initialValue: intro.summary || '',
                      rules: [{ required: false, message: '不能为空' }, { max: 100, message: '长度不超过100' }],
                    })(<TextArea placeholder="请添加简介描述，限100字以内" style={{ width: 780, height: 88 }} />)
                  : intro.summary}
              </Form.Item>
            </Col>
          </Row>

          <div id="operationRecord">
            <Card title="简介正文" bordered={false} headStyle={{ borderBottom: '1px solid transparent' }}>
              {seriesForms}
            </Card>

            {mode !== 'view' && (
              <Button
                style={{ width: '100%', marginTop: 10, backgroundColor: '#FFFBE6', color: '#FAAD14', border: '1px solid #FAAD14' }}
                onClick={() => this.addBlock()}
                icon="plus"
                type="dashed"
              >
                添加内容
              </Button>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default IntroShop;
