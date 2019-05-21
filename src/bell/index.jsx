import React from 'react';
import ReactDom from 'react-dom';
import "./assets/css/global.css";
import AppRouter from './AppRouter.jsx';

const appTarget = document.createElement('div');
appTarget.className = 'app';
document.body.appendChild(appTarget);

ReactDom.render(
    <div>{AppRouter}</div>,
    appTarget
);
