/**
 * Created by nehat on 7/18/2016.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';


export default class SignUpSignInPageContent extends React.Component{

    render(){
        return(
            <Row>
                <p style={{margin:"100px"}}> Main Page </p>
            </Row>
        );
    }
}

