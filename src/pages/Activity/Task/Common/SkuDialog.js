import React from 'react';
import { Table, Modal, Spin, Form, InputNumber } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

const getBasis = text => {
  if (text) {
    const { basisName, basisValue } = text;
    return `${basisName}:${basisValue}`;
  }
};

const mapDataToCols = (data = []) =>
  data.map(item => ({
    key: item.id,
    skuImg: item.skuImg,
    spuName: item.spuName,
    skuId: item.id,
    basisList: item.basisList,
    skuAvailableNumber: item.totalActAvaNumber,
    actions: { stock: item.stock, id: item.id },
  }));

@Form.create()
class SkuDialog extends React.Component {
  state = {
    skuDetail: [],
  };

  componentDidUpdate(preProps) {
    const {
      spuObj: { spuId },
    } = this.props;
    const {
      spuObj: { spuId: PreSpuId },
    } = preProps;
    if (!_.isEqual(spuId, PreSpuId)) {
      this.loadSkus(spuId);
    }
  }

  loadSkus = async id => {
    const {
      dispatch,
      spuObj: { id: taskId, currentSpu },
    } = this.props;
    const res = await dispatch({
      type: 'task/getSkus',
      payload: {
        spuId: id,
        taskId,
      },
    });
    // console.log('传进来的spu', currentSpu);

    if (currentSpu && !_.isEmpty(currentSpu.skuRespList) && res.data) {
      res.data.forEach(ele => {
        currentSpu.skuRespList.forEach(__ => {
          if (ele.id === __.id && __.stock && __.stock > 0) {
            const itself = ele;
            itself.stock = __.stock;
          }
        });
      });
    }
    this.setState({ skuDetail: res.data });
  };

  handleStockSum = () => {
    const {
      onCancel,
      spuObj: { spuId },
    } = this.props;
    const getStocks = this.handleInput();
    const sum = getStocks.reduce((pre, curr) => {
      return curr.stock + pre;
    }, 0);

    onCancel(sum, spuId);
  };

  handleInput(v, id, spuId) {
    const { skuDetail } = this.state;
    const newData = _.cloneDeep(skuDetail);
    const skuRespList = [];
    if (v || v === 0) {
      newData.forEach(item => {
        if (item.id === id) {
          const itemChildren = item;
          itemChildren.stock = v;
        }
      });
    }
    newData.forEach(__ => {
      // if (__.stock || __.stock === 0) {
      skuRespList.push({ stock: __.stock || 0, id: __.id, spuId: __.spuId });
      // }
    });

    this.setState({ skuDetail: newData });
    const { onSave } = this.props;
    onSave(skuRespList, spuId);

    return skuRespList;
  }

  render() {
    const {
      visible,
      onCancel,
      loading,
      spuObj: { currentSpu, spuId, action },
    } = this.props;
    const { skuDetail } = this.state;

    const skuListColumns = () => {
      return [
        {
          title: '商品图片',
          dataIndex: 'skuImg',
          render(skuImg) {
            return <img src={skuImg} alt="SKU图片" style={{ width: 40 }} />;
          },
        },
        {
          title: '商品名称',
          dataIndex: 'spuName',
        },
        {
          title: 'SKU ID',
          dataIndex: 'skuId',
        },
        {
          title: '规格01',
          dataIndex: 'basisList[0]',
          render(text) {
            return getBasis(text);
          },
        },
        {
          title: '规格02',
          dataIndex: 'basisList[1]',
          render(text) {
            return getBasis(text);
          },
        },

        {
          title: '上架可售数',
          dataIndex: 'skuAvailableNumber',
        },
        {
          title: '任务商品数量',
          dataIndex: 'actions',
          render: (text, record) => {
            if (action === '1') {
              return <span>{text.stock}</span>;
            }
            return (
              <InputNumber
                min={0}
                max={record.skuAvailableNumber}
                value={text.stock}
                disabled={record.skuAvailableNumber === 0}
                onChange={v => this.handleInput(v, text.id, spuId)}
                type="number"
              />
            );
          },
        },
      ];
    };

    return (
      <Modal title="设置" visible={visible} onOk={this.handleStockSum} centered width={1128} maskClosable={false} onCancel={onCancel}>
        <Spin spinning={loading === undefined ? false : !!loading}>
          <div style={{ height: 638, overflowY: 'scroll' }}>
            <div style={{ marginTop: 20 }}>
              <Table
                size="small"
                bordered
                rowKey="skuId"
                pagination={false}
                columns={skuListColumns(currentSpu.skuRespList, action)}
                dataSource={mapDataToCols(skuDetail || [])}
              />
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ task, loading }) => ({
  task,
  loading: loading.effects['task/getSkus'],
}))(SkuDialog);
