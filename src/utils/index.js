import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
//import config from '../config';

var TransactionType = ['Medical Record Request','Medical Record Sent','Insurance Card Sent','Advanced Directive Sent',
    'Emergency Contact Sent','Emergency Contact Notified','Medical Contact Notified','Dental Contact Notified',
    'Dental Contact Sent','Support Request Sent','BlueButton+ Message Sent','Authorized Representative Created',
    'Authorized Representative Deleted','Record Viewed','Record Downloaded','Record Transmitted','eRecord Received',
    'BlueButton+ Record Received'];

const ORGANIZATION_PARAM_TYPE = 'organization';
const LOCATION_PARAM_TYPE = 'location';
const PROVIDER_PARAM_TYPE = 'provider';

const StateData = [
    {id: 'AL', name: 'Alabama'},
    {id: 'AK', name: 'Alaska'},
    {id: 'AZ', name: 'Arizona'},
    {id: 'AR', name: 'Arkansas'},
    {id: 'CA', name: 'California'},
    {id: 'CO', name: 'Colorado'},
    {id: 'CT', name: 'Connecticut'},
    {id: 'DE', name: 'Delaware'},
    {id: 'FL', name: 'Florida'},
    {id: 'GA', name: 'Georgia'},
    {id: 'HI', name: 'Hawaii'},
    {id: 'ID', name: 'Idaho'},
    {id: 'IL', name: 'Illinois'},
    {id: 'IN', name: 'Indiana'},
    {id: 'IA', name: 'Iowa'},
    {id: 'KS', name: 'Kansas'},
    {id: 'KY', name: 'Kentucky'},
    {id: 'LA', name: 'Louisiana'},
    {id: 'ME', name: 'Maine'},
    {id: 'MD', name: 'Maryland'},
    {id: 'MA', name: 'Massachusetts'},
    {id: 'MI', name: 'Michigan'},
    {id: 'MN', name: 'Minnesota'},
    {id: 'MS', name: 'Mississippi'},
    {id: 'MO', name: 'Missouri'},
    {id: 'MT', name: 'Montana'},
    {id: 'NE', name: 'Nebraska'},
    {id: 'NV', name: 'Nevada'},
    {id: 'NH', name: 'New Hampshire'},
    {id: 'NJ', name: 'New Jersey'},
    {id: 'NM', name: 'New Mexico'},
    {id: 'NY', name: 'New York'},
    {id: 'NC', name: 'North Carolina'},
    {id: 'ND', name: 'North Dakota'},
    {id: 'OH', name: 'Ohio'},
    {id: 'OK', name: 'Oklahoma'},
    {id: 'OR', name: 'Oregon'},
    {id: 'PA', name: 'Pennsylvania'},
    {id: 'RI', name: 'Rhode Island'},
    {id: 'SC', name: 'South Carolina'},
    {id: 'SD', name: 'South Dakota'},
    {id: 'TN', name: 'Tennessee'},
    {id: 'TX', name: 'Texas'},
    {id: 'UT', name: 'Utah'},
    {id: 'VT', name: 'Vermont'},
    {id: 'VA', name: 'Virginia'},
    {id: 'WA', name: 'Washington'},
    {id: 'WV', name: 'West Virginia'},
    {id: 'WI', name: 'Wisconsin'},
    {id: 'WY', name: 'Wyoming'}
];

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action = {}) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export function parseJSON(response) {
    return response.json();
}

/*
export function getThumbnailURL(imagePath) {
    let token = localStorage.getItem('loggedinUser');
    if (token !== null && imagePath) {

        return config.BASE_URL + "/image?imageUrl=" +
            encodeURI(imagePath) + '&CSToken=' + JSON.parse(token).token + '&thumbs=yes';
    }
    return "images/csnav-profile-default-icon.png";

}

export function getImageURL(imagePath) {
    let token = localStorage.getItem('loggedinUser');
    if (token !== null && imagePath) {

        return config.BASE_URL + "/image?imageUrl=" +
            encodeURI(imagePath) + '&CSToken=' + JSON.parse(token).token;
    }
    return "images/csnav-profile-default-icon.png";
}

export function getERecordSource(){
    let token = localStorage.getItem('loggedinUser');
    if (token !== null){
        var endURL = "/html/connect.html";
        return config.BASE_URL + endURL +'?CSToken=' + JSON.parse(token).token;
    }
    return "";

}
export function getRawImage(node) {
    let token = localStorage.getItem('loggedinUser');
    if (token !== null) {
        return fetch(config.BASE_URL + node, {
            method: 'get',
            headers: {
                'Accept': 'application/octet-stream',
                'CSToken': JSON.parse(token).token
            }
        }).then(function(response) {
            return response.text();
        }).then(response => {
            return base64Decode(response);
        });
    }
}
*/

export function base64Decode(str) {
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}


/*export function logError(...values) {
    if (config.ENV != 'PROD') {
        console.error(values);
    }
}*/

export function getCategory(categorySymbol) {
    var category = "Medical";
    switch (categorySymbol) {
        case "dental-records":
            category = "Dental";
            break;
        case "immunization-records":
            category = "Immunizations";
            break;
        case "medical-records":
            category = "Medical";
            break;
        case "prescription-records":
            category = "Prescriptions";
            break;
        case "vision-records":
            category = "Vision";
            break;
        case "laboratory-records":
            category = "Laboratory";
            break;
        case "radiology-records":
            category = "Radiology";
            break;
        case "genetic-data-records":
            category = "Genetic Data";
            break;
        case "biometric-data-records":
            category = "Biometric Data";
            break;
        case "blood-pressure-records":
            category = "Blood Pressure";
            break;
        case "blood-sugar-records":
            category = "Blood Sugar";
            break;
        case "erecords-records":
            category = "eRecords";
            break;
        case "blue-button-records":
            category = "BlueButton+";
            break;
        case "billing-records":
            category = "Billing";
            break;

    }
    return category;
}

export function getTransactionType(typeIndex){
    return TransactionType[typeIndex];
}

export function  parseSubject(subject){
    if(subject && subject.length > 60){
        return (subject.substring(0, 60) + "...");
    }
    return subject;
}

export function getUSStates(){
    return StateData;
}

export function getInputTypeIdParam(orgLocationProviderData){
    var selectedOrg = orgLocationProviderData.selectedOrganization;
    var selectedLocation = orgLocationProviderData.selectedLocation;
    var selectedProvider = orgLocationProviderData.selectedProvider;

    var id = -1;
    var type = "";
    if(selectedLocation.id == -1){
        id = selectedOrg.id;
        type = ORGANIZATION_PARAM_TYPE;
    }else if(selectedProvider.id == -1){
        id = selectedLocation.id;
        type = LOCATION_PARAM_TYPE;
    }else{
        id = selectedProvider.id;
        type = PROVIDER_PARAM_TYPE;
    }

    return {
        id:id,
        type:type
    }
}

export function daysRemaining (date1, date2){
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    var difference_ms = Math.abs(date1_ms - date2_ms);
    return Math.round(difference_ms/ONE_DAY);
}
//export function getToken(response) {
//    return {
//        token: response.headers.get('CSToken'),
//        response
//    };
//    //return response.json()
//}
