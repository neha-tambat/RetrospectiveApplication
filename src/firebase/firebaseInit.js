/**
 * Created by nehat on 7/11/2016.
 */

import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyA-5VJlB6cMR_YxZw_4lcLT9ZedfkhQf9A",
    authDomain: "retrospective-application.firebaseapp.com",
    databaseURL: "https://retrospective-application.firebaseio.com",
    storageBucket: ""
};

var firebaseInit = firebase.initializeApp(firebaseConfig);
/*module.exports.firebaseInit = firebaseInit.database();*/

export default firebaseInit = firebaseInit.database();

