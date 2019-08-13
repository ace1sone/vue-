import React from 'react';
import Scrollspy from 'react-scrollspy';
import { StickyContainer, Sticky } from 'react-sticky';
import cn from 'classnames';
// import PropTypes from 'prop-types';

import styles from './index.less';

function TabScrollSpy({
  sticky = true,
  topOffset = 50,
  tabs,
  children,
  wrapperClassName,
  activeClassName,
  itemClassName,
  stickyProps,
  scrollspyProps,
}) {
  const onItemClick = id => {
    const targetDiv = document.getElementById(id);
    targetDiv.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const items = tabs.map(__ => __.id);

  const scrollspy = (
    <Scrollspy items={items} currentClassName={cn(styles.active, activeClassName)} {...scrollspyProps}>
      {tabs.map(__ => (
        <span key={__.id} onClick={onItemClick.bind(this, __.id)} className={cn(styles['tab-item'], itemClassName)}>
          {__.label}
        </span>
      ))}
    </Scrollspy>
  );

  if (!sticky) {
    return scrollspy;
  }

  const StickyHeader = ({ style }) => (
    <div style={{ ...style }} className={cn(styles['tab-header-container'], wrapperClassName)}>
      {scrollspy}
    </div>
  );
  return (
    <StickyContainer>
      <Sticky topOffset={topOffset} {...stickyProps}>
        {StickyHeader}
      </Sticky>
      {children}
    </StickyContainer>
  );
}

// TabScrollSpy.PropTypes = {
//   tabs: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number,
//       label: PropTypes.string,
//     })
//   ),
// };

export default TabScrollSpy;
