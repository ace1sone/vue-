import React from 'react';
import { Input, Col, Row, Form, Button, message } from 'antd';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import MaterialDialog from './MaterialDialog';

@Form.create()
class DynamicItem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    options: PropTypes.object,
    placeholder: PropTypes.string,
    mode: PropTypes.string,
  };

  static defaultProps = {
    index: 0,
    options: {},
    placeholder: '',
    mode: 'edit',
  };

  state = {
    sceneModal: false,
  };

  constructor(props) {
    super(props);
    if (props.val) {
      this.state = {
        data: props.val,
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { value } = props;
    const { data } = state;
    if (!_.isEqual(value, data)) {
      return {
        data: value,
      };
    }
    return null;
  }

  changeSelect = (v, op, a, b) => {
    const { index } = this.props;
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (v) {
      newData[a] = v;
      newData[b] = op.props.children;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData, index);
    }
  };

  validateForm = () => {
    const { form, mode } = this.props;
    let hasErr = false;
    if (mode === 'edit') {
      form.validateFields(err => {
        if (err) {
          hasErr = true;
        }
      });
    }
    return hasErr;
  };

  // 增加
  addMaterialTable = item => {
    const { index } = this.props;
    const { data } = this.state;
    const newData = _.cloneDeep(data);

    if (!newData.skipSceneID) newData.skipSceneID = '';
    if (newData.skipSceneID) {
      message.error('只能添加一个素材');
      return;
    }
    const { id } = item;
    newData.skipSceneID = id;

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData, index);
    this.forceUpdate();
  };

  // 删除
  removeMaterialTable = async () => {
    const { index } = this.props;

    const { data } = this.state;
    const newData = _.cloneDeep(data);
    newData.skipSceneID = '';

    this.setState({ data: newData });
    const { onChange } = this.props;
    onChange(newData, index);
    this.forceUpdate();
  };

  changeAndSave(e, name) {
    const { index } = this.props;
    const { data } = this.state;
    const newData = _.cloneDeep(data);
    if (e.target) {
      newData[name] = e.target.value;
      this.setState({ data: newData });
      const { onChange } = this.props;
      onChange(newData, index);
    }
  }

  remove(i) {
    const { onDelete } = this.props;
    onDelete(i);
  }

  render() {
    const {
      form: { getFieldDecorator },
      index,
      options,
      placeholder,
      placeholder2,
      mode,
      activityId,
      materialId,
    } = this.props;

    const formItemLayout = {
      labelAlign: 'left',
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };

    const { data, sceneModal } = this.state;
    const { origin, pathname } = window.location;
    const prefix = `${origin}${pathname}#`;

    return (
      <Row gutter={24} style={{ display: data.delFlag === 1 ? 'none' : 'block' }}>
        {mode !== 'view' && (
          <Col lg={11} md={11} sm={24}>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('title', {
                initialValue: data.title || '',
                ...options,
                rules: [{ required: true, message: '回复选项不能为空' }, { max: 20, message: '最多20个字' }],
              })(<Input placeholder={placeholder} onChange={e => this.changeAndSave(e, 'title')} />)}
            </Form.Item>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('content', {
                initialValue: data.content || '',
                ...options,
                rules: [{ required: true, message: '对话内容不能为空' }],
              })(<Input.TextArea placeholder={placeholder2} onChange={e => this.changeAndSave(e, 'content')} />)}
            </Form.Item>

            <Form.Item {...formItemLayout}>
              跳转至素材ID:
              <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/material/all/detail/${data.skipSceneID}`}>
                {data.skipSceneID}
              </a>{' '}
              {data.skipSceneID && <a onClick={this.removeMaterialTable}>清空</a>}
              {!data.skipSceneID && (
                <Button type="primary" onClick={() => this.setState({ sceneModal: true })}>
                  添加素材
                </Button>
              )}
              <MaterialDialog
                visible={sceneModal}
                onCancel={() => this.setState({ sceneModal: false })}
                onAdd={this.addMaterialTable}
                currentId={materialId}
                activityID={activityId}
                materDatas={[{ id: data.skipSceneID || '' }] || []}
              />
            </Form.Item>
          </Col>
        )}
        {mode === 'view' && (
          <Col lg={11} md={11} sm={24}>
            <Form.Item {...formItemLayout}>{data.title}</Form.Item>
            <Form.Item {...formItemLayout}>{data.content && <Input.TextArea value={data.content} placeholder={placeholder2} disabled />}</Form.Item>

            {data.skipSceneID && (
              <Form.Item {...formItemLayout}>
                跳转至素材ID:
                <a target="_blank" rel="noopener noreferrer" href={`${prefix}/activity/material/all/detail/${data.skipSceneID}`}>
                  {data.skipSceneID}
                </a>
              </Form.Item>
            )}
          </Col>
        )}

        {mode !== 'view' && (
          <Col lg={11} md={11} sm={24} style={{ display: 'flex' }}>
            {index > 0 && (
              <Form.Item style={{ flex: 1 }}>
                <a onClick={() => this.remove(index)}>删除</a>
              </Form.Item>
            )}
          </Col>
        )}
      </Row>
    );
  }
}

export default DynamicItem;
