import React from 'react';
import { connect } from 'dva';
import { Card, Table, Button } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './table.config';
import AddressDialog from './AddressDialog';

class List extends React.Component {
  state = {
    addressModal: false,
    id: '',
  };

  componentDidMount() {
    this.loadList();
  }

  loadList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'address/getAddressList',
      payload: {},
    });
  };

  showAddress = id => {
    this.setState({ addressModal: true, id });
  };

  refrechPage = () => {
    this.loadList();
    this.setState({ addressModal: false });
  };

  render() {
    const { address } = this.props;
    const { addressModal, id } = this.state;

    return (
      <PageHeaderWrapper title="门店地址管理">
        <Card bordered={false}>
          <div style={{ marginTop: 10, marginBottom: 10, display: 'flex' }}>
            <Button style={{ marginLeft: 'auto' }} type="primary" icon="plus" onClick={() => this.setState({ addressModal: true, id: '' })}>
              新建地址
            </Button>
          </div>
          <Table pagination={false} columns={columns({ showAddress: this.showAddress })} dataSource={mapDataToCols(address || [])} align="center" />
        </Card>
        <AddressDialog visible={addressModal} id={id} onCancel={this.refrechPage} />
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ address, loading }) => ({
  address: address.data,
  loading: loading.models.address,
});

export default connect(mapStateToProps)(List);
