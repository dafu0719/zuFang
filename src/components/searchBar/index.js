import React from 'react'
import styles from './index.module.scss'
import { withRouter } from "react-router-dom"

function SearchBar(props) {
    return (
        <div className={styles.topSearchBarBac}>
            <div className={styles.topSearchBar}>
                <div className={styles.topSearchBarLeft} onClick={() => props.history.push("/cityList")}>
                    {props.myCity}
                    <i className="iconfont icon-arrow" style={{ marginLeft: "4px", color: "#888888"}}></i>
                    <div style={{ height: "18px", width: "2px", backgroundColor: "#c6c6c6", marginLeft: "14px" }}></div>
                </div>
                <i className="iconfont icon-search" style={{ color: "#c6c6c6", marginLeft: "12px" }}></i>
                <input placeholder="请输入小区或地址" className={styles.topSearchBarInput}/>
            </div>
            <i className="iconfont icon-map"
                style={{
                color: (props.rightColor === true)? "#0ebb6f":"#ffffff", 
                fontSize: "26px", 
                marginLeft: "10px" }}
                onClick={() => props.history.push("/mapFindCity")}
            ></i>
        </div>
    )
}



export default withRouter(SearchBar)