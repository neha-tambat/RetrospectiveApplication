/**
 * Created by nehat on 7/21/2016.
 */


import Login from '../view/LoginPage';
import firebaseUtils from './firebaseUtils';

function requireAuth(nextState, replace) {
    if (!firebaseUtils.isLoggedIn()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

module.exports = requireAuth;