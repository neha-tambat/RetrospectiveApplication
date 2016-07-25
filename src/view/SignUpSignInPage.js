/**
 * Created by nehat on 7/15/2016.
 */

var React = require('react');
var RegisterFormLeftPanel = require('./RegisterFormLeftPanel');
var RegisterFormRightPanel = require('./RegisterFormRightPanel');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

import SignUpSignInPageContent from './SignUpSignInPageContent';
import SignUpSignInPageHeader from './SignUpSignInPageHeader';

class SignUpSignInPage extends React.Component {

    constructor() {
        super();
        this.state = {

        };
    }

    render(){
        return(
            <Grid style={{backgroundColor: "#E6E6E6", textAlign: "center", margin: 0, width: "100%"}}>

                <SignUpSignInPageHeader />

                <SignUpSignInPageContent />

                <Row>
                    {this.props.children}
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

export default connect(mapStateToProps,mapDispatchToProps)(SignUpSignInPage);
