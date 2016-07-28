/**
 * Created by nehat on 7/15/2016.
 */

var React = require('react');
var firebaseUtils = require('../utils/firebaseUtils');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

import SignUpSignInPageHeader from './SignUpSignInPageHeader';

class SignUpPage extends React.Component {

    constructor(){
        super();
        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            confirmPassword: false,
            error: false,
            users: null
        };
    }

    componentWillMount() {
        var firebaseRef = firebase.database().ref('users');
        //this.bindAsArray(firebaseRef.limitToLast(25), 'users');

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

    componentWillUnmount() {
       // this.firebaseRefs.off();
    }

    firstNameChange(event){
        this.setState({firstName: event.target.value});
    }
    lastNameChange(event){
        this.setState({lastName: event.target.value});
    }
    emailIdChange(event){
        this.setState({email: event.target.value});
    }
    passwordChange(event){
        this.setState({password: event.target.value});
    }
    confirmPasswordChange(event){
        if(this.state.password == event.target.value){
            this.setState({confirmPassword: true});
        }
    }

    callBack(res){
        console.log("callBack : ", res);
        alert('Registered email is : ' + res.providerData[res.providerData.length -1].email);
        this.props.actions.loadPage('/login');
    }

    signUp(event){
        var email = this.state.email;
        var password = this.state.password;
        firebaseUtils.createNewUser({email: email, password: password}, this.callBack.bind(this));
    }

    render() {
        var errors = this.state.error ? <p> {this.state.error} </p> : '';
        return (
            <Grid style={{backgroundColor: "#E6E6E6", textAlign: "center", margin: 0, width: "100%"}}>

                <SignUpSignInPageHeader />

                <Row style={{margin:"50px"}}>
                    <Col xs={4} md={4}> </Col>
                    <Col xs={4} md={4}>
                        <form style={{backgroundColor:"white",boxShadow: "5px 5px 5px", padding: "10px"}}>
                            <ControlLabel style={{fontSize:"25px"}}> Sign Up </ControlLabel>
                            <FormGroup controlId="formControlsFirstName">
                                <FormControl type="text" placeholder="First Name" onChange={this.firstNameChange.bind(this)}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsLastName">
                                <FormControl type="text" placeholder="Last Name" onChange={this.lastNameChange.bind(this)}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsEmailId">
                                <FormControl type="email" placeholder="Email Id" onChange={this.emailIdChange.bind(this)}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsPassword">
                                <FormControl type="password" placeholder="Password" onChange={this.passwordChange.bind(this)}/>
                            </FormGroup>
                            <FormGroup controlId="formControlsConfirmPassword">
                                <FormControl type="password" placeholder="Confirm Password" onChange={this.confirmPasswordChange.bind(this)}/>
                            </FormGroup>
                            <Button type="submit" style={{backgroundColor:"#FF0000", width:"150px"}} onClick={this.signUp.bind(this)} >
                                <span style={{color:"white", fontSize:"18px"}}> <strong>Sign Up</strong> </span>
                            </Button>
                            {errors}
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(SignUpPage);
