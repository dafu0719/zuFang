import React, { Component } from 'react'
import styles from './index.module.scss'
    
export default class HouseDetail extends Component {
    //显示在视图层的初始数据
    constructor(props) {
        super(props)
        this.state = {
        
        }
    }
    //页面一打开就调用
    componentDidMount(){
        
    }
    //写html,渲染数据
    render() {
        return (
            <div style={{height:"100%"}}>
                我是详情页面
            </div>
        )
    }
    //注册事件
    
}