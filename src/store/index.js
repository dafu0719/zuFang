//这个页面主要是用来导入的,主要操作在reducer文件里边
import {createStore} from 'redux'  
import reducer from './reducer'       

//创建仓库
const store = createStore(reducer)

//仓库暴露出去
export default store