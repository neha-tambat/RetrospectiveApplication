/**
 * Created by nehat on 7/15/2016.
 */

import React from 'react';
import firebaseUtils from '../utils/firebaseUtils';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import {getScreenMode} from '../utils/index';

import SignUpSignInPageHeader from './SignUpSignInPageHeader';

class LoginPage extends React.Component {

    constructor(){
        super();
        this.state = {
            loginEmail: null,
            loginPassword: null,
            error: false,
            users:[]
        };
    }

    componentWillMount() {
        this.props.actions.windowSize();
        var screenSize = getScreenMode();
        console.log("screenSize : ", screenSize);

        /*All users*/
        this.firebaseRef = firebase.database().ref('users');
        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
            var users = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var user = childSnapshot.val();
                user['.key'] = childSnapshot.key;
                users.push(user);
            }.bind(this));

            this.setState({
                users: users
            });
        }.bind(this));
    }

    loginEmailIdChange(event){
        this.setState({loginEmail: event.target.value});
    }
    loginPasswordChange(event){
        this.setState({loginPassword: event.target.value});
    }

    callBack(res){
        console.log("callBack : ", res);
        var LoginWithEmail = res.providerData[res.providerData.length -1].email;
        if(this.state.users.length != 0){
            var LoggedInUserDetails = null;
            for(var index=0; index < this.state.users.length; index++){
                if(this.state.users[index].email == LoginWithEmail){
                    LoggedInUserDetails = this.state.users[index];
                }
            }
            this.props.actions.loggedInUserDetails(LoggedInUserDetails);
            this.props.actions.loadPage('/ongoingRetro');
        }

    }
    loginAccount(){
        var email = this.state.loginEmail;
        var password = this.state.loginPassword;
        firebaseUtils.signInUser({email: email, password: password}, this.callBack.bind(this));
    }

    render() {
        var {windowWidth,windowHeight} = this.props;
        var errors = this.state.error ? <p> {this.state.error} </p> : '';
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={4} md={4} xsOffset={4} mdOffset={4}>
                        <form className="login-form">
                            <FormGroup controlId="formControlsEmailId">
                                <FormControl type="email" placeholder="Email Id" onChange={this.loginEmailIdChange.bind(this)}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsPassword">
                                <FormControl type="password" placeholder="Password" onChange={this.loginPasswordChange.bind(this)}/>
                            </FormGroup>
                            <FormControl type="button" className="signUp-button" value="Login"
                                         style={{backgroundColor: "#FF0000", color:'#ffffff'}}
                                         onClick={this.loginAccount.bind(this)} />

                            {errors}

                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    windowWidth: state.scrums.windowWidth,
    windowHeight: state.scrums.windowHeight
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage);
