//默认初始数据, 相当于VueX中的初始数据state
const myState = {
    selectValues: {
        area: ['null'],
        mode: ['null'],
        price: ['null'],
        roomType: [],
        oriented: [],
        floor: [],
        characteristic: []
    } 
}

//这里主要处理方法,类似VueX的mumations.注意:action对象type必须要有
export default(state = myState, action) => {
    switch (action.type) {
        case 'SETVALUE':
            // return  state.selectValues = action.val //错误写法
            return  Object.assign({}, state,{
                selectValues: action.val
            })
        
        //默认情况下也要返回默认数据    
        default:
            return state;  
    }
}
