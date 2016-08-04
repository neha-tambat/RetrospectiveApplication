'use strict';
/*var Firebase = require('firebase');
let dbUrl = "https://firerectro.firebaseio.com/";
let ref = new Firebase(dbUrl);*/

var cachedUser = null;
import firebase from 'firebase';
import { checkHttpStatus, parseJSON } from '../utils/index';
import firebaseInit from '../firebase/firebaseInit.js';

const FirebaseObject = firebaseInit;

var addNewUserToFB = function(newUser){
  var key = newUser.uid;
  FirebaseObject.child('user').child(key).set(newUser);
};

var genErrorMsg = function(e) {
  var message = "";
  switch ( e.code) {
    case 'AUTHENTICATION_DISABLED':
      message = "The requested authentication provider is disabled for this Firebase application."
      break;
    case 'EMAIL_TAKEN':
      message = "The new user account cannot be created because the specified email address is already in use."
      break;
    case 'INVALID_ARGUMENTS':
      message = "The specified credentials are malformed or incomplete. Please refer to the error message, error details, and Firebase documentation for the required arguments for authenticating with this provider."
      break;
    case 'INVALID_CONFIGURATION':
      message = "The requested authentication provider is misconfigured, and the request cannot complete. Please confirm that the provider's client ID and secret are correct in your App Dashboard and the app is properly set up on the provider's website."
      break;
    case 'INVALID_EMAIL':
      message = "The specified email is not a valid email."
      break;
    case 'INVALID_ORIGIN':
      message = "A security error occurred while processing the authentication request. The web origin for the request is not in your list of approved request origins. To approve this origin, visit the Login & Auth tab in your App Dashboard."
      break;
    case 'INVALID_PROVIDER':
      message = "The requested authentication provider does not exist. Please consult the Firebase Authentication documentation for a list of supported providers."
      break;
    case 'INVALID_TOKEN':
      message = "The specified authentication token is invalid. This can occur when the token is malformed, expired, or the Firebase app secret that was used to generate it has been revoked."
      break;
    case 'INVALID_CREDENTIALS':
      /* message = "The specified authentication credentials are invalid. This may occur when credentials are malformed or expired." */
      /* fallthrough */
    case 'INVALID_USER':
      /* message = "The specified user account does not exist." */
      /* fallthrough */
    case 'INVALID_PASSWORD':
       message = "The specified user login or password is incorrect."
      break;
    case 'NETWORK_ERROR':
      message = "An error occurred while attempting to contact the authentication server. Please check your internet connection."
      break;
    case 'PROVIDER_ERROR':
      message = "A third-party provider error occurred. Please refer to the error message and error details for more information."
      break;
    case 'TRANSPORT_UNAVAILABLE':
      message = "The requested login method is not available in the user's browser environment. Popups are not available in Chrome for iOS, iOS Preview Panes, or local, file:// URLs. Redirects are not available in PhoneGap / Cordova, or local, file:// URLs."
      break;
    case 'USER_CANCELLED':
      message = "The current authentication request was cancelled by the user."
      break;
    case 'USER_DENIED':
      message = "The user did not authorize the application. This error can occur when the user has cancelled an OAuth authentication request."
      break;
    case 'UNKNOWN_ERROR':
      message = "An unknown error occurred. Please refer to the error message and error details for more information."
      /* Fall through */
    default:
      message = "Unknown error occured";
      break;
  }
  return message;
};

FirebaseObject.auth().onAuthStateChanged(function(userObj) {
  if (userObj) {
    // User is signed in.
    //localStorage.setItem("firebase:auth", {"email": userObj.email, "refreshToken": userObj.refreshToken});
  } else {
    // No user is signed in.
  }
});

var firebaseUtils = {

  createNewwUser: function(user, callBack) {
    FirebaseObject.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(response => {
          callBack (response);
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Error code: " + errorCode + " Error message: " + errorMessage);
          return error;
    });
  },

  signInUser: function(user, callBack){
    FirebaseObject.auth().signInWithEmailAndPassword(user.email, user.password)
          .then((response) => {
            callBack (response)
          })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Error code: " + errorCode + " Error message: " + errorMessage);
          return error;
        });
  },

  SignOut: function(callBack){
    FirebaseObject.auth().signOut()
          .then((response) => {
            callBack(response)
          })
          .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error code: " + errorCode + " Error message: " + errorMessage);
            return error;
          })
  },

  isLoggedIn: function(){
      //return cachedUser && true || FirebaseObject.auth().currentUser || false;
      return localStorage.getItem("firebase:auth");
  },

  logout: function(){
    FirebaseObject.unauth();
    cachedUser = null;
    this.onChange(false);
  }
};

module.exports = firebaseUtils;
