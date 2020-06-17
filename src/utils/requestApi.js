import myRequest from "./request"

//获取首页的轮播图
function swiperImg() {
    return myRequest({
        url: '/home/swiper',
        method: 'get'
    })
}
//租房小组
function zuFangXiaoZu() {
    return myRequest({
        url: '/home/groups?area=AREA%7C88cff55c-aaa4-e2e0',
        method: 'get'
    })
}
//最新咨询
function newAdvisory() {
    return myRequest({
        url: '/home/news?area=AREA%7C88cff55c-aaa4-e2e0',
        method: 'get'
    })
}
//所有城市
function allCity({name}) {
    return myRequest({
        url: '/area/city?level=1',
        method: 'get',
        params: {
           name:name
        }
    })
}
//热门城市
function hotCity() {
    return myRequest({
        url: '/area/hot',
        method: 'get'
    })
}
//查询所在区域的房源
function areaCity(id) {
    return myRequest({
        url: '/area/map',
        method: 'get',
        params: {
            id:id
         }
    })
}
//地图上弹出框显示的租房列表
function areaHouse(houseId) {
    return myRequest({
        url: '/houses',
        method: 'get',
        params: {
            cityId:houseId
         }
    })
}
//获取房屋查询条件
function condition(id) {
    return myRequest({
        url: '/houses/condition',
        method: 'get',
        params: {
            id:id
         }
    })
}
//根据条件获取房源数据
function findHouse({cityId,area,subway,rentType,price,more,roomType,oriented,characteristic,floor}) {
    return myRequest({
        url: '/houses',
        method: 'get',
        params: {
            cityId:cityId,          //城市id
            area:area || null,         //地铁
            subway:subway || null,       //地铁
            rentType:rentType || null,     //整租
            price:price || null,          //价格
            more:more || null,            //复合查询
            roomType:roomType || null,    //房屋类型
            oriented:oriented || null,    //朝向
            characteristic:characteristic || null,  //标签
            floor:floor || null,          //楼层
            start:1,          //开始页
            end:20              //结束页
         }  
    })
}

//测试接口
// function isText({city}) {
//     return myRequest({
//         url: "http://wthrcdn.etouch.cn/weather_mini",
//         method: 'get',
//         params: {
//           city:city
//         }
//     })
// }


export {swiperImg,zuFangXiaoZu,newAdvisory,allCity,hotCity,areaCity,areaHouse,condition,findHouse}