import React from 'react';
import { Table, Modal, Spin, Input, Form, Button } from 'antd';
import { connect } from 'dva';
import styles from './List.less';
import activtyColumns from './Columns';

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
      this.loadActs(undefined, 'ACTIVITY');
    }
  }

  showModal = state => {
    this.setState({ visible: state });
  };

  loadActs = (current = 1) => {
    const { dispatch } = this.props;
    const params = {
      current,
      keyword: '',
      size: 10,
      type: 'ACTIVITY',
    };
    dispatch({
      type: 'homemgmt/sources',
      payload: params,
    });
  };

  handleCancel = () => {
    this.showModal(false);
  };

  onAdd = data => {
    const { dispatch } = this.props;
    const { end, start, id } = data;
    const params = {
      activityId: id,
      endAt: end,
      startAt: start,
    };
    dispatch({
      type: 'homemgmt/saveSaleTab',
      payload: params,
    });
  };

  render() {
    const {
      homemgmt: { source },
      loading,
      recoData,
      form: { getFieldDecorator },
    } = this.props;
    const { visible } = this.state;
    const { total, current, records } = source;
    const pagination = {
      onChange: this.loadActs,
      total,
      current,
    };

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
                  {getFieldDecorator('keyword')(<Search placeholder="请输入ID或名称" enterButton="搜索" style={{ width: 300 }} allowClear />)}
                </Form.Item>
              </Form>
              <div style={{ marginTop: 20 }}>
                <Table
                  size="large"
                  bordered
                  rowKey="id"
                  pagination={pagination}
                  columns={activtyColumns('发售ID', '发售名称', recoData, data => this.onAdd(data))}
                  dataSource={records}
                />
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
