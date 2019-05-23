import React, { Component } from 'react';
import { HashRouter, Route, Link, Redirect, withRouter} from 'react-router-dom';
import styles from './assets/css/AppRouter.css';
import remCalc from './common/remCalc.js';
// Page
import HomePage from './components/Home.jsx';
import ScratchProgram from './components/ScratchProgram.jsx';
// import CableProgram from './CableProgram.jsx';
// import AdvancedClassroom from './AdvancedClassroom.jsx';
// import OfficialStructure from './OfficialStructure.jsx';
// import ControlCenter from './ControlCenter.jsx';
// import CreativeSpace from './CreativeSpace.jsx';

class App extends Component {
    render () {
        if(this.props.location.pathname === '/ScratchProgram'){
            // scratch 界面删除尺寸适配属性 
            document.querySelector('html').removeAttribute('style');
        }else{
            // 尺寸适配。等比缩放内容
            window.remCalc = new remCalc();
            window.remCalc.refreshRem();
        }
        return (
            <div
                className={styles.routerWrapper}
            >
                { this.props.children }
            </div>
        );
    }
}

const AppWithRouter = withRouter(App);

export default(
    <HashRouter>
        <AppWithRouter>
            <Route exact path="/" component={HomePage} />
            <Route component={ScratchProgram} path="/ScratchProgram" />
        </AppWithRouter>        
    </HashRouter>
);