import React from 'react';
import { Table, Modal, Spin, Input, Form, Select, Button } from 'antd';
import { connect } from 'dva';

import styles from './List.less';
import { plotColumns, activtyColumns } from './Columns';

const { Search } = Input;
@Form.create()
class NewestDialog extends React.Component {
  static defaultProps = {
    onAdd: () => {},
    recoData: [],
  };

  state = { visible: false };

  componentDidUpdate(preProps, preState) {
    const { visible } = this.state;

    const {
      homemgmt: { source },
    } = this.props;
    if (preState.visible !== visible && !source.records) {
      this.loadSourceList(undefined, 'ACTIVITY');
    }
  }

  showModal = state => {
    this.setState({ visible: state });
  };

  loadSourceList = (current = 1, type) => {
    const { dispatch } = this.props;
    const params = {
      current,
      keyword: '',
      size: 10,
      type,
    };
    dispatch({
      type: 'homemgmt/sources',
      payload: params,
    });
  };

  handleCancel = () => {
    this.showModal(false);
  };

  onSubmit = async (data, type) => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    const { channel } = this.state;
    const { id, end, start, name, offlineAt, onlineAt } = data;
    const recommendationDate = getFieldValue('recommendationDate');
    const params = {
      recommendationChannel: channel,
      recommendationDate,
      recommendationType: type,
      resourceId: id,
      end,
      name,
      offlineAt,
      onlineAt,
      start,
    };
    await dispatch({
      type: 'homemgmt/saveNewest',
      payload: params,
    });
    this.setState({ visible: false });
  };

  render() {
    const {
      homemgmt: { source },
      loading,
      recoData,
      form: { getFieldDecorator },
    } = this.props;
    const { visible } = this.state;
    const { total, current, records, type } = source;
    const pagination = {
      onChange: this.loadSourceList,
      total,
      current,
    };

    const columnsConfig =
      type === 'ACTIVITY'
        ? activtyColumns('发售ID', '发售名称', recoData, data => this.onSubmit(data, type))
        : plotColumns('剧情ID', '剧情名称', recoData, data => this.onSubmit(data, type));

    return (
      <>
        <Button className={styles['btn-new']} type="primary" icon="plus" onClick={() => this.setState({ visible: true })}>
          添加推荐
        </Button>
        <Modal title="添加推荐" visible={visible} centered width={1128} maskClosable={false} onCancel={this.handleCancel} footer={null}>
          <Spin spinning={loading}>
            <div style={{ height: 638, overflowY: 'scroll' }}>
              <Form layout="inline">
                <Form.Item>
                  <Select style={{ width: 168 }} defaultValue="ACTIVITY" onChange={v => this.handleChangeType(undefined, v)}>
                    <Select.Option value="PLOT">剧情</Select.Option>
                    <Select.Option value="ACTIVITY">发售</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('keyword')(<Search placeholder="请输入ID或名称" enterButton="搜索" style={{ width: 300 }} allowClear />)}
                </Form.Item>
              </Form>
              <div style={{ marginTop: 20 }}>
                <Table size="large" bordered rowKey="id" pagination={pagination} columns={columnsConfig} dataSource={records} />
              </div>
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({ homemgmt, loading }) => ({
  homemgmt,
  loading: loading.effects['homemgmt/sources'],
}))(NewestDialog);
