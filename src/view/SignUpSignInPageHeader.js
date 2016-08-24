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
                <Col xs={2} md={2}>
                    <Image className="logo" src="../images/synerzip.png" className="logo" />
                </Col>
                <Col xs={8} md={8} style={{marginTop:"10px"}}> </Col>
                <Col xs={1} md={1} style={{marginTop:"10px"}}>
                    <Button type="submit" onClick={this.handleSignUp.bind(this)} style={{backgroundColor:"black",color:"white",width:"100px", height:"40px"}}>
                        Sign Up
                    </Button>
                </Col>
                <Col xs={1} md={1} style={{marginTop:"10px"}}>
                    <Button type="submit" onClick={this.handleLogin.bind(this)} style={{backgroundColor:"black", color:"white",width:"100px", height:"40px"}}>
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

