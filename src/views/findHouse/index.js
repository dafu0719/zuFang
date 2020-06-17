import React, { Component } from 'react'
import SearchBar from '../../components/searchBar';
import HouseItem from '../../components/houseItem';
import DrawingPin from '../../components/drawingPin';
import styles from './index.module.scss'
import getCurrentCity from "../../utils/getCurrentCity"
import { condition, findHouse } from "../../utils/requestApi"
import Picker from "./components/picker"
import { Toast } from 'antd-mobile';
import { AutoSizer, List, WindowScroller, InfiniteLoader } from 'react-virtualized';  //长列表可视区域渲染

export default class FindHouse extends Component {
    //显示在视图层的初始数据
    constructor(props) {
        super(props)
        this.myPicker = React.createRef();
        this.state = {
            houseList: [],   //房屋列表
            isMyCity: "",
            allCount:'',
            titList: [
                { title: "区域", type: "area" },
                { title: "方式", type: "mode" },
                { title: "租金", type: "price" },
                { title: "筛选", type: "filtrate" },
            ],
            //标签的当前状态,默认都是false,false就是不亮显,点开了或者点开过就是显示true亮显
            titleStatus: {
                area: false,
                mode: false,
                price: false,
                filtrate: false
            },
            currentOpenType: '',    //当前打开的标签类型,显示哪个弹出框的根据
            allFiltrateData: {},    //所有筛选条件数据
        }
    }
    //页面一打开就调用
    componentDidMount() {
        this.getCondition(1,20)
        this.tabNeedLight()
        this.isGetCurrentCity()
    }
    //写html,渲染数据
    render() {
        let { currentOpenType, houseList, allCount } = this.state
        return (
            <div className={styles.findHouse} style={{ height: "100%" }}>
                {/* 顶部搜索栏 */}
                <SearchBar rightColor={true} myCity={this.state.isMyCity}></SearchBar>
                {currentOpenType !== '' && currentOpenType !== 'filtrate' &&
                    <div className={styles.pickerMask} onClick={this.clickMask}></div>}
                {/* 将标签栏和弹出框统一放到一个盒子里,因为他们两个都在遮罩层的上一层 */}
                <div className={styles.pickerMaskUp}>
                    {this.myTabBar()}
                    {this.showPicker()}
                </div>
                {/* 渲染列表 */}
                {this.renderLisst()}

            </div>
        )
    }
    //注册事件
    //判断某一行是不是加载完毕
    isRowLoaded = ({ index }) => {
        return !!this.state.houseList[index]
    }
    //加载更多
    loadMoreRows = ({ startIndex, stopIndex }) => {
            return new Promise((resolve, reject) => {
                this.getCondition(startIndex,stopIndex)
                console.log("加载更多")
                resolve()
            })
        
    }
    //渲染列表数据
    renderLisst = () =>{
      let { currentOpenType, houseList, allCount } = this.state   
      if(allCount){
        return (
            <div className={styles.houseList}>
            <InfiniteLoader 
            isRowLoaded={this.isRowLoaded}   //判断每一行是不是加载完成
            loadMoreRows={this.loadMoreRows}   //加载更多
            rowCount={allCount}             //总行数
            // minimumBatchSize={20}           //每次加载的最小行数
            >{({ onRowsRendered }) => (
                <WindowScroller>{({ isScrolling, scrollTop }) => (    //连整个窗口一起滚动
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                onRowsRendered={onRowsRendered}
                                autoHeight
                                isScrolling={isScrolling}   //得到表面列表正在滚动
                                scrollTop={scrollTop}      //得到滚动到页面的距离,这个不打开页面下边会多出一截
                                //  ref={this.listDom}    //用来获取DOM,理解是得到动态生成出来的没一截数据的DOM
                                width={width}     //整个list组件的宽度
                                height={height}   //整个list组件的高度,高度很重要,如果为0则不渲染每一行
                                rowCount={allCount}     //总共多少条数据.数据总长度
                                rowHeight={99}   //每一条数据高度,可以写死也可以写函数,写函数会自动获取到index对象
                                rowRenderer={this.rowRenderer}   //渲染的每一行数据,大括号里边放函数
                                scrollToAlignment="start"   //设置开始就是,每一行对齐总是对齐到列表的顶部
                            />
                        )}
    
                    </AutoSizer>
                )}</WindowScroller>
            )}
            </InfiniteLoader>
        </div>
          )
      }
    }
    // 渲染的每一行数据,注意:是每一行
    rowRenderer = ({
        key, //行数组中唯一的键
        index, //集合中的行索引
        isScrolling, //该列表目前正在滚动
        isVisible, // 这一行在列表中是可见的 (eg it is not an overscanned row)
        style, // 样式对象
    }) => {
        let { houseList } = this.state
        let houseItem = houseList[index]
        //这里要加一个条件判断,就是当下一条数据还没获取到阿斗时候不要生成子组件,不然直接空值传过去了,瞬间报错
        if(houseItem){
            return (
                <div key={key} style={style}>
                    <HouseItem needItem={houseItem}></HouseItem>
                </div>
            );
        }else if(!houseItem){
            //如果数据还没获取到就显示色块,骨架屏
            return  (
                <div key={key} style={style}>
                    <div className={styles.isLoading}></div>
                </div>
            );
      
        }
       
    }
    //点击遮罩层
    clickMask = () => {
        let { currentOpenType: type } = this.state
        this.clickCancel(type)
    }
    // 点击标签,然后给当前使用的标签类型赋值,把点开的那个标签亮显
    clickTabBarItem = (type) => {
        let { titleStatus } = this.state
        //给当前点击的标签亮显之后然后再重新判断一下其他两个有没新数据.没有新数据的就变暗回去
        this.setState({
            currentOpenType: type,
            titleStatus: { ...titleStatus, [type]: true }
        }, () => {
            let typeList = ["area", "mode", "price"]
            let selectValues = JSON.parse(window.localStorage.getItem("selectValues"))
            //使用排他思想看其他两个有没点新数据
            let otherArr = typeList.filter((item, index) => { return item !== type })
            otherArr.forEach((item, index) => {
                if ((selectValues[item])[0] === 'null') {
                    // this.setState({
                    //     titleStatus:{...titleStatus,[item]:false}
                    // })
                }
            });
        })
    }
    //通过当前点开的标签,生成相应的弹出框,同时传相应的数据
    showPicker() {
        let { currentOpenType,
            allFiltrateData: { rentType, price, area, characteristic, floor, oriented, roomType } }
            = this.state
        let toData
        //最外边要加个条件判断,不然一开始没有值的都传过去了,瞬间报错
        if (currentOpenType !== '') {
            if (currentOpenType === "mode") {
                toData = rentType
            } else if (currentOpenType === "price") {
                toData = price
            } else if (currentOpenType === "area") {
                toData = area.children
            } else if (currentOpenType === "filtrate") {
                toData = { roomType, oriented, floor, characteristic }
            }
            return <Picker
                toData={toData}
                currentOpenType={currentOpenType}
                ref={this.myPicker}
                clickMask={this.clickMask}
                clickCancel={() => this.clickCancel(currentOpenType)}
                allTitleStatusFalse={this.allTitleStatusFalse}
            ></Picker>
        }
    }
    //标签栏
    myTabBar() {
        let { titList, titleStatus } = this.state
        return (
            <DrawingPin>
                <div className={styles.tabBar}>
                    {
                        titList.map((item, index) => {
                            let type = item.type
                            let currentTitleStatus = titleStatus[type]
                            //如果缓存里边这个标签里边是有新东西的,它也要亮显
                            return (
                                <div className={styles.tabBarItem} onClick={() => this.clickTabBarItem(type)} key={item.type}>
                                    <span style={{ color: currentTitleStatus ? "#29b082" : '' }}>{item.title}</    span>
                                    <div style={{ borderTop: (currentTitleStatus) ? "6px solid #29b082" : '' }}
                                        className={styles.triangle}></div>
                                </div>
                            )
                        })
                    }
                </div>
            </DrawingPin>
        )
    }
    //获取房屋条件
     async getCondition(start,end) {
        Toast.loading('加载中', 30)
        let { value } = await getCurrentCity()
        let res = await condition(value)
        let res2 = await findHouse({ 
            cityId: value,
            start,
            end
        })
        Toast.hide()
        this.setState({
            allFiltrateData: res.body,
            houseList: [...this.state.houseList, ...res2.body.list],
            allCount: res2.body.count,
        })

    }
    // 获取城市
    async isGetCurrentCity() {
        let { label } = await getCurrentCity()
        this.setState({ isMyCity: label })
    }
    //点击子组件的.点击取消按钮
    //判断里边的参数有被选,
    //有新被选的就将当前打开的标签设置为空就可以了,没有就将当前打开的标签设置为空同时将标签设置为false
    //直接调用子组件的值,这里感觉真的只能用ref了
    //如果不是筛选框就比较简单,是筛选框就要判断里边的多个属性了
    clickCancel = (type) => {
        let { selectValues } = this.myPicker.current.state
        let { roomType, oriented, floor, characteristic } = selectValues
        let { titleStatus } = this.state
        if (type !== "filtrate" && selectValues[type][0] === 'null') {
            this.setState({
                currentOpenType: '',
                titleStatus: {
                    ...titleStatus, [type]: false
                }
            })
        } else if (type === "filtrate" && roomType.length === 0 && oriented.length === 0
            && floor.length === 0 && characteristic.length === 0) {
            this.setState({
                currentOpenType: '',
                titleStatus: {
                    ...titleStatus, [type]: false
                }
            }, () => window.localStorage.setItem('selectValues', JSON.stringify(selectValues)))
            //筛选框不管有没新数据都要存储到本地更新一下,同步
        } else {
            if (type === "filtrate") {
                this.setState({ currentOpenType: '' },
                    () => window.localStorage.setItem('selectValues', JSON.stringify(selectValues)))
            } else {
                this.setState({ currentOpenType: '' })
            }
        }
    }
    //所有标签关闭
    allTitleStatusFalse = () => {
        this.setState({
            titleStatus: {
                area: false,
                mode: false,
                price: false,
                filtrate: false
            }
        })
    }
    //一打开页面就看历史里边有没数据,有就将有数据的标签亮显
    tabNeedLight = () => {
        let { titleStatus } = this.state
        let selectValues = JSON.parse(window.localStorage.getItem("selectValues"))
        let arr = ["roomType", "oriented", "floor", "characteristic"]
        for (var key in selectValues) {
            if (arr.includes(key)) {
                if (selectValues[key].length > 0) {
                    titleStatus["filtrate"] = true
                }
            } else {
                if ((selectValues[key])[0] !== 'null' && selectValues[key].length !== 0) {
                    titleStatus[key] = true
                }
            }
        }
        this.setState({ titleStatus })
    }
}