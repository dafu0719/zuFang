import React, { Component } from 'react'
import SearchBar from '../../components/searchBar';
// import styles from './index.module.scss'
    
export default class News extends Component {
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
            <div>
                {/* <SearchBar></SearchBar> */}
                我是资讯页
            </div>
        )
    }
    //注册事件
    
}