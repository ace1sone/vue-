import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './Tab.less'

class Tab extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render(){
    const {data, selected, clickTab} = this.props
    return(
      <div className={styles["tab-box"]}>
        {
          data.map(item => (
            <a
              className={
                classNames(styles.item,
                  selected === item.key ?
                    styles["item-action"] :
                    null
                )
              }
              onClick={() => clickTab(item.key)}
              key={item.key}
            >
              {item.name}
            </a>
          ))
        }
      </div>
    )
  }
}

export default Tab
