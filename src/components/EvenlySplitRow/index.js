import React from 'react';
import { Row, Col } from 'antd';

import PropTypes from 'prop-types';

const EvenlySplitedRow = ({ children, gutter, minCols, noSplit }) => {
  const childrenLength = React.Children.count(children);
  const minSpan = 24 / minCols;
  let colSpan = Math.floor(24 / childrenLength);
  if (colSpan > minSpan || noSplit) {
    colSpan = minSpan;
  }
  return (
    <Row gutter={gutter}>
      {React.Children.map(children, child => (
        <Col span={colSpan}>{child}</Col>
      ))}
    </Row>
  );
};

EvenlySplitedRow.defaultProps = {
  gutter: 16,
  minCols: 2, // at least 2 cols
  noSplit: false,
};

EvenlySplitedRow.propTypes = {
  gutter: PropTypes.number, // gutter between cols
  minCols: PropTypes.number, // at least [number] cols
  noSplit: PropTypes.bool,
};

export default EvenlySplitedRow;
