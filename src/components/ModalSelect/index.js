import React from 'react';
import _ from 'lodash';
import { Modal, Button, Input, Table, Icon } from 'antd';

class ModalSelect extends React.Component {
  static defaultProps = {
    onOK: () => {},
    onChange: () => {},
    search: true,
    modalProps: {},
  };

  state = {
    visible: false,
    selectedRowKey: undefined,
    selectedRecord: null,
    selected: null,
  };

  static getDerivedStateFromProps(props, state) {
    const { value } = props;
    const { selectedRecord } = state;
    if (!_.isEqual(value, selectedRecord)) {
      return {
        selectedRecord: value,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.state;
    const { onSearch } = this.props;
    // every time the modal opens, pull fresh data from server
    if (prevState.visible !== visible && visible) {
      onSearch();
    }
  }

  showModal = state => {
    this.setState({ visible: state });
  };

  handleSubmit = () => {
    const { onChange, onOK = () => {} } = this.props;
    const { selected } = this.state;
    onOK(selected);
    onChange(selected);
    this.showModal(false);
  };

  handleCancel = () => {
    this.showModal(false);
  };

  handleSelectChange = (selectedRowKeys, selectedRows) => {
    const { selectedRowKey } = this.state;
    const newSelect = selectedRowKeys.filter(key => key !== selectedRowKey);
    const newSelectedRowKey = newSelect[0];
    const newSelectRecord = selectedRows.find(item => item.id === newSelectedRowKey);
    this.setState({
      selectedRowKey: newSelectedRowKey,
      selected: newSelectRecord,
    });
  };

  handleRowClick = record => {
    this.setState({ selected: record });
  };

  render() {
    const { title, onSearch, columns, dataSource, loading, disabled, search, modalProps } = this.props;
    const { visible, selectedRowKey, selectedRecord } = this.state;

    const rowSelection = {
      selectedRowKeys: [selectedRowKey],
      onChange: this.handleSelectChange,
    };

    return (
      <>
        {selectedRecord ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{selectedRecord.name}</span>
            <Button size="small" onClick={() => this.showModal(true)} style={{ marginLeft: 'auto' }} disabled={disabled}>
              <Icon type="edit" />
              修改
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={() => this.showModal(true)} disabled={disabled}>
            请选择
          </Button>
        )}
        <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.handleCancel} {...modalProps}>
          {search && (
            <div style={{ marginBottom: 16 }}>
              <Input.Search enterButton allowClear onSearch={onSearch} />
            </div>
          )}
          <Table
            size="small"
            loading={loading}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            bordered
            onRow={record => ({
              onClick: () => {
                this.handleRowClick(record);
              },
            })}
          />
        </Modal>
      </>
    );
  }
}

export default ModalSelect;
