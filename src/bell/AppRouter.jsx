import React, { Component } from 'react';
import { HashRouter, Route, Link, Redirect, withRouter} from 'react-router-dom';
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
        return (
            <div
                className="routerWrapper"
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