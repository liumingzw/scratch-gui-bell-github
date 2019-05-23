import React, { Component } from 'react';
import classNames from 'classnames';
import styles from '../assets/css/Home.css';
import TopBar from '../components/TopBar/TopBar.jsx';

class HomePage extends Component {
    constructor(props){
        super(props);
    }
    goToPage(path){
        !path ? alert('暂未开放，敬请期待！') : this.props.history.push(path);
    }
    render(){
        return (
            <div className={styles.homeBox}>
                <TopBar history={ history } />
                <div className={classNames(styles.contentBox, styles.flexJsb)}>
                    <div 
                        className={styles.leftContent}
                        onClick={() => this.goToPage('/ScratchProgram')}
                    >
                        <span className={styles.contentSize}>Scratch 编程</span>
                    </div>
                    <div className={classNames(styles.rightContent)}>
                        <div className={classNames(styles.topContent,styles.flexJsb)}>
                            <div 
                                className={styles.topLeftItem}
                                onClick={() => this.goToPage()}
                            >
                                <span className={styles.contentSize}>连线编程</span>
                            </div>
                            <div className={styles.topRightItem}>
                                <div 
                                    className={classNames(styles.contentItem)}
                                    onClick={() => this.goToPage()}
                                >
                                    <span className={styles.contentSize}>官方搭建</span>
                                </div>
                                <div 
                                    className={classNames(styles.contentItem, styles.mt1_5)}
                                    onClick={() => this.goToPage()}
                                >
                                    <span className={styles.contentSize}>控制中心</span>
                                </div>
                            </div>
                        </div>
                        <div 
                            className={classNames(styles.bottomContent)}
                            onClick={() => this.goToPage()}
                        >
                            <span className={styles.contentSize}>创意工坊</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;