import React from 'react';
import { Modal, Button, Row, Col } from 'antd';
import router from 'umi/router';
import styles from './DynamicDialog.less';

const options = [
  { name: '图文动态', value: 'IMAGE', id: 1 },
  { name: '视频动态', value: 'VIDEO', id: 2 },
  { name: '音频动态', value: 'AUDIO', id: 3 },
];

class DynamicDialog extends React.Component {
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { visible } = this.props;
    return (
      <Modal title="请选择动态类型" visible={visible} centered maskClosable={false} onCancel={this.handleCancel} footer={null}>
        <div style={{ height: 136, width: 436 }}>
          {options.map(item => (
            <Row key={item.id}>
              <Col span={8} offset={8}>
                <Button
                  type="primary"
                  className={styles['dialog-btn']}
                  onClick={() => router.push(`/activity/npc/dynamic/list/detail?type=${item.value}`)}
                >
                  {item.name}
                </Button>
              </Col>
            </Row>
          ))}
        </div>
      </Modal>
    );
  }
}

export default DynamicDialog;
