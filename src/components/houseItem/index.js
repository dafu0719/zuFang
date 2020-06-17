import React from 'react'
import styles from './index.module.scss'
import { withRouter } from "react-router-dom"


function HouseItem(props) {
    let needItem = props.needItem
    return (
        <div className={styles.houseListItem}>
            <img src={`http://localhost:8080${needItem.houseImg}`}
                width="90" height="72" style={{ borderRadius: "4px" }} />
            <div className={styles.houseFont}>
                <p style={{ fontWeight: "bold" }}>{needItem.title}</p>
                <p className={styles.secondP}>{needItem.desc}</p>
                <div className={styles.thirdP}>
                    <span className={styles.thirdPspan1}>公寓</span>
                    <span className={styles.thirdPspan2}>近地铁</span>
                    <span className={styles.thirdPspan3}>押一付一</span>
                    <span className={styles.thirdPspan4}>随时看房</span>
                </div>
                <div className={styles.forthP}>
                    <span className={styles.inForthPspan}>{needItem.price}</span>元/月
            </div>
            </div>
        </div>
    )
}


export default withRouter(HouseItem)