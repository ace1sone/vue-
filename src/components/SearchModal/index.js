import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Input } from 'antd';

const SearchModal = props => {
  const { children, placeholder, onSearch, onOk, onCancel, visible, title } = props;

  return (
    <Modal visible={visible} title={title} onOk={onOk} onCancel={onCancel} closable destroyOnClose>
      <Input.Search
        placeholder={placeholder}
        onSearch={value => onSearch(value)}
        enterButton
        style={{ width: 300 }}
        allowClear
      />
      {children}
    </Modal>
  );
};

SearchModal.defaultProps = {
  placeholder: '请输入要搜索的内容',
  title: null,
};

SearchModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SearchModal;
