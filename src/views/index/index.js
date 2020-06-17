import React, { Component } from 'react'
import { Carousel } from 'antd-mobile';
import Title from '../../components/title';
import SearchBar from '../../components/searchBar';
import styles from './index.module.scss'
import getCurrentCity from "../../utils/getCurrentCity"
import { swiperImg, zuFangXiaoZu, newAdvisory } from '../../utils/requestApi'

//注意:图片路径要导入进来之后再使用.不能直接写在标签上
import img1 from "../../assets/images/nav-1.png"
import img2 from "../../assets/images/nav-2.png"
import img3 from "../../assets/images/nav-3.png"
import img4 from "../../assets/images/nav-4.png"
// import imgURL from "http://localhost:8080/img/swiper/1.png"

export default class Index extends Component {
    //显示在视图层的初始数据
    constructor(props) {
        super(props)
        this.state = {
            data: ['1', '2', '3'],
            imgHeight: 176,
            swiperImgList: [],    //轮播图
            tabBtn: [
                { name: "整租", img: img1, path: "/home/list" },
                { name: "合租", img: img2, path: "/home/list" },
                { name: "地图找房", img: img3, path: "/map" },
                { name: "去出租", img: img4, path: "/rent/add" }],
            zuFangXiaoZuList: [],
            newAdvisoryContentList: [],
            isMyCity:""
        }
    }
    //页面一打开就调用
    componentDidMount() {
        this.isGetCurrentCity()
        this.getZuFangXiaoZu()
        this.getswiperImg()
        this.getNewAdvisory()
        // simulate img loading
        setTimeout(() => {
            this.setState({
                data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);
    }
    //写html,渲染数据
    render() {
        return (
            <div>
                {/* 顶部搜索栏*/}
                <SearchBar myCity={this.state.isMyCity}></SearchBar>
                {/*轮播图*/}
                {this.mapSwipers()}
                {/* 导航栏 */}
                {this.mapTabBtnItem()}
                {/* 租房小组 */}
                {this.zuFangXiaoZu()}
                {/* 最新咨询 */}
                {this.newAdvisory()}
            </div>
        )
    }
    //注册事件
    // 获取城市
    async isGetCurrentCity(){
      let res = await getCurrentCity()
      window.localStorage.setItem('chooseCity', JSON.stringify(res))
      let {label} = res
      this.setState({
        isMyCity:label
      })
    }
    // 导航栏
    mapTabBtnItem() {
        return (
            <div className={styles.tabBtn}>
                {this.state.tabBtn.map((item, index) => {
                    return (
                        <div className={styles.tabBtnItem} key={index}>
                            <div className={styles.tabBtnItemTop}>
                                <img src={item.img} className={styles.tabBtnImg} />
                            </div>
                            <p>{item.name}</p>
                        </div>
                    )
                })
                }
            </div>
        )
    }
    // 获取轮播图数据
    async getswiperImg() {
        let res = await swiperImg()
        this.setState({
            swiperImgList: res.body
        })
    }
    //轮播图
    mapSwipers() {
        return (
            <Carousel autoplay={true} infinite>
                {this.state.swiperImgList.map((item, index) => (
                    <a key={index} href={`http://localhost:8080${item.imgSrc}`}
                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                    >
                        <img
                            src={`http://localhost:8080${item.imgSrc}`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top', backgroundColor:"#dededf"}}
                            onLoad={() => {
                                // fire window resize event to change height
                                window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                        />
                    </a>
                ))}
            </Carousel>
        )
    }
    // 获取租房小组数据
    async getZuFangXiaoZu() {
        let res = await zuFangXiaoZu()
        this.setState({ zuFangXiaoZuList: res.body })
    }
    // 租房小组
    zuFangXiaoZu() {
        return (
            <div>
                <Title leftName={"租房小组"} isNeedMore={true}></Title>
                <div className={styles.zuFangXiaoZuContent}>
                    {this.state.zuFangXiaoZuList.map((item, index) => {
                        return (
                            <div className={styles.zuFangXiaoZuItem} key={item.id}>
                                <div className={styles.zuFangXiaoZuItemLeft}>
                                    {item.title}
                                    <p style={{ fontSize: "12px", color: "#a3a3a3", marginTop: '8px' }}>{item.desc}</p>
                                </div>
                                <img src={`http://localhost:8080${item.imgSrc}`} width="46px" height="46px" style={{ borderRadius: "50px" }} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
    //最新咨询数据
    async getNewAdvisory() {
        let res = await newAdvisory()
        this.setState({ newAdvisoryContentList: res.body })
    }
    // 最新咨询
    newAdvisory() {
        return (
            <div>
                <div className={styles.newAdvisory}>
                    <Title leftName={"最新咨询"} needWhiteBackcol={true}></Title>
                    <div className={styles.newAdvisoryContent}>
                        {this.state.newAdvisoryContentList.map((item, index) => {
                            return (
                                <div className={styles.newAdvisoryItem} key={item.id}>
                                    <img src={`http://localhost:8080${item.imgSrc}`} width="110" height="100%" />
                                    <div className={styles.newAdvisoryItemRight}>
                                        <span>{item.title}</span>
                                        <div className={styles.newAdvisoryItemRightBottom}>
                                            <span className={styles.newAdvisoryFrom}>{item.from}</span>
                                            <span className={styles.newAdvisoryTime}>{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}