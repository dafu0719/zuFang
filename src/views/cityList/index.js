import React, { Component } from 'react'
import MyNavBar from "../../components/myNavBar"
import styles from './index.module.scss'
import { allCity, hotCity } from "../../utils/requestApi"
import getCurrentCity from "../../utils/getCurrentCity"

import { AutoSizer, List } from 'react-virtualized';  //长列表可是区域渲染
import { Toast } from 'antd-mobile';

export default class CityList extends Component {
    //显示在视图层的初始数据
    constructor(props) {
        super(props)
        this.listDom = React.createRef()
        this.state = {
            myCitFirstLetter:[],
            myCityList: {},
            activeIndex:0
        }
    }
   
    //页面一打开就调用
    componentDidMount() {
        this.getAllCity()
    }
    //写html,渲染数据
    render() {
        let { myCitFirstLetter,activeIndex } = this.state
        // let windowHeight = window.innerHeight
        // let windowWidth = window.innerWidth
        return (
            <div style={{height:"100%"}}>
                <MyNavBar>城市列表</MyNavBar>
                {/* 左边城市列表 */}
                <div className={styles.cittList}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                ref={this.listDom}
                                width={width}     //整个list组件的宽度
                                height={height}   //整个list组件的高度,高度很重要,如果为0则不渲染每一行
                                rowCount={myCitFirstLetter.length}     //总共多少条数据.数据总长度
                                rowHeight={this.rowHeight}//每一条数据高度,可以写死也可以写函数,写函数会自动获取到index索引
                                rowRenderer={this.rowRenderer}   //渲染的每一行数据,大括号里边放函数
                                onRowsRendered={this.onRowsRenderedIndex}   //每次渲染的下标
                                scrollToAlignment="start"
                                scrollToIndex={activeIndex}
                                // scrollTop={100}   //这个是固定到指定个滚动条高度,手动高度一边然后会自动回弹回去
                            />
                        )}
                    </AutoSizer>
                </div>
                {/* 右边关键字索引 */}
                {this.rightName()}
            </div>
        )
    }
    //注册事件
    // 处理城市数据
    async getAllCity() {
        //获取当前所在的城市
        let currentCityRes = await getCurrentCity()
        let {label:currentCity} = currentCityRes
        //获取城市数据
        let res = await allCity({name:currentCity})
        let citylist = res.body
        let newCityList = []
        citylist.forEach((item, index) => {
            // 给每一个城市对象新增一个该城市名词的首个字母的参数
            item.firstLetter = item.pinyin.charAt(0)
            newCityList.push({ label: item.label, firstLetter: item.firstLetter })
        });
        newCityList.sort(function (a, b) {
            return a.firstLetter.localeCompare(b.firstLetter)
        });
        let obj = {}
        newCityList.forEach((item, index) => {
            let firstLetter = item.firstLetter
            // 看对象里边有没以这个字母作为参数名的参数,有就将将当前遍历的对象push到这个数组里边去,没有就将这个字母作为新参数同时将当前遍历的对象用数组包裹起来
            //obj[firstLetter], 这种写法是动态的写法. 意思类似obj.firstLetter
            if (obj[firstLetter]) {
                obj[firstLetter].push(item)
            } else {
                obj[firstLetter] = [item]
            }
        });
        //把对象的key都枚举出来
        let cityIndex = Object.keys(obj)
        // 处理热门城市数据
        let res2 = await hotCity()
        let myHotCity = res2.body
        obj["热门城市"] = myHotCity
        cityIndex.unshift("热门城市")
        // 把当前城市数据新增进去
        obj["定位城市"] = [{"label":currentCity}]
        cityIndex.unshift("定位城市")
        this.setState({myCitFirstLetter:cityIndex, myCityList: obj})
    }
    //左边城市列表
    leftCity() {
        let { myCitFirstLetter, myCityList } = this.state
        return (
            <div className={styles.cittList} style={{ marginTop: "45px" }}>
                {myCitFirstLetter.map((item, index) => {
                    let list = myCityList[item]
                    return (
                        <div className={styles.cittListItem} key={item}>
                            <div className={styles.citytyTitle}>{item}</div>
                            <div className={styles.citytyConyent}>
                                {list.map((itemB, indexB) => {
                                    return <div className={styles.citytyConyentItem} key={itemB.label}>{itemB.label}</div>
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    // 渲染的每一行数据,注意:是每一行
    rowRenderer = ({ key, index, style }) => {
        let { myCitFirstLetter, myCityList } = this.state
        let cityIndex = myCitFirstLetter[index]
        let myCityListItem = myCityList[cityIndex]
        return (
            <div key={key} style={style}>
                <div className={styles.cittListItem} >
                    <div className={styles.citytyTitle}>{cityIndex}</div>
                    <div className={styles.citytyConyent}>
                        {myCityListItem.map((itemB, indexB) => {
                            return <div 
                            className={styles.citytyConyentItem} 
                            onClick={() => this.clickGoHome(itemB)}
                            key={itemB.label}>{itemB.label}</div>
                        })}
                    </div>
                </div>
            </div>
        );
    }
    // 右边关键字母索引
    rightName() {
        let newFirstRight = [...this.state.myCitFirstLetter]
        let {activeIndex} = this.state
        return (
            <div className={styles.rightName}>
                {newFirstRight.map((item, index) => {
                    //因为右边关键字要简写,所以要用三元表达式处理一下,不用一开始的时候写 activeIndex
                    return (
                        <div className={`${styles.rightNameI} ${activeIndex === index && styles.activeRightNameI}`} 
                        onClick={() => this.clickToScorll(index)}
                        key={item}>
                            <span className={styles.rightSpan} key={item}>{this.doNewFirstRight(item)}</span>
                        </div>
                    )
                })}
            </div>
        )
    }
    //获取行高,插件会自动返回一个index对象,值就是下标
    rowHeight = ({ index }) => {
        let { myCitFirstLetter, myCityList } = this.state
        let cityIndex = myCitFirstLetter[index]
        let myCityListItem = myCityList[cityIndex]
        let rowHeight = myCityListItem.length * 34 + 34
        return rowHeight
    }
    // 获取每次渲染的下标
    onRowsRenderedIndex = (res) => {
        // 这里要做个条件判断,因为这里会获取到同样的下标.获取到的下标是当前索引所在的下标就不做其他执行命令
        if(res.startIndex !== this.state.activeIndex){
            this.setState({
                activeIndex:res.startIndex
            })
        }
    }
    // 处理关键字
    doNewFirstRight(isLetter){
        if(isLetter === "热门城市"){
            return "热"
        }else if(isLetter === "定位城市"){
            return "#"
        }else{
            return isLetter.toUpperCase() 
        }
    }
    //获取滚动位置
    clickToScorll = (index) => {
       this.setState({
        activeIndex:index
       })
    }
    //点击城市名称
    clickGoHome = (item) =>{
        let {label} = item
        // 因为不是一线城市是没什么房源的,直接提示暂无房源
      let myHotCity = ["北京","广州","上海","深圳"]
      if(!myHotCity.includes(label)){
          Toast.info('暂无房源', 1);
      }else {
        this.props.history.goBack()
        window.localStorage.setItem('chooseCity', JSON.stringify(item))
      }
         
    }
}