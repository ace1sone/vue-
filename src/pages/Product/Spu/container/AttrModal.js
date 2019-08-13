import React from 'react';
// import { Modal, Table, Input, Row, Col } from 'antd';
import { Modal, Table } from 'antd';
// import { useMount } from 'react-use';
import styles from './AttrModal.less';

// const { Search } = Input;

function AddAttr({ visible = false, title, onSearch = () => {}, onCancel = () => {}, tableProps = {}, ...otherProps }) {
  const modalProps = {
    visible,
    title,
    onCancel,
    footer: null,
    onConfirm(v) {
      onSearch(v);
    },
    width: 816,
    className: styles.modalContainer,
    ...otherProps,
  };

  return (
    <Modal {...modalProps}>
      {/* <Row>
        <Col span={16}>
          <Search placeholder="输入ID或者名称" onSearch={onSearch} allowClear enterButton />
        </Col>
      </Row> */}
      <Table
        bordered
        size="small"
        className={styles.table}
        style={{
          width: '768px',
        }}
        {...tableProps}
      />
    </Modal>
  );
}

export default AddAttr;
