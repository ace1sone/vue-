import React from 'react';
import { Alert } from 'antd';


const TopAlert = (props) => {

  const { datas } = props;
  const { outboundStatus, dismissReason, invalidReason } = datas;
  const isReject = outboundStatus === '2' || outboundStatus === 2;
  return (
    <Alert
      message={isReject ? "驳回原因" : "作废原因"}
      description={isReject ? dismissReason : invalidReason}
      type={isReject ? "warning" : "error"}
      showIcon
      style={{ marginBottom: 16 }}
    />
  );
}


export default TopAlert;
