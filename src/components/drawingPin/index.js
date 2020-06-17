import React, { Component } from 'react'
import styles from './index.module.scss'
    
export default class DrawingPin extends Component {
     //显示在视图层的初始数据
     constructor(props) {
        super(props)
        this.childrenDom = React.createRef()
        this.childrenDomBottom = React.createRef()
    }
    //页面一打开就调用
    componentDidMount(){
        window.addEventListener('scroll', this.scroll)
    }
    //销毁阶段
    componentWillUnmount(){
        //注意:销毁阶段移除事件监听,不然其他组件会出现bug报错
        window.removeEventListener('scroll',this.scroll)
    }
    //写html,渲染数据
    render() {
        return (
            <>
            <div ref={this.childrenDom}> {this.props.children}</div>
            </>
        )
    }
    scroll = () =>{
        let top = document.documentElement.scrollTop
           if(top > 70){
            this.childrenDom.current.classList.add(styles.children)
           }else{
            this.childrenDom.current.classList.remove(styles.children)
           }
    }
}

