/**
 * Created by nikhila on 9/25/2015.
 */
import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import Routes from './routes';

import Root from './containers/Root';
import moment from 'moment';
import configureStore from './store/configureStore';


//Router.run(Routes, Router.HashLocation, Handler => React.render(<Handler />, document.body));


//const store = configureStore(window.__INITIAL_STATE__);
const store = configureStore();
const node = (
    <Root store={store} />
);

console.log(node);

ReactDOM.render(node, document.getElementById('root'));

