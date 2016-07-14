
import React from 'react';
import { Route,Router, DefaultRoute,IndexRoute, NotFoundRoute, Redirect} from 'react-router';

import Dashboard from '../view/Dashboard';
import Main from '../view/Main';
import Root from '../containers/Root';
import App from '../containers/App';

var Routes = (
    <Router>
        <Route path='/' component={App}>
            <IndexRoute component={Main}/>
            <Route path="dashboard" component={Dashboard}/>

        </Route>
    </Router>);

export default Routes;

