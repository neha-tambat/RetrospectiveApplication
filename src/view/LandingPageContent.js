/**
 * Created by nehat on 7/26/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import ModalBox from '../components/ModalBox';
var Sidebar = require('react-sidebar').default;

class LandingPageContent extends React.Component {

    constructor(){
        super();
        this.state={

        };
    }

    showLeft() {
        this.refs.left.show();
    }


    render(){

        return(
            <Grid>
                <Menu ref="left" alignment="left">
                    <button onClick={this.showLeft.bind(this)}>Show Left Menu!</button>
                    <MenuItem hash="first-page">First Page</MenuItem>
                    <MenuItem hash="second-page">Second Page</MenuItem>
                    <MenuItem hash="third-page">Third Page</MenuItem>
                </Menu>

            </Grid>
        );
    }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LandingPageContent);