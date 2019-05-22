import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './TopBar.css';

export default class TopBar extends Component {
    render(){
        const { history } = this.props;
        return (
            <div 
                className={classNames(styles.topBar,styles.flexJsb)}
                // onClick={() => history.push('/ScratchProgram')}
            >
                <div className={styles.barLeftBox}>
                    <img src={require('../../assets/image/test/gear.png')} className={styles.barImgStyle} alt=""/> <span className={styles.uName}>张三</span>
                </div>
                <div className={styles.barRightbox}>
                    <img src={require('../../assets/image/test/inspect.png')} className={styles.barImgStyle} alt=""/>
                </div>
            </div>
        );
    }
}