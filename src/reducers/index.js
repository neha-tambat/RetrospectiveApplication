
import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';


import scrums from './scrums';


export default combineReducers({
 scrums,
 router: routerStateReducer
});
