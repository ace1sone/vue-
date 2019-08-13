import React from 'react'
import styles from './TableInfo.less'
import {paymentText, payChannelText, operatingText, reverseTypeText} from '../Text'
import { getImgSrc } from '@/utils/utils'

export default {
  goods: [
    {
      title: '商品',
      key: 'goodsName',
      render: item => (
        <div key={item.proId} className={styles.goods}>
          <img src={getImgSrc(item.pic)} alt={item.name} />
          <div>{item.name}</div>
        </div>
      )
    },
    {
      title: '规格',
      key: 'goodsSpec',
      render: item => (
        <span>
          {
            item.spec.length && item.spec.map(items => (
              <div key={items.basisId}>{items.basisName}：{items.basisValue}</div>
            ))
          }
        </span>
      )
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },
    {
      title: '数量',
      dataIndex: 'num',
      key: 'quantity',
    },
    {
      title: 'SPU ID',
      dataIndex: 'spuId',
      key: 'SPUID',
    },
    {
      title: '卖家ID',
      dataIndex: 'sellerId',
      key: 'sellerId',
    }
  ],
  preferential: [
    {
      title: '扣减类型',
      dataIndex: 'deductionType',
      key: 'deductionType',
    },
    {
      title: '扣减ID',
      dataIndex: 'deductionId',
      key: 'deductionId',
    },
    {
      title: '扣减金额(元)',
      dataIndex: 'deductionPrice',
      key: 'deductionPrice',
    },
  ],
  freight: [
    {
      title: '运费金额(元)',
      dataIndex: 'postage',
      key: 'postage',
    },
    {
      title: '运费模板ID',
      dataIndex: 'shippingTemplateId',
      key: 'shippingTemplateId',
    },
    {
      title: '扣减类型',
      width: 216,
      key: 'freightDeductionType',
      render: (item) => ({
          children: (
            <div>
              {
                item.postagePreferential.map(items => (
                  <div key={items.id} className={styles["freight-preferential"]}>
                    <span>{items.type}</span>
                    <span>{items.id}</span>
                    <span>{items.price}</span>
                  </div>
                ))
              }
            </div>
          ),
          props: {
            colSpan: 3,
          },
        })
    },
    {
      title: '扣减ID',
      width: 216,
      key: 'freightDeductionId',
      render: () => ({
          props: {
            colSpan: 0,
          },
        })
    },
    {
      title: '扣减金额(元)',
      width: 216,
      key: 'freightDeductionPrice',
      render: () => ({
          props: {
            colSpan: 0,
          },
        })
    },
  ],
  pay: [
    {
      title: '支付类型',
      key: 'payType',
      render: item => (
        <span>
          {paymentText(item.paymentFor)}
        </span>
      )
    },
    {
      title: '支付渠道1 (元)',
      key: 'payMethod',
      render: item => (
        <span>
          {payChannelText(item.paymentType)}
        </span>
      )
    },
    {
      title: '实付金额 (元)',
      dataIndex: 'amount',
      key: 'truePayMethod',
    },
    {
      title: '实付时间 (元)',
      dataIndex: 'createdAt',
      key: 'truePayTime',
    },
  ],
  action: [
    {
      title: '操作人',
      dataIndex: 'creator',
      key: 'operatingPeople',
    },
    {
      title: '操作',
      key: 'operating',
      render: item => (
        <span>
          {operatingText(item.action)}
        </span>
      )
    },
    {
      title: '方式',
      key: 'theWay',
      render: item => (
        <span>
          {reverseTypeText(item.reverseType)}
        </span>
      )
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'operatingTime',
    },
  ]
}
