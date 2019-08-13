import React from 'react';
import { connect } from 'dva';
import { Card, Input, Button, Form, Row, Col, DatePicker, Modal, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { autobind } from 'core-decorators';
import router from 'umi/router';
import moment from 'moment';
import { isEmpty, get, trim, values as getValues } from 'lodash';
import UploadImage from './UploadImage';
import styles from './CreateCard.less';

@connect(state => ({
  contentMgmt: state.contentMgmt,
}))
@autobind
@Form.create({})
class CreateCard extends React.Component {
  imgLoading = false;

  goBack = () => router.goBack();

  createCard = ({ next } = {}) => e => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    e.preventDefault();
    validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const target = {
          title: values.title,
          mainImg: get(values, 'mainImg.fileList[0].response'),
          onLineAt: moment(values.onLineAt).format('YYYY-MM-DD HH:mm:ss.SSS'),
          // isRecommend: values.isRecommend,
          content: values.content,
        };
        // console.log(target, target.mainImg);
        if (!target.mainImg) return message.error('图片必填');
        const { data } = await dispatch({ type: 'contentMgmt/createCard', payload: target });
        const { goBack } = this;
        if (data && next) return window.location.reload();
        if (data)
          Modal.success({
            title: '提交成功',
            onOk() {
              goBack();
            },
            onCancel() {
              goBack();
            },
          });
      }
      return true;
    });
  };

  handleCancel = e => {
    e.preventDefault();
    const {
      form: { resetFields, getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    const isInput = getValues(values).some(v => !isEmpty(v));
    const { goBack } = this;
    if (isInput)
      return Modal.confirm({
        title: '取消创建',
        content: '取消创建会清空当前已填写的内容，确认要取消创建吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          resetFields();
          goBack();
        },
      });
    return goBack();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper title="创建卡片">
        <div className={styles.container}>
          <Card title="基础信息">
            <Form layout="inline" className={styles.hackRow}>
              <Row>
                <Col span={12}>
                  <Form.Item label="卡片标题">
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: '卡片标题不能为空！' }, { max: 30, message: '卡片标题长度不能超过30！' }],
                    })(<Input placeholder="请输入卡片标题，限制30字以内" style={{ width: 264 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="卡片ID" />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="定时上线">
                    {getFieldDecorator('onLineAt')(<DatePicker style={{ width: 264 }} showTime placeholder="选择日期" onOk={this.onOkCreateAt} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="卡片状态" />
                </Col>
              </Row>
              <Row>
                <Form.Item label="主图封面">
                  <div className={styles.uploadComponent}>
                    {getFieldDecorator('mainImg', {
                      getValueFromEvent: e => {
                        if (get(e, 'fileList[0].status') !== 'true') {
                          // console.log('上传完成');
                          this.imgLoading = true;
                        }
                        // console.log('onChange', e, get(e, 'fileList.length') === 0);
                        if (!e || !e.fileList || get(e, 'fileList.length') === 0 || !e.canUpLoad) {
                          return null;
                        }
                        if (e.canUpLoad) {
                          return e;
                        }
                        return null;
                      },
                      rules: [{ required: true, message: '主图封面必填写' }],
                    })(<UploadImage />)}
                  </div>
                  <div className={styles.Spec}>尺寸:750X900，支持.gif .jpg .png 格式，大小≤1M</div>
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="正文" className={styles.TextAreaRow}>
                  {getFieldDecorator('content', {
                    getValueFromEvent: e => (isEmpty(trim(e.target.value)) ? '' : e.target.value),
                    rules: [{ required: true, message: '正文必填写' }, { max: 140, message: '正文最多140字！' }],
                  })(<Input.TextArea placeholder="请添加正文内容，支持中英文数字，最多140字" rows={4} />)}
                </Form.Item>
              </Row>
              {/* <Row>
                <Form.Item label="是否推荐至详情页">
                  {getFieldDecorator('isRecommend', { initialValue: 0 })(
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Row> */}
            </Form>
          </Card>

          <Card className={styles.footer}>
            <Button onClick={this.handleCancel}>取消</Button>
            <Button onClick={this.createCard({ next: false })} className={styles.darkBtn}>
              提交
            </Button>
            <Button onClick={this.createCard({ next: true })} className={styles.darkBtn}>
              提交并创建下一个
            </Button>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CreateCard;
