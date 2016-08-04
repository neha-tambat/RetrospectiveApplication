/**
 * Created by nehat on 7/19/2016.
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
import WarningModalBox from '../components/WarningModalBox';
import AppHeader from './AppHeader';

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
        this.props.actions.loadPage('/loginSuccess/ongoingRetro');

        this.firebaseRef = firebaseInit.database().ref('projects');

        var firebaseRef = firebase.database().ref('projects');
        //this.bindAsArray(firebaseRef.limitToLast(25), 'projects');
        this.firebaseRef = firebase.database().ref('projects');

        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
            var projects = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var project = childSnapshot.val();
                project['.key'] = childSnapshot.key;
                projects.push(project);
            }.bind(this));

            console.log('projects', projects);

            this.setState({
                projects: projects
            });
        }.bind(this));


    }

    left_Drawer(){
        this.props.actions.leftDrawer();
    }

    handleSelect(selectedKey) {
        if(this.props.selected_project_id == null){
            //alert("Please select project.");
            this.setState({warningShow: true});
        }else {
            console.log("Selected project : ", this.props.selected_project_id);
            var tab;
            //alert('selected ' + selectedKey);
            if(selectedKey == "1"){
                tab = "myProfile";
            }else if(selectedKey == "2"){
                tab = "ongoingRetro";
            }else if(selectedKey == "3"){
                tab = "pastRetro";
            }else if(selectedKey == "4"){
                tab = "teamManage";
            }else if(selectedKey == "5"){
                tab = "createSprintRetro";
            }

            this.props.actions.loadPage('/loginSuccess/'+tab);
            this.setState({menuIndex  : selectedKey});
        }
    }

    createProject(){
        this.setState({show:true, createEmployee: true});
    }
    onHide(){
        this.setState({show:false});
    }
    onWarningHide(){
        this.setState({warningShow: false});
    }

    addMemberToDatabase(matchedKey){
        if(matchedKey != null){
            var firebaseRef1 = firebase.database().ref('projects/'+ matchedKey +'/team');
            this.firebaseRef1 = firebase.database().ref('projects/'+ matchedKey +'/team');

            this.firebaseRef1.limitToLast(25).on('value', function (dataSnapshot) {
                console.log("Tree for team : " , 'projects/'+ matchedKey +'/team');
                var team = [];
                dataSnapshot.forEach(function (childSnapshot) {
                    var teamMate = childSnapshot.val();
                    teamMate['.key'] = childSnapshot.key;
                    team.push(teamMate);
                }.bind(this));

                console.log('team', team);

                this.setState({
                    team: team
                });
            }.bind(this));
        }
    }

    modalSubmitCreateProject(event,modalTab){
        console.log("ModalTab : ", modalTab);
        console.log("Event : " , event);

        if(modalTab == "Create Project"){
            var user = firebase.auth().currentUser;
            if (user) {
                event.user_id = user.uid;
                this.firebaseRef.push(event);
            }
            else{
                alert("Login to application before creating Application");
            }
        }else if(modalTab == "Add Member"){

            for(var index=0; index <= this.state.projects.length; index++){
                if(this.state.projects[index].project_name.toLowerCase() == event.teamMemberProjectName.toLowerCase()){
                    var matchedKey = this.state.projects[index]['.key'];
                    break;
                }
            }

            console.log("matchedKey : ", matchedKey);
            this.addMemberToDatabase(matchedKey);
            this.firebaseRef1.push(event);
        }

        this.setState({show:false, createEmployee: false});
    }

    modalSubmit(){
        console.log("Warning message : Select project first and proceed.");
        this.setState({warningShow: false});
    }


    render(){
        var {leftDrawer,windowWidth,windowHeight,selected_project_id} = this.props;
        console.log("windowWidth : ",windowWidth);
        console.log("windowHeight : ",windowHeight);

        var icon = null;
        var leftDrawerColSize = null;
        var contentSize = null;
        var navItems = null;
        console.log("leftDrawer : ", leftDrawer);
        if(leftDrawer){
            icon = "glyphicon glyphicon-chevron-left";
            leftDrawerColSize = 2;
            contentSize = 10;
            navItems = (
                <Nav bsStyle="pills" stacked activeKey={this.state.menuIndex} onSelect={this.handleSelect.bind(this)}>
                    <NavItem eventKey={1} href="#myProfile"> <span style={{color:"white"}}>My Profile</span> </NavItem>
                    <NavItem eventKey={2} href="#ongoingRetro"> <span style={{color:"white"}}>Ongoing Retrospective</span> </NavItem>
                    <NavItem eventKey={3} href="#pastRetro"> <span style={{color:"white"}}>Past Retrospective</span> </NavItem>
                    <NavItem eventKey={4} href="#teamManage"> <span style={{color:"white"}}>Team Manage</span> </NavItem>
                    <NavItem eventKey={5} href="#createSprintRetro"> <span style={{color:"white"}}>Create Sprint Retrospective</span> </NavItem>
                </Nav>
            );

        }else {
            icon = "glyphicon glyphicon-menu-hamburger";
            leftDrawerColSize = 1;
            contentSize = 11;
            navItems=(
                <Nav bsStyle="pills" stacked activeKey={this.state.menuIndex} onSelect={this.handleSelect.bind(this)}>
                    <NavItem eventKey={1} href="#myProfile"> <span style={{color:"white"}} className="glyphicon glyphicon-user"> </span> </NavItem>
                    <NavItem eventKey={2} href="#ongoingRetro"> <span style={{color:"white"}} className="glyphicon glyphicon-th-list"> </span> </NavItem>
                    <NavItem eventKey={3} href="#pastRetro"> <span style={{color:"white"}} className="glyphicon glyphicon-eye-open"> </span> </NavItem>
                    <NavItem eventKey={4} href="#teamManage"> <span style={{color:"white"}} className="glyphicon glyphicon-th"> </span> </NavItem>
                    <NavItem eventKey={5} href="#createSprintRetro"> <span style={{color:"white"}} className="glyphicon glyphicon-plus"> </span> </NavItem>
                </Nav>
            );
        }
        return(
            <Grid style={{backgroundColor: "#E6E6E6", textAlign: "center", margin: 0, width: "100%", height:"100%"}}>
                <AppHeader />
                <Row className="clearfix">
                    <Col xs={leftDrawerColSize} md={leftDrawerColSize} style={{backgroundColor:"black", height:windowHeight}}>
                        <Row>
                            <span className={icon} onClick={this.left_Drawer.bind(this)} style={{color:"white",cursor:'pointer'}}> </span>
                        </Row>
                        <Row>
                            {navItems}
                        </Row>
                    </Col>

                    <Col xs={contentSize} md={contentSize} style={{backgroundColor:"#E6E6E6",marginTop:"10px", height:windowHeight}} >
                        <Row style={{margin:"20px", marginLeft:"1200px"}}>
                            <Button type="button" className="createProject" onClick={this.createProject.bind(this)} style={{color:"white", backgroundColor:"red"}}> Create Project </Button>
                        </Row>
                        <Row>
                            {this.props.children}
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <ModalBox
                        showModal= {this.state.show}
                        onHide= {this.onHide.bind(this)}
                        headerMsg= {this.state.headerMsg}
                        modalbody={this.state.modalBody_createEmployee}
                        onModalSubmit ={this.modalSubmitCreateProject.bind(this)}

                    />
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
            </Grid>
        );
    }
}


const mapStateToProps = (state) => ({
    leftDrawer: state.scrums.leftDrawer,
    windowWidth: state.scrums.windowWidth,
    windowHeight: state.scrums.windowHeight,
    selected_project_id: state.scrums.selected_project_id
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LoggedInUserLandingPage);

