import React, { Component } from 'react'
import styles from './index.module.scss'
import MyNavBar from "../../components/myNavBar"
import HouseItem from "../../components/houseItem"
import { areaCity, areaHouse } from "../../utils/requestApi"
import { Toast } from 'antd-mobile';

let BMap = window.BMap
export default class MapFindCity extends Component {
    //显示在视图层的初始数据
    constructor(props) {
        super(props)
        this.state = {
            cityBoxShow:false,
            areaHouseList:[]
        }
    }
    //页面一打开就调用
    componentDidMount() {
        this.mapInit()
    }
    //写html,渲染数据
    render() {
        return (
            <div className={styles.mapFindCity}>
                <MyNavBar>地图找房</MyNavBar>
                <div id="container" style={{ height: "667px", width: "100%" }}></div>
                {/* 租房列表弹出框 */}
                <div className={`${styles.popup} 
                ${this.state.cityBoxShow === true? styles.showPopup : null}`}>
                      <div className={styles.title}>
                            房屋列表<span className={styles.moreHousr}>更多房源</span>
                      </div>
                      <div className={styles.houseList}>
                          {this.state.areaHouseList.map((item,index) => {
                              return <HouseItem needItem={item} key={item.houseCode}></HouseItem>
                          })}
                      </div>
                </div>
            </div>
        
        )
    }
    //注册事件
    //使用百度地图
    mapInit = () => {
        var map = new BMap.Map("container");
        //react里边this指向的是react全局
        this.map = map
        // 给map增加一个事件监听,一触摸移动地图就取消弹框
        map.addEventListener('touchmove',()=>{
            if(this.state.cityBoxShow === true){
              this.setState({cityBoxShow:false})
            }
         })
        // 创建点坐标  
        let { label: currentcityName, value: cityId } = JSON.parse(window.localStorage.getItem("chooseCity"))
        map.centerAndZoom(currentcityName, 11);      //设置缩放级别和中心点,第一个参数会将地址转成经纬度
        // 增加控件
        map.addControl(new BMap.NavigationControl());    //平移缩放控件
         // 渲染覆盖物
         this.renderLabel(cityId)
    }

    // 将请求租房数据和接下来要渲染的覆盖物封装成一个函数, 有形参, 这样就可以复用了, 形参是地区的id
    renderLabel = async (id) => {
        Toast.loading('加载中',30)
        // 请求数据
        let res = await areaCity(id)
        Toast.hide()
        let {type,nextZoom} = this.getTypeAndZoom()
        res.body.forEach((item, index) => {
            if(type === "circle"){
                this.renderCircel(item,nextZoom)
            }else if(type === "rectangle"){
                this.renderRectangle(item)
            }
        });
      
    }
    // 渲染圆形的覆盖物,形参是数据里边的对象和下一个级别
    renderCircel = (item,nextZoom) =>{
        let { latitude, longitude } = item.coord
        let { label: myLabel, count, value:placeId } = item
        var point = new BMap.Point(longitude, latitude);
        // 创建选项
        var opts = {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(30, -30)    //设置文本偏移量
        }
        var label = new BMap.Label("", opts);  // 创建文本标注对象
        //设置覆盖物的默认样式
        label.setStyle({ border: 'none', backgroundColor: 'transparent' })
        // 设置覆盖物的内容
        label.setContent(
        `<div class=${styles.labelBac}>
          <p>${myLabel}</p>
          <p>${count}套</p>
        </div>`
        )
        label.addEventListener('click',() => {
           setTimeout(() => {
             //清除所有覆盖物
             this.map.clearOverlays()
             //设置中心点和地图级别,point就是一个经纬度对象,当前遍历的对象的经纬度. 这里就是把中心点移动到遍历的对象上在放大视角
             this.map.centerAndZoom(point, nextZoom);  
            // 加载下一级覆盖物,还是用封装好的渲染覆盖物函数,形参是id
            this.renderLabel(placeId)
           },1);
        })
        this.map.addOverlay(label);
    }
    //渲染方形覆盖物,形参是数据里边的对象,因为方形覆盖物之后不需要再下一级别了,所以形参只要传一个就够了
    renderRectangle = (item) => {
        let { latitude, longitude } = item.coord
        let { label: myLabel, count, value:placeId } = item
        var point = new BMap.Point(longitude, latitude);
        // 创建选项
        var opts = {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(30, -30)    //设置文本偏移量
        }
        var label = new BMap.Label("", opts);  // 创建文本标注对象
        //设置覆盖物的默认样式
        label.setStyle({ border: 'none', backgroundColor: 'transparent' })
        // 设置覆盖物的内容
        label.setContent(
        `<div class=${styles.rectangleBac}>
          <p>${myLabel}</p>
          <p class=${styles.rectangleBacP}>${count}</p>
        </div>
        <div class=${styles.triangle}></div>
        `
        )
        label.addEventListener('click',(e) => {
            this.setState({areaHouseList:[]},()=>{
                // clientX越靠屏幕右方越大, clientY越靠屏幕下方值越大
                let {clientX,clientY} = e.changedTouches[0]
                let moveX = window.innerWidth/2 - clientX
                let moveY = window.innerHeight/2 - clientY - 150
                //将覆盖物平移到窗口的中上方
                this.map.panBy(moveX, moveY)
                //显示弹出层
                this.setState({
                    cityBoxShow:true
                })
                this.getAreaHouse(placeId)
            })
        })
        this.map.addOverlay(label);
    }
    // 封装一个获取当前地图缩放的函数,返回的是覆盖物类型和下一个缩放级别
    getTypeAndZoom = () => {
        let type, nextZoom      //覆盖物形状和下一个级别
        let currentZoom = this.map.getZoom()
        if(currentZoom === 11){
            type="circle"
            nextZoom=13
        }else if(currentZoom === 13){
            type="circle"
            nextZoom=15
        }else if(currentZoom === 15 || currentZoom > 15){
            type="rectangle"
            nextZoom=''     //到了方形覆盖物就不能再跳到下一级别了
        }
        //最终返回一个对象出去
        return {type,nextZoom}
    }
    // 获取弹出框租房的列表数据
    async getAreaHouse(houseId){
        Toast.loading('加载中',30)
        let res = await areaHouse(houseId)
        console.log(res.body.list,"我是弹出框的房源数据")
        this.setState({areaHouseList:res.body.list})
        Toast.hide()
    }
}