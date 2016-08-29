/**
 * Created by nehat on 7/11/2016.
 */

import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBw6JlERe5qMUs_GE1Y7BsF12lkNWwaC6I",
    authDomain: "liveretro-8d6d4.firebaseapp.com",
    databaseURL: "https://liveretro-8d6d4.firebaseio.com",
    storageBucket: "liveretro-8d6d4.appspot.com",
};

var firebaseInit = firebase.initializeApp(firebaseConfig);
/*module.exports.firebaseInit = firebaseInit.database();*/

export default firebaseInit = firebaseInit;

