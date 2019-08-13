import ReactDOM from 'react-dom';
import { Icon, Modal, Button } from 'antd';
import React from 'react';
import styles from './DescConfirm.less';

export default class DescConfirm extends React.Component {
  static parentNode = null;

  static resolver = null;

  static show(props = {}) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    DescConfirm.parentNode = div;

    function render() {
      ReactDOM.render(<DescConfirm visible {...props} />, div);
    }

    render(props);

    return new Promise(resolve => {
      DescConfirm.resolver = resolve;
    });
  }

  static destroy() {
    const div = DescConfirm.parentNode;
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  handleClick = index => {
    DescConfirm.destroy();
    DescConfirm.resolver(index);
  };

  render() {
    const { title, body, visible } = this.props;

    return (
      <Modal visible={visible} title={null} closable={false} bodyStyle={{ borderBottomWidth: 0 }} centered footer={null}>
        <div>
          <Icon type="close-circle" theme="filled" className={styles.icon} />
          <span className={styles.title}>{title || '警告'}</span>
        </div>
        <p className={styles.confirm_body}>{body || '该描述已关联多个SPU，请在无关联的前提下进行操作'}</p>
        <div className={styles.button_group}>
          <Button key="first" type="primary" onClick={() => this.handleClick(0)}>
            下载关联SPU列表
          </Button>
          <Button key="second" onClick={() => this.handleClick(1)}>
            知道了
          </Button>
          <Button key="third" onClick={() => this.handleClick(2)}>
            继续操作
          </Button>
          {/* <Fragment>{buttons}</Fragment> */}
        </div>
      </Modal>
    );
  }
}
