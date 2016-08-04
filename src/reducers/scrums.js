/**
 * Created by synerzip on 14/01/16.
 */
import {createReducer} from '../utils';
import {pushState} from 'redux-router';

import {SELECTED_PROJECT_ID,LEFT_DRAWER,WINDOW_SIZE} from '../constants/index';

const initialState = {

    windowWidth: null,
    windowHeight:null,
    selected_project_id: null,
    selected_project_name: null,
    leftDrawer : true
};


export default createReducer(initialState, {

    [SELECTED_PROJECT_ID]: (state, payload) =>{
        var _state = _.cloneDeep(state);
        _state.selected_project_id = payload.projectName;
        _state.selected_project_name = payload.projectId;
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
    }

});



