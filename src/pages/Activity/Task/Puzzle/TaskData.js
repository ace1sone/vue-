import React from 'react';
import { Card, Button, Form, Col, Row, Modal } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { formItemLayout } from '../Common/FormLayout';

@Form.create()
class TaskData extends React.Component {
  state = {
    disabled: false,
    preIssued: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.detail.statistics && !_.isEqual(state.preIssued, props.detail.statistics.issued)) {
      return {
        disabled: props.detail.statistics.issued,
        preIssued: props.detail.statistics.issued,
      };
    }
    return null;
  }

  giveOut = () => {
    const { detail, dispatch } = this.props;
    Modal.confirm({
      title: '提示',
      content: '是否立即发放名额',
      onOk: async () => {
        const res = await dispatch({ type: 'task/batch', payload: { id: detail.id, type: 'PUZZLE' } });
        if (res.header.code === 2000) {
          this.setState({ disabled: true });
        }
      },
      okText: '确认',
      cancelText: '取消',
    });
  };

  render() {
    const { loading, detail } = this.props;

    const { statistics } = detail;
    const { disabled } = this.state;
    return (
      <Card title="任务数据" bordered={false}>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="参与任务人数">
              <span className="ant-form-text">{statistics ? statistics.participantsNumber : 0}</span>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="完成任务人数">
              <span className="ant-form-text">{statistics ? statistics.completionsNumber : 0}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <Form.Item {...formItemLayout} label="购买资格发放数量">
              <span className="ant-form-text">{statistics ? statistics.issuedNumber : 0}</span>
              {detail.status && detail.status !== 'WAITING' && detail.issuanceMethod === 'MANUAL' && (
                <Button type="primary" onClick={this.giveOut} loading={loading} disabled={disabled}>
                  发放
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default connect(({ task, loading }) => ({
  task,
  loading: loading.models.task,
}))(TaskData);
