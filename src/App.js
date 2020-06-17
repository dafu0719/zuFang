import React from 'react';
import { BrowserRouter  as Router, Route, Switch, Redirect} from "react-router-dom";

import "./App.css" // 导入全局样式
import "./assets/fonts/iconfont.css"  // 导入可以全局引用的字体图标样式

// 导入子组件
import Home from "./views/home"
import CityList from "./views/cityList"
import MapFindCity from "./views/mapFindCity"
import HouseDetail from "./views/houseDetail"

function App() {
  return (
       <Router>
         <div id="app">
           <Switch>
             <Route path="/home" component={Home}/>
             <Route path="/cityList" component={CityList}/>
             <Route path="/mapFindCity" component={MapFindCity}/>
             <Route path="/houseDetail" component={HouseDetail}/>
             {/*路由重定向*/}
             <Redirect exact from="/" to="/home"/>    
           </Switch>
         </div>
       </Router>
  );
}

export default App;
