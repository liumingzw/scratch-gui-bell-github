import React from 'react';
import ReactDom from 'react-dom';
import styles from "./assets/css/global.css";
import AppRouter from './AppRouter.jsx';
import FastClick from 'fastclick';

// ios平台点击延迟
FastClick.attach(document.body);

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

ReactDom.render(
    <div>{AppRouter}</div>,
    appTarget
);
