import React from 'react'
import styles from './index.module.scss'
import { withRouter } from "react-router-dom"


function Title({ leftName, isNeedMore, needWhiteBackcol }) {
    return (
        <div>
            <div className={styles.zuFangXiaoZuTitle}
                style={{ "background-color": (needWhiteBackcol) ? "#ffffff" : "" }}>
                <span className={styles.zuFangXiaoZuTitleLeft}>{leftName}</span>
                {isNeedMore ? "更多" : null}
            </div>
        </div>
    )
}


export default withRouter(Title)