/**
 * Created by nehat on 7/21/2016.
 */

import { checkHttpStatus, parseJSON } from '../../utils';
import { } from '../../constants';


export function dataGet(nodeURL) {
    //get token
    return fetch(nodeURL, {
        method: 'get'
        //headers: {'Content-Type': 'application/json'}

    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
            return result;
        })
        .catch(error => {
            throw error;
        })
}

export function dataPost(nodeURL, data) {
    //get token
    return fetch(nodeURL, {
        method: 'post',
        body: data

    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
            return result;
        })
        .catch(error => {
            throw error;
        });

}

export function dataPut(nodeURL, data) {
    //get token

    return fetch(nodeURL, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
            return result;
        })
        .catch(error => {
            throw error;
        })
}

export function dataDelete(nodeURL, data) {
    //get token

    return fetch(nodeURL, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    }).then(checkHttpStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then(result => {
            return result;
        })
        .catch(error => {
            throw error;
        })
}