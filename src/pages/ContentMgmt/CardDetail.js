import React from 'react';
import { connect } from 'dva';
import { Card, Input, Button, Form, Row, Col, DatePicker, Modal, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { autobind } from 'core-decorators';
import router from 'umi/router';
import moment from 'moment';
import { get, isEmpty, trim } from 'lodash';
import UploadImage from './UploadImage';
import styles from './CreateCard.less';

@connect()
@autobind
@Form.create({})
class CardDetail extends React.Component {
  state = {
    detail: null,
  };

  componentDidMount() {
    const {
      location: {
        query: { id },
      },
    } = this.props;
    this.getCardDetail(id);
  }

  async getCardDetail(id) {
    const { dispatch } = this.props;
    const { success, data } = await dispatch({ type: 'contentMgmt/getCardDetail', payload: { id } });
    if (success) {
      this.setState({ detail: data });
    }
  }

  goBack = () => router.goBack();

  saveCard = e => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    e.preventDefault();
    validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (!(values.content || get(values, 'mainImg.fileList[0].response'))) {
          return message.error('图片和正文必须要填写任意一项才可以进行发布');
        }
        const target = {
          id: values.id,
          title: values.title,
          mainImg: get(values, 'mainImg.fileList[0].response'),
          onLineAt: moment(values.onLineAt).format('YYYY-MM-DD HH:mm:ss.SSS'),
          // isRecommend: values.isRecommend,
          content: values.content,
        };
        if (!target.mainImg) return message.error('图片必填');
        const { success } = await dispatch({ type: 'contentMgmt/createCard', payload: target });
        const { goBack } = this;
        if (success)
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

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { detail } = this.state;

    getFieldDecorator('id', { initialValue: get(detail, 'id') });

    return (
      <PageHeaderWrapper title="编辑卡片">
        <div className={styles.container}>
          <Card title="基础信息">
            <Form layout="inline" className={styles.hackRow}>
              <Row>
                <Col span={12}>
                  <Form.Item label="卡片标题">
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: '卡片标题不能为空！' }, { max: 30, message: '卡片标题长度不能超过30！' }],
                      initialValue: get(detail, 'title'),
                    })(<Input placeholder="请输入卡片标题，限制30字以内" style={{ width: 264 }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="卡片ID">{get(detail, 'id')}</Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="定时上线">
                    {getFieldDecorator('onLineAt', { initialValue: moment(get(detail, 'onLineAt')) })(
                      <DatePicker style={{ width: 264 }} showTime placeholder="选择日期" onOk={this.onOkCreateAt} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="卡片状态">
                    {' '}
                    {get(detail, 'status') === 0 ? (
                      <span style={{ color: '#52C41A' }}>已启用</span>
                    ) : (
                      <span style={{ color: '#f5222d' }}>已禁用</span>
                    )}{' '}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Form.Item label="主图封面">
                  <div className={styles.uploadComponent}>
                    {getFieldDecorator('mainImg', {
                      getValueFromEvent: e => {
                        if (get(e, 'fileList[0].status') !== 'true') {
                          this.imgLoading = true;
                        }
                        if (!e || !e.fileList || get(e, 'fileList.length') === 0 || !e.canUpLoad) {
                          return null;
                        }
                        if (e.canUpLoad) {
                          return e;
                        }
                        return null;
                      },
                      initialValue: {
                        fileList: get(detail, 'mainImg')
                          ? [
                              {
                                uid: '-1',
                                name: 'xxx.png',
                                status: 'done',
                                url: get(detail, 'mainImg'),
                                response: get(detail, 'mainImg'),
                              },
                            ]
                          : [],
                      },
                      rules: [{ required: true, message: '图片必填' }],
                    })(<UploadImage />)}
                  </div>
                  <div className={styles.Spec}>尺寸:750X900，支持.gif .jpg .png 格式，大小≤1M</div>
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="正文" className={styles.TextAreaRow}>
                  {getFieldDecorator('content', {
                    initialValue: get(detail, 'content'),
                    getValueFromEvent: e => (isEmpty(trim(e.target.value)) ? '' : e.target.value),
                    rules: [{ required: true, message: '正文必填' }, { max: 140, message: '正文最多140字！' }],
                  })(<Input.TextArea placeholder="请添加正文内容，支持中英文数字，最多140字" rows={4} />)}
                </Form.Item>
              </Row>
              {/* <Row>
                <Form.Item label="是否推荐至详情页">
                  {getFieldDecorator('isRecommend', { initialValue: get(detail, 'isRecommend') })(
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
            <Button onClick={this.goBack}>取消</Button>
            <Button onClick={this.saveCard} className={styles.darkBtn}>
              保存
            </Button>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardDetail;
