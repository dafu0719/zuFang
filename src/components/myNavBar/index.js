import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import { withRouter } from "react-router-dom"
import styles from './index.module.scss'
    
    
function MyNavBar(props){
    return (
        <>
              <NavBar
                    mode="light"
                    icon={<Icon type="left" style={{color:"#949494"}}/>}
                    onLeftClick={() => props.history.goBack()}
                    rightContent={
                        <Icon key="0" type="search" style={{ marginRight: '16px',color:"#ffffff"}} />
                    }
                >{props.children}</NavBar>
        </>
    )
}
    
    
export default withRouter(MyNavBar)