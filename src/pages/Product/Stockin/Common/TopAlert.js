import React from 'react';
import { Alert } from 'antd';


const TopAlert = (props) => {
  const { datas } = props;
  return (
    <Alert
      message="驳回原因"
      description={datas}
      type="warning"
      showIcon
      style={{ marginBottom: 16 }}
    />
  );
}


export default TopAlert;
