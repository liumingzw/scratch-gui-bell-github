import React, { Component } from 'react';
import '../assets/css/Home.css';

class HomePage extends Component {
    constructor(props){
        super(props);
    }
    render(){
        const { history } = this.props;
        return (
            <div
                className="homeBox"
                // onClick={() => history.push('/ScratchProgram')}
            >
                <div 
                    className="topB"
                    onClick={() => history.push('/ScratchProgram')}
                >go to ScratchProgram</div>
                <div className="contentBox">
                    
                </div>
            </div>
        );
    }
}

export default HomePage;