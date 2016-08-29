/**
 * Created by synerzip on 14/01/16.
 */
import {createReducer} from '../utils';
import {pushState} from 'redux-router';

import {SELECTED_PROJECT_ID,LEFT_DRAWER,WINDOW_SIZE,LOGGED_IN_USER_DETAILS,PROJECT_KEY_FOR_MANAGING_TEAM,
    RETROSPECTIVE_KEY_SELECTED} from '../constants/index';

const initialState = {

    windowWidth: null,
    windowHeight:null,
    selected_project_name: null,
    leftDrawer : true,
    loggedInUserDetails: null,
    projectKeyForManageTeam: null,
    retrospectiveKey_selected: null
};


export default createReducer(initialState, {

    [SELECTED_PROJECT_ID]: (state, payload) =>{
        var _state = _.cloneDeep(state);
        _state.projectKeyForManageTeam = payload.projectId;
        _state.selected_project_name = payload.projectName;
        return _state;
    },
    [LEFT_DRAWER] : state => {
        var _state = _.cloneDeep(state);
        _state.leftDrawer = !state.leftDrawer;
        return _state;
    },
    [WINDOW_SIZE]: state =>{
        var _state = _.cloneDeep(state);
        _state.windowWidth = window.innerWidth;
        _state.windowHeight = window.innerHeight;
        return _state;
    },
    [LOGGED_IN_USER_DETAILS]: (state, payload) => {
        var _state = _.cloneDeep(state);
        _state.loggedInUserDetails = payload;
        return _state;
    },
    [PROJECT_KEY_FOR_MANAGING_TEAM]: (state,payload) => {
        var _state = _.cloneDeep(state);
        _state.projectKeyForManageTeam = payload;
        return _state;
    },
    [RETROSPECTIVE_KEY_SELECTED]:(state,payload) => {
        var _state = _.cloneDeep(state);
        _state.retrospectiveKey_selected = payload;
        return _state;
    },

});



