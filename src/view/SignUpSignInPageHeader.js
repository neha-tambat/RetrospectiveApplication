/**
 * Created by nehat on 7/18/2016.
 */

var React = require('react');
var RegisterFormLeftPanel = require('./RegisterFormLeftPanel');
var RegisterFormRightPanel = require('./RegisterFormRightPanel');
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
        this.props.actions.loadPage('/signUp');
    }

    handleLogin(){
        this.props.actions.loadPage('/login');
    }

    render(){
        return(
            <Row style={{backgroundColor:"#FF0000"}}>
                <Col xs={3} md={3} style={{marginTop:"20px"}}>
                    <FormGroup controlId="formControlsUserImage">
                        <Image src="../images/logo.png" style={{width:"200px", height:"50px"}} />
                    </FormGroup>
                </Col>
                <Col xs={7} md={7} style={{marginTop:"20px"}}> </Col>
                <Col xs={1} md={1} style={{marginTop:"20px"}}>
                    <Button type="submit" onClick={this.handleSignUp.bind(this)} style={{backgroundColor:"black",color:"white",width:"100px", height:"40px"}}>
                        Sign Up
                    </Button>
                </Col>
                <Col xs={1} md={1} style={{marginTop:"20px"}}>
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

