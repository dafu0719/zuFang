import React, { Component } from 'react'
import styles from './index.module.scss'
import { Route } from "react-router-dom";

import { TabBar } from 'antd-mobile';


import FindHouse from "../findHouse"
import News from "../news"
import My from "../my"
import Index from "../index"

export default class Home extends Component {
    //显示在视图层的初始数据
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: this.props.location.pathname,
            hidden: false,
            tabList: [
                {icon:'icon-index',name:"首页",url:"/home"},
                {icon:'icon-findHouse',name:"找房",url:"/home/findHouse"},
                {icon:'icon-info',name:"资讯",url:"/home/news"},
                {icon:'icon-my',name:"我的",url:"/home/my"}
            ],
        }
    }
    //页面一打开就调用
    componentDidMount() {
         
    }
    //写html,渲染数据
    render() {
        return (
            <div style={{ height:"100%"}}>
                {/*路由切换部分*/}
                <Route exact path="/home" component={Index} />
                <Route path="/home/findHouse" component={FindHouse} />
                <Route path="/home/news" component={News} />
                <Route path="/home/my" component={My} />
                {/*底部tabBar*/}
                {this.mapTabBarItem()}
            </div>
        )
    }
    //注册事件
    mapTabBarItem() {
        return (
            <TabBar unselectedTintColor="#949494" tintColor="#75cbab" barTintColor="white" hidden={this.state.hidden}>
                {this.state.tabList.map((item, index) => {
                    return (
                        <TabBar.Item title={item.name} key="Life"
                            icon={<i className={`iconfont ${item.icon}`} style={{width: '22px', height: '22px'}}></i>}
                            selectedIcon={<i className={`iconfont ${item.icon}`} style={{width: '22px', height: '22px'}}></i>}
                            selected={this.state.selectedTab === item.url}
                            onPress={() => {
                                if(item.url !== this.props.location.pathname){
                                    this.props.history.push(item.url)
                                    this.setState({
                                        selectedTab: item.url,
                                    });
                                }
                            }}
                            data-seed="logId"
                        >
                        </TabBar.Item>
                    )
                })}
            </TabBar>
        )
    }
  
    
}