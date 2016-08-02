/**
 * Created by nehat on 7/5/2016.
 */

import { checkHttpStatus, parseJSON } from '../../utils';
import { pushState } from 'redux-router';
import {SELECTED_PROJECT_ID,LEFT_DRAWER} from '../../constants/index';
//import _ from 'lodash';


export function loadPage(url) {
    return dispatch => {
        dispatch(pushState(null, url));
    }
}

export function selectProject(projectId){
    return dispatch => {
        dispatch ({
            type: "SELECTED_PROJECT_ID",
            payload: projectId
        })
    }
}

export function leftDrawer(){
    return dispatch => {
        dispatch({
            type: "LEFT_DRAWER"
        })
    }
}