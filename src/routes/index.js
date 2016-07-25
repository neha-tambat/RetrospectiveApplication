
import React from 'react';
import { Route,Router, DefaultRoute,IndexRoute, NotFoundRoute, Redirect} from 'react-router';

import Dashboard from '../view/Dashboard';
import Main from '../view/Main';
import Root from '../containers/Root';
import App from '../containers/App';
import requireAuth from '../utils/authenticated';
import SignUpSignInPage from '../view/SignUpSignInPage';
import SignUpSignInPageContent from '../view/SignUpSignInPageContent';
import SignUpPage from '../view/SignUpPage';
import LoginPage from '../view/LoginPage';
import LoggedInUserLandingPage from '../view/LoggedInUserLandingPage';
import CreateProject from '../view/CreateProject';
import CreateSprintRetrospective from '../view/CreateSprintRetrospective';
import OngoingRetrospectiveDetails from '../view/OngoingRetrospectiveDetails';
import MyProfile from '../view/MyProfile';

var Routes = (
    <Router>
        <Route path='/' component={App}>
            <IndexRoute component={SignUpSignInPage}/>
            <Route path="signUp" component={SignUpPage}/>
            <Route path="login" component={LoginPage}/>
            <Route path="loginSuccess" component={LoggedInUserLandingPage} onEnter={requireAuth}>
                <Route path="myProfile" component={MyProfile} />
                <Route path="createProject" component={CreateProject} />
                <Route path="ongoingRetro" component={OngoingRetrospectiveDetails} />
                <Route path="createSprintRetro" component={CreateSprintRetrospective} />
                <Route path="main" component={Main}/>
                <Route path="dashboard" component={Dashboard}/>
            </Route>

        </Route>
    </Router>);

export default Routes;

