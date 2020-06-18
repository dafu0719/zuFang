import React, { Component } from 'react'
import { PickerView } from 'antd-mobile';
import styles from './index.module.scss'
import store from '../../../../store'

export default class Index extends Component {
    //显示在视图层的初始数据
    constructor(props) {
        super(props)
        this.state = {
            //选择器已经选中了的数据,有初始默认选中的数据
            selectValues: {
                area: ['null'],
                mode: ['null'],
                price: ['null'],
                roomType: [],
                oriented: [],
                floor: [],
                characteristic: []
            },
        }
    }
    //页面一打开就调用
    componentDidMount() {
        this.startDispose()
    }
    //写html,渲染数据
    render() {
        return (
            <div className={styles.pickerComponent}>
                {/*前三个选择器 */}
                {this.showPicker()}
                {/* 筛选框*/}
                {this.filtrate()}
            </div>
        )
    }
    //注册事件
    //显示前三个选择器
    showPicker() {
        let { toData, currentOpenType } = this.props
        let { selectValues } = this.state
        let mySelectValue = selectValues[currentOpenType]
        if (toData) {
            if (currentOpenType !== "area" && currentOpenType !== "filtrate") {
                return (
                    <>
                      <PickerView data={toData} cols={1} value={mySelectValue}
                      onChange={this.pickerChange} />
                      {this.cancelAndSubmit()}
                    </>
                )
            } else if (currentOpenType === "area") {
                return (
                    <>
                    <PickerView data={toData} value={mySelectValue}
                    onChange={this.pickerChange} />
                    {this.cancelAndSubmit()}
                    </>
                )
            }
        }
    }
    //取消和确定按钮
    cancelAndSubmit = () => {
        let { currentOpenType } = this.props
        if (currentOpenType !== "filtrate") {
            return (
                <div className={styles.twoBtn}>
                    <div className={styles.cancel} onClick={this.clickCancel}>取消</div>
                    <div className={styles.comfirm} onClick={this.clickComfirm}>提交</div>
                </div>
            )
        }
    }
    //筛选弹出框清除和确定按钮
    clearAndSubmit = () => {
        return (
            <div className={`${styles.twoBtn} ${styles.twoBtnHaveClear}`} >
                <div className={styles.cancel} onClick={this.clickClear}>清除</div>
                <div className={styles.comfirm} onClick={this.clickComfirm}>提交</div>
            </div>
        )
    }
    //筛选框
    filtrate = () => {
        let { currentOpenType, toData } = this.props
        let toDataKey = Object.keys(toData)
        let toDataName = ["户型", "朝向", "楼层", "房屋亮点"]
        if (currentOpenType === "filtrate") {
            return (
                <div className={styles.filtrate}>
                    {/* 左边遮罩 */}
                    <div className={styles.filtrateMask} onClick={() => this.props.clickMask()}></div>
                    {/* 右边筛选框 */}
                    <div className={styles.filtratePicker}>
                        {toDataName.map((item, index) => {
                            let toDataKeyName = toDataKey[index]
                            let toDataKeyData = toData[toDataKeyName]
                            return (
                                <div className={styles.filtrateItem} key={item}>
                                    <div className={styles.filtrateItemTitle}>{item}</div>
                                    <div className={styles.filtrateContent}>
                                        {toDataKeyData.map((item, index) => {
                                            let { selectValues } = this.state
                                            return <div
                                                className={`${styles.filtrateBtn} 
                                              ${selectValues[toDataKeyName].includes(item.value) ? styles.activeBtn : ''}`}
                                                key={item.value}
                                                onClick={() => this.clicFiltrateBtn(toDataKeyName, item.value)}
                                            >{item.label}</div>
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                        {this.clearAndSubmit()}
                    </div>

                </div>
            )
        }
    }

    //最高级筛选框的
    //change事件会自动返回value值
    pickerChange = (val) => {
        let { selectValues } = this.state
        let { currentOpenType: type } = this.props
        this.setState({ selectValues: { ...selectValues, [type]: val } }, () => {
            window.localStorage.setItem('selectValues', JSON.stringify(this.state.selectValues))
            store.dispatch({type:'SETVALUE', val:this.state.selectValues})
            //  console.log( store.getState().selectValues,"我是外变的log")
        })
    }
    //点击取消
    clickCancel = () => {
        //执行父组件传过来的方法
        this.props.clickCancel()
    }
    //点击清除按钮,所以选项变化初始状态
    clickClear = () => {
        this.props.allTitleStatusFalse()
        this.setState({
            selectValues: {
                area: ['null'],
                mode: ['null'],
                price: ['null'],
                roomType: [],
                oriented: [],
                floor: [],
                characteristic: []
            }
        },()=>{window.localStorage.setItem('selectValues', JSON.stringify(this.state.selectValues))})
    }
    // 点击确定
    clickSubmit() {
        //调用父组件的方法,同时把参数传过去

    }
    //点击筛选框选项
    clicFiltrateBtn = (type, value) => {
        let { selectValues } = this.state
        //如果不包含在里边就添加,包含在里边就删除
        if (!selectValues[type].includes(value)) {
            selectValues[type].push(value)
        } else {
            selectValues[type] = selectValues[type].filter((item, index) => {
                return item !== value
            })
        }
        this.setState({ selectValues })
    }
    //一打开子组件就做处理,缓存里边有历史记录就缓存里边拿数据,没有就跳过
    startDispose = () => {
        let selectValues = JSON.parse(window.localStorage.getItem("selectValues"))
        if (selectValues) {
            this.setState({ selectValues })
        }
    }

}