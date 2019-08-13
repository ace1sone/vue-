import React from 'react';
import { Button } from 'antd';

import FooterToolbar from '@/components/FooterToolbar';

class TaskFooter extends React.Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    this.resizeFooterToolbar();
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  render() {
    const { width } = this.state;
    const { action, loading, goBack, onCrash, submit, onDelete } = this.props;
    return (
      <FooterToolbar
        style={{ width }}
        extra={
          action === '2' && (
            <Button type="danger" onClick={onDelete} style={{ marginRight: 'auto' }} loading={loading}>
              删除
            </Button>
          )
        }
      >
        {action === '1' && <Button onClick={goBack}>返回</Button>}
        {action !== '1' && (
          <div>
            <Button onClick={onCrash}>取消</Button>
            <Button type="primary" onClick={submit} loading={loading}>
              提交
            </Button>
          </div>
        )}
      </FooterToolbar>
    );
  }
}

export default TaskFooter;
