import React from 'react';
import { Form, Modal, Col, Row, Card, message } from 'antd';
import _ from 'lodash';
import MultiCrops from '@/common/MultiCrops';
import HotareaContentForm from './HotareaContentForm';
import './HotareaShop.less';

@Form.create()
class HotareaShop extends React.Component {
  tableform = [];

  state = {
    coordinates: [],
  };

  componentDidMount() {
    const { hotList } = this.props;
    if (!_.isEmpty(hotList)) {
      this.setState({
        coordinates: hotList.map(ele => ({ x: ele.startX, y: ele.startY, id: ele.hotZoneId, width: ele.width, height: ele.height })),
      });
    }
  }

  drawEndCoordinate = (coordinate, index, coordinates) => {
    this.addBlock();
    this.setState({
      coordinates,
    });
  };

  updateCoordinate = (coordinate, index, coordinates) => {
    // this.addBlock();
    this.setState({
      coordinates,
    });
  };

  drawCoordinate = (coordinate, index, coordinates) => {
    this.setState({
      coordinates,
    });
  };

  deleteCoordinate = (coordinate, index, coordinates) => {
    this.setState({
      coordinates,
    });
    this.removeBlock(index);
  };

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
      form: { validateFields },
      onAdd,
    } = this.props;
    const { hotZoneHeight, coordinates } = this.state;

    validateFields((error, values) => {
      const val = values;
      let hasErr = false;

      const { contents } = { ...val };

      if (_.isEmpty(contents)) {
        message.error('内容不能为空');
        return;
      }
      contents.forEach(ele => {
        const tmp = ele;
        if (tmp.contentType === 'PRODUCT' && !tmp.productId) {
          hasErr = true;
          message.error('请添加商品');
        }
        if (tmp.contentType === 'NPC' && !tmp.npcId) {
          hasErr = true;
          message.error('请添加NPC');
        }
        if (tmp.contentType === 'ACTIVITY' && !tmp.activityId) {
          hasErr = true;
          message.error('请添加活动');
        }
        if (tmp.condition === 'INDIRECT' && !tmp.taskId) {
          hasErr = true;
          message.error('请添加关联任务');
        }
      });

      if (!this.validateChildForm()) return;

      if (!error && !hasErr) {
        const hotZoneList = !_.isEmpty(contents)
          ? contents.map((ele, i) => {
              const { startX, startY, width, height, ...ohter } = ele;
              return {
                startX: coordinates[i].x,
                startY: coordinates[i].y,
                width: coordinates[i].width,
                height: coordinates[i].height,
                ...ohter,
              };
            })
          : [];

        onAdd(hotZoneList, { hotZoneHeight, hotZoneWidth: 770 });
        callback();
      }
    });
  };

  // 动态form增加
  addBlock = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat([{ condition: 'DIRECT' }]);

    form.setFieldsValue({
      keys: nextKeys,
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
      img,
      hotList,
      activityId,
    } = this.props;

    const { coordinates } = this.state;
    // 动态生成tableform
    getFieldDecorator('keys', { initialValue: hotList && hotList.length > 0 ? hotList : [] });
    const keys = getFieldValue('keys');

    const seriesForms = keys.map((k, i) => (
      <div key={k.hotZoneId || 888888 + i} style={{ background: '#f9f9f9', padding: '10px 0', position: 'relative' }}>
        {/** keys.length >= 1 ? (
          <Button style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => this.removeBlock(i, k)}>
            删除
          </Button>
        ) : null */}

        {getFieldDecorator(`contents[${i}]`, {
          initialValue: k || {},
        })(
          <HotareaContentForm
            index={i}
            activityId={activityId}
            wrappedComponentRef={ele => {
              this.tableform[i] = ele;
            }}
          />
        )}
      </div>
    ));
    return (
      <Modal
        title="热区编辑器"
        visible={visible}
        onOk={this.handleOk}
        centered
        width={1388}
        maskClosable={false}
        onCancel={this.handleCancel}
        okText="完成"
      >
        <div style={{ height: 888, overflowY: 'scroll' }}>
          <Row gutter={24}>
            <Col lg={14} md={14} sm={24}>
              {getFieldDecorator('hotPointList', {
                initialValue: !_.isEmpty(hotList) ? hotList : [],
                rules: [{ required: false, message: '热区不能为空' }],
              })(
                <MultiCrops
                  src={img}
                  width={770}
                  coordinates={coordinates}
                  onDrawEnd={this.drawEndCoordinate}
                  onUpdate={this.updateCoordinate}
                  onChange={this.drawCoordinate}
                  onDelete={this.deleteCoordinate}
                  onLoad={e => this.setState({ hotZoneHeight: e.target.height })}
                />
              )}
            </Col>
            <Col lg={10} md={10} sm={24}>
              <Card title="热区管理" className="new-card-body-height" bordered={false} headStyle={{ padding: 0 }} bodyStyle={{ padding: 0 }}>
                {seriesForms}
              </Card>

              {/** <Button style={{ width: '100%', marginTop: 10, color: '#3B99FD' }} onClick={() => this.addBlock()} icon="plus" type="dashed">
                添加内容
              </Button> */}
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default HotareaShop;
