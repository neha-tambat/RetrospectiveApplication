/**
 * Created by nehat on 7/18/2016.
 */

import React from 'react';
//var RegisterFormLeftPanel = require('./RegisterFormLeftPanel');
//var RegisterFormRightPanel = require('./RegisterFormRightPanel');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';


class SignUpSignInPageHeader extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }
    handleSignUp(){
        this.props.handleSignUp();
    }

    handleLogin(){
        this.props.handleLogin();
    }

    render(){
        return(
            <Row style={{backgroundColor:"#FF0000"}}>
                <Col xs={4} md={4}>
                    <Image className="logo" src="../images/synerzip.png"/>
                </Col>

                <Col xs={3} md={3} xsOffset={5} mdOffset={5}>
                    <Button className="custom-button" type="submit" onClick={this.handleSignUp.bind(this)} >
                        Sign Up
                    </Button>
                    <Button className="custom-button" type="submit" onClick={this.handleLogin.bind(this)}>
                        Login
                    </Button>
                </Col>
            </Row>
        );
    }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(SignUpSignInPageHeader);

