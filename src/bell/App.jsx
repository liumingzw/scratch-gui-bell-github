import React, {PureComponent} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import ScratchProgram from './ScratchProgram.jsx';
import CableProgram from './CableProgram.jsx';
import AdvancedClassroom from './AdvancedClassroom.jsx';
import OfficialStructure from './OfficialStructure.jsx';
import ControlCenter from './ControlCenter.jsx';
import CreativeSpace from './CreativeSpace.jsx';

const PATH_NAMES = [
    '/',
    '/ScratchProgram',
    '/CableProgram',
    '/AdvancedClassroom',
    '/OfficialStructure',
    '/ControlCenter',
    '/CreativeSpace'
];

class App extends PureComponent {
    render () {
        const {location} = this.props;
        console.log('location: ' + JSON.stringify(location));

        if (!PATH_NAMES.includes(location.pathname)) {
            return (
                <Redirect
                    to={{
                        pathname: '/'
                    }}
                />
            );
        }

        return (
            <div>
                <div style={{backgroundColor: '#e0e0e0'}}>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/ScratchProgram">ScratchProgram</Link>
                            </li>
                            <li>
                                <Link to="/CableProgram">CableProgram</Link>
                            </li>
                            <li>
                                <Link to="/AdvancedClassroom">AdvancedClassroom</Link>
                            </li>
                            <li>
                                <Link to="/OfficialStructure">OfficialStructure</Link>
                            </li>
                            <li>
                                <Link to="/ControlCenter">ControlCenter</Link>
                            </li>
                            <li>
                                <Link to="/CreativeSpace">CreativeSpace</Link>
                            </li>
                        </ul>
                    </nav>
                    <div style={{backgroundColor: '#ffe0e0'}}>
                        <ScratchProgram
                            {...this.props}
                            style={{
                                display: (location.pathname === '/ScratchProgram') ? 'block' : 'none'
                            }}
                        />
                        <CableProgram
                            {...this.props}
                            style={{
                                display: (location.pathname === '/CableProgram') ? 'block' : 'none'
                            }}
                        />
                        <AdvancedClassroom
                            {...this.props}
                            style={{
                                display: (location.pathname === '/AdvancedClassroom') ? 'block' : 'none'
                            }}
                        />
                        <OfficialStructure
                            {...this.props}
                            style={{
                                display: (location.pathname === '/OfficialStructure') ? 'block' : 'none'
                            }}
                        />
                        <ControlCenter
                            {...this.props}
                            style={{
                                display: (location.pathname === '/ControlCenter') ? 'block' : 'none'
                            }}
                        />
                        <CreativeSpace
                            {...this.props}
                            style={{
                                display: (location.pathname === '/CreativeSpace') ? 'block' : 'none'
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(App);
