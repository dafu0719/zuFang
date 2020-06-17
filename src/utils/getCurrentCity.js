// 获取当前城市所在位置
// 可能之前已经点击过城市位置了就看本地缓存里边有没存储的城市数据,有就直接获取,没有就使用百度地图获取
function getCurrentCity() {
    let chooseCity = JSON.parse(window.localStorage.getItem("chooseCity"))
    if (!chooseCity) {
        // 如果本地没有就重新获取
        return new Promise((resolve, reject) => {
            let BMap = window.BMap
            var myCity = new BMap.LocalCity();
            myCity.get(res => {
                var cityName = res.name;
                let checkHotCity=[
                    {label:"北京", value: "AREA|88cff55c-aaa4-e2e0", pinyin: "beijing", short: "bj"},,
                    {label: "广州", value: "AREA|e4940177-c04c-383d", pinyin: "guangzhou", short: "gz"},
                    {label: "上海", value: "AREA|dbf46d32-7e76-1196", pinyin: "shanghai", short: "sh"},
                    {label: "深圳", value: "AREA|a6649a11-be98-b150", pinyin: "shenzhen", short: "sz"}
                ]
                let needToListName = ''
                checkHotCity.forEach((item,index) => {
                    if(cityName.indexOf(item.label) !== -1){
                        needToListName={label:item.label, value:item.value}
                    }
                });
                resolve(needToListName)
            });
        })
    } else {
        //如果本地有就直接用
        return Promise.resolve(chooseCity)
    }
}

export default getCurrentCity
