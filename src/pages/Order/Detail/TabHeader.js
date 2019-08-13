import React, { PureComponent } from 'react';
import styles from './TabHeader.less'

class TabHeader extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render(){
    const {title} = this.props
    return(
      <div className={styles["tabHeader-box"]}>
        {title}
      </div>
    )
  }
}

export default TabHeader
