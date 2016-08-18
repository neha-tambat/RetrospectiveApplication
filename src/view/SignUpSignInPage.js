/**
 * Created by nehat on 7/15/2016.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

import SignUpSignInPageHeader from './SignUpSignInPageHeader';

class SignUpSignInPage extends React.Component {

    constructor() {
        super();
        this.state = {

        };
    }
    componentWillMount(){
        this.props.actions.windowSize();
    }

    handleSignUp(){
        this.props.actions.loadPage('/signUp');
    }

    handleLogin(){
        this.props.actions.loadPage('/login');
    }

    render(){
        var {windowWidth,windowHeight} = this.props;
        return(
            <div style={{textAlign: "center"}}>

                <SignUpSignInPageHeader handleSignUp={this.handleSignUp.bind(this)} handleLogin={this.handleLogin.bind(this)} />

                <div  className="main-image">
                    {this.props.children}
                </div>

            </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(SignUpSignInPage);
