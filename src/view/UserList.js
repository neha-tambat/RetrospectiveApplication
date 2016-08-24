/**
 * Created by nehat on 8/11/2016.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import firebaseUtils from '../utils/firebaseUtils';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

class UserList extends React.Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
    }

    componentWillMount(){
        this.firebaseRef = firebase.database().ref('users');
        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            var users = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var user = childSnapshot.val();
                user['.key'] = childSnapshot.key;
                users.push(user);
            }.bind(this));

            //console.log("users : ", users);

            this.setState({
                users: users
            });
        }.bind(this));
    }

    render(){
        var {users} = this.state;
        //console.log("UserList : ", users);

        return(
            users
        );
    }

}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(UserList);