/**
 * Created by nehat on 7/19/2016.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebaseUtils from '../utils/firebaseUtils';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import ModalBox from '../components/ModalBox';
import WarningModalBox from '../components/WarningModalBox';
import AppHeader from './AppHeader';
import {getScreenMode} from '../utils/index';

class LoggedInUserLandingPage extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: [], team:[],
            menuIndex: 2,
            show : false,
            warningShow: false,
            createEmployee: false,
            modalBody_createEmployee: 'Confirm Details...',
            headerMsg : 'Create Project',
            WaringHeaderMsg : 'Warning',
            modalBody_warning: 'Select project first and proceed.'
        };
    }

    componentWillMount(){
        this.props.actions.windowSize();
        var screenSize = getScreenMode();
        console.log("screenSize : ", screenSize);
        this.props.actions.loadPage('/ongoingRetro');

        this.firebaseRef = firebase.database().ref('projects');
        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
            var projects = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var project = childSnapshot.val();
                project['.key'] = childSnapshot.key;
                projects.push(project);
            }.bind(this));

            this.setState({
                projects: projects
            });
        }.bind(this));
    }

    handleSelect(selectedKey) {
        if(this.props.projectKeyForManageTeam == null){
            this.setState({warningShow: true});
        }else {
            console.log("Selected project : ", this.props.projectKeyForManageTeam);
            var tab;
            if(selectedKey == "1"){
                tab = "createSprintRetro";
            }else if(selectedKey == "2"){
                tab = "ongoingRetro";
            }else if(selectedKey == "3"){
                tab = "pastRetro";
            }

            this.props.actions.loadPage('/'+tab);
            this.setState({menuIndex  : selectedKey});
        }
    }

    onHide(){
        this.setState({show:false});
    }
    onWarningHide(){
        this.setState({warningShow: false});
    }

    modalSubmit(){
        console.log("Warning message : Select project first and proceed.");
        this.setState({warningShow: false});
    }

    myProfile(){
        this.props.actions.loadPage('/myProfile');
    }
    createProject(){
        this.props.actions.loadPage('/createProject');
    }
    manageProject(){
        this.props.actions.loadPage('/manageProject');
    }
    logout(event){
        firebaseUtils.SignOut(this.callBack.bind(this));
    }
    callBack(res){
        console.log("callBack : ", res);
        //alert('Registered email is : ' + res.providerData[res.providerData.length -1].email);
        this.props.actions.loadPage('/login');
    }

    render(){
        var {leftDrawer,windowWidth,windowHeight,projectKeyForManageTeam,selected_project_id,selected_project_name} = this.props;
        console.log("windowWidth : ",windowWidth);
        console.log("windowHeight : ",windowHeight);
        var screenSize = getScreenMode();
        var LeftDrawer = null;
        var leftDrawerColSize = 0;
        var contentSize = 12;
        var navItems = null;
        console.log("leftDrawer : ", leftDrawer);

        if(leftDrawer){
            contentSize = 10;
            LeftDrawer = (
                <Col xs={2} md={2} className="leftDrawer" >
                    <Row>
                        <Nav bsStyle="pills" stacked activeKey={this.state.menuIndex} onSelect={this.handleSelect.bind(this)}>
                            <NavItem eventKey={1} href="#createSprintRetro"> <span style={{color:"white"}}>Create Sprint Retrospective</span> </NavItem>
                            <NavItem eventKey={2} href="#ongoingRetro"> <span style={{color:"white"}}>Ongoing Retrospective</span> </NavItem>
                            <NavItem eventKey={3} href="#pastRetro"> <span style={{color:"white"}}>Past Retrospective</span> </NavItem>
                        </Nav>
                    </Row>
                </Col>
            );
        }

        return(
            <div style={{textAlign: "center"}}>
                <AppHeader projects={this.state.projects}
                           createProject={this.createProject.bind(this)}
                           manageProject={this.manageProject.bind(this)}
                           myProfile={this.myProfile.bind(this)}
                           logout={this.logout.bind(this)} />
                <Row>
                    {LeftDrawer}
                    <Col xs={contentSize} md={contentSize} >
                        <Row className="container-page">
                            {this.props.children}
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <WarningModalBox
                        showModal={this.state.warningShow}
                        onWarningHide={this.onWarningHide.bind(this)}
                        headerMsg= {this.state.WaringHeaderMsg}
                        modalbody={this.state.modalBody_warning}
                        onWarningModalSubmit ={this.modalSubmit.bind(this)}
                    />
                </Row>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    leftDrawer: state.scrums.leftDrawer,
    windowWidth: state.scrums.windowWidth,
    windowHeight: state.scrums.windowHeight,
    projectKeyForManageTeam: state.scrums.projectKeyForManageTeam,
    retrospectiveKey_selected: state.scrums.retrospectiveKey_selected,
    loggedInUserDetails: state.scrums.loggedInUserDetails,
    selected_project_id: state.scrums.selected_project_id,
    selected_project_name: state.scrums.selected_project_name

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LoggedInUserLandingPage);

