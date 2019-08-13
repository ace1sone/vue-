import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button, message } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@Form.create()
class btns extends React.Component {
  state = { use1: true, use2: true };

  sync1 = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ops/userSync',
      success: res => {
        if (res.header.code === 2000) {
          message.info('通过成功，请耐心等待');
        }
      },
    });
    this.setState({
      use1: false,
    });
    setTimeout(() => {
      this.setState({
        use1: true,
      });
    }, 10 * 60 * 1000);
  };

  sync2 = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ops/activitySync',
      success: res => {
        if (res.header.code === 2000) {
          message.info('通过成功，请耐心等待');
        }
      },
    });
    this.setState({
      use2: false,
    });
    setTimeout(() => {
      this.setState({
        use2: true,
      });
    }, 10 * 60 * 1000);
  };

  render() {
    const { use1, use2 } = this.state;
    return (
      <PageHeaderWrapper title="数据同步">
        <Card bordered={false}>
          <Button type="primary" onClick={() => this.sync1()} disabled={!use1} style={{ marginRight: 10 }}>
            同步1
          </Button>
          用户，运单，订单，商品，库存数据，每十小时只能同步十次，每次耗时10-15分钟
        </Card>
        <Card bordered={false}>
          <Button type="primary" onClick={() => this.sync2()} disabled={!use2} style={{ marginRight: 10 }}>
            同步2
          </Button>
          活动信息同步，每一小时只能同步2次，每次耗时3-15分钟
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ ops, loading }) => ({
  servicedata: ops.data,
  loading: loading.models.ops,
});

export default connect(mapStateToProps)(btns);
