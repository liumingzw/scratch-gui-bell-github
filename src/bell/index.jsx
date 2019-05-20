import React from 'react';
import ReactDom from 'react-dom';
import styles from './index.css';
import App from './App.jsx';
import {HashRouter, Route} from 'react-router-dom';

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

ReactDom.render(
    <HashRouter>
        <Route
            component={App}
            path="/"
        />
    </HashRouter>,
    appTarget
);
