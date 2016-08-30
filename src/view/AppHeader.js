/**
 * Created by nehat on 7/18/2016.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel,Overlay,Tooltip,
    MenuItem,Clearfix,SplitButton,Dropdown,DropdownButton,NavDropdown} from 'react-bootstrap';
import firebaseUtils from '../utils/firebaseUtils';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import ProjectList from './ProjectList';
import {getScreenMode} from '../utils/index';

class AppHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            userSpecificProjects:[],
            projectName: null,
            projectId: null,
            userIconClick : false,
            show: false
        };
    }

    componentWillMount(){
        /*Logged in user specific projects*/
        this.firebaseRef_userProjects = firebase.database().ref('users/' + this.props.loggedInUserDetails['.key'] + '/projects');
        this.firebaseRef_userProjects.limitToLast(25).on('value', function (dataSnapshot) {
            var userSpecificProjects = [];
            var overlayShow = false;
            dataSnapshot.forEach(function (childSnapshot) {
                var user_project = childSnapshot.val();
                user_project['.key'] = childSnapshot.key;
                userSpecificProjects.push(user_project);
            }.bind(this));

            if(userSpecificProjects.length == 0){
                overlayShow = true
            }

            this.setState({
                userSpecificProjects: userSpecificProjects,
                show: overlayShow
            });
        }.bind(this));
    }

    projectNameChange(event){
        console.log("projectId:", event.target.id);
        this.props.actions.selectProject({projectName: event.target.value, projectId: event.target.id});
        this.setState({projectName: event.target.value, projectId: event.target.id});
    }
    logout(event){
        this.props.logout();
    }
    left_Drawer(){
        this.props.actions.leftDrawer();
    }
    handleUser(){
        this.setState({userIconClick : true, show: false});
    }
    createProject(){
        this.props.createProject();
        this.setState({userIconClick : false});
    }
    manageProject(){
        this.props.manageProject();
        this.setState({userIconClick : false});
    }
    myProfile(){
        this.props.myProfile();
        this.setState({userIconClick : false});
    }

    render(){
        var {userIconClick} = this.state;
        var {leftDrawer,loggedInUserDetails} = this.props;
        var screenSize = getScreenMode();
        var userIconClickList = null;
        var leftDrawerIcon = leftDrawer ? "glyphicon glyphicon-chevron-left" : "glyphicon glyphicon-menu-hamburger";

        if(userIconClick){
            userIconClickList = (
                <Clearfix style={{margin:'10px', padding:'10px',width:'250px'}}>
                    <MenuItem>
                        <Row>
                            <Col xs={4} md={4}>
                                <Image src="../images/common.jpg" circle circle style={{width:"50px", height:"50px"}} />
                            </Col>
                            <Col xs={8} md={8}>
                                <Row style={{marginBottom:'10px'}}>
                                    {loggedInUserDetails.full_name}
                                </Row>
                                <Row style={{marginBottom:'10px'}}>
                                    {loggedInUserDetails.email}
                                </Row>
                                <Row style={{marginBottom:'10px'}}>
                                    <Button style={{color:'white', backgroundColor:'black'}} id={loggedInUserDetails}
                                            onClick={this.myProfile.bind(this)}> My Profile </Button>
                                </Row>
                            </Col>
                        </Row>
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem style={{cursor:'pointer'}} onClick={this.createProject.bind(this)}> Create Project </MenuItem>
                    <MenuItem style={{cursor:'pointer'}} onClick={this.manageProject.bind(this)}> Manage Project </MenuItem>
                    <MenuItem divider />
                    <MenuItem style={{cursor:'pointer'}} onClick={this.logout.bind(this)}> Sign Out </MenuItem>
                </Clearfix>
            );
        }

        return(
            <Row style={{backgroundColor:"#FF0000"}}>
                <Col xs={2} md={2}>
                    <Image src="../images/synerzip.png" style={{width:"305px", height:"60px"}} />
                </Col>
                <Col xs={1} md={1} style={{marginTop:"20px"}}>
                    <div className={leftDrawerIcon}
                         style={{cursor:'pointer',textAlign:"center",fontSize:"20px", color:'white'}}
                         onClick={this.left_Drawer.bind(this)}> </div>
                </Col>
                <Col xs={5} md={5} style={{ color:"white",fontSize:20, marginTop:"20px"}}>
                    <strong> LiveRetro </strong>
                </Col>
                <Col xs={2} md={2} style={{marginTop:"10px"}}>
                   <ProjectList />
                </Col>
                <Col xs={2} md={2}>
                    <NavDropdown title={<Image src="../images/common.jpg" circle style={{width:"60px", height:"60px"}} />}
                                 id="top-menu-user"
                                 onClick={this.handleUser.bind(this)} >
                            {userIconClickList}
                    </NavDropdown>
                    <Overlay show={this.state.show} onHide={() => this.setState({ show: false })} placement="bottom">
                        <Tooltip id="overload-bottom" style={{marginLeft:"1680px", marginTop:"60px"}}>Go to Create Project first.</Tooltip>
                    </Overlay>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    leftDrawer: state.scrums.leftDrawer,
    loggedInUserDetails: state.scrums.loggedInUserDetails
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(AppHeader);

