
import React from 'react';
import { Route,Router, DefaultRoute,IndexRoute, NotFoundRoute, Redirect} from 'react-router';

import Dashboard from '../view/Dashboard';
import Main from '../view/Main';
import Root from '../containers/Root';
//import App from '../containers/App';
import requireAuth from '../utils/authenticated';
import SignUpSignInPage from '../view/SignUpSignInPage';
import SignUpPage from '../view/SignUpPage';
import LoginPage from '../view/LoginPage';
import LoggedInUserLandingPage from '../view/LoggedInUserLandingPage';
import CreateProject from '../view/CreateProject';
import ManageProject from '../view/ManageProject';
import CreateSprintRetrospective from '../view/CreateSprintRetrospective';
import OngoingRetrospectiveDetails from '../view/OngoingRetrospectiveDetails';
import PastRetrospectives from '../view/PastRetrospectives';
import MyProfile from '../view/MyProfile';
import ManageTeam from '../view/ManageTeam';
import AddTeamMember from '../view/AddTeamMember';
//import LandingLayout from '../layouts/LandingLayout';

var Routes = (
    <Router>
        <Route path='/' component={SignUpSignInPage}>
            <Route path="signUp" component={SignUpPage}/>
            <Route path="login" component={LoginPage}/>
        </Route>

        <Route path="/" component={LoggedInUserLandingPage} onEnter={requireAuth}>
            <IndexRoute component={OngoingRetrospectiveDetails} />
            <Route path="ongoingRetro" component={OngoingRetrospectiveDetails} />
            <Route path="myProfile" component={MyProfile} />
            <Route path="createProject" component={CreateProject} />
            <Route path="addTeamMember" component={AddTeamMember} />
            <Route path="manageProject" component={ManageProject} />
            <Route path="manageTeam" component={ManageTeam} />
            <Route path="pastRetro" component={PastRetrospectives} />
            <Route path="createSprintRetro" component={CreateSprintRetrospective} />
            <Route path="main" component={Main}/>
            <Route path="dashboard" component={Dashboard}/>
        </Route>

    </Router>);

export default Routes;

