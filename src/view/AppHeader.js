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
import firebaseUtils from '../utils/firebaseUtils';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

class AppHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: [],
            projectName: null,
            projectId: null
        };
    }

    componentWillMount() {
        var firebaseRef = firebase.database().ref('projects');
        this.firebaseRef = firebase.database().ref('projects');

        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
            console.log("Tree for projects : ", 'projects');
            var projects = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var project = childSnapshot.val();
                project['.key'] = childSnapshot.key;
                projects.push(project);
            }.bind(this));

            console.log("projects : ", projects);

            this.setState({
                projects: projects
            });
        }.bind(this));
    }

    projectNameChange(event){
        console.log("projectId:", event.target.id);
        this.props.actions.selectProject({projectName: event.target.value, projectId: event.target.id});
        this.setState({projectName: event.target.value, projectId: event.target.id});
    }

    callBack(res){
        console.log("callBack : ", res);
        //alert('Registered email is : ' + res.providerData[res.providerData.length -1].email);
        this.props.actions.loadPage('/login');
    }


    logout(event){
        firebaseUtils.SignOut(this.callBack.bind(this));
    }

    render(){

        var {projects} = this.state;

        var projectList = projects.map(data => {
            console.log("Projects : ", data);
            var projectName = data.project_name;
            return(
                <option id="p1" value={projectName.toLowerCase()}>{projectName}</option>
            );
        });

        console.log("ProjectList : ", projectList);

        return(
            <Row style={{backgroundColor:"#FF0000"}}>
                <Col xs={3} md={3} style={{marginTop:"10px"}}>
                    <FormGroup controlId="formControlsUserImage">
                        <Image src="../images/logo.png" style={{width:"200px", height:"50px"}} />
                    </FormGroup>
                </Col>
                <Col xs={4} md={4} style={{ color:"white",fontSize:30, marginTop:"20px"}}>
                    <strong> LiveRetro </strong>
                </Col>
                <Col xs={2} md={2} style={{marginTop:"20px"}}>
                    <FormGroup controlId="formControlsProjectName">
                        <FormControl componentClass="select" placeholder="Project Name" onChange={this.projectNameChange.bind(this)}>
                            <option value="select">Project Name</option>
                            {projectList}
                        </FormControl>
                    </FormGroup>
                </Col>
                <Col xs={1} md={1} style={{marginTop:"10px"}}>
                    <FormGroup controlId="formControlsUserImage">
                        <Image src="../images/common.jpg" style={{width:"50px", height:"50px"}} />
                    </FormGroup>
                </Col>
                <Col xs={1} md={1} style={{marginTop:"25px",fontSize:15}}>
                    <strong> Username </strong>
                </Col>
                <Col xs={1} md={1} style={{marginTop:"20px"}}>
                    <span className="glyphicon glyphicon-log-out"
                          style={{cursor:'pointer',textAlign:"center",fontSize:"40px"}}
                              onClick={this.logout.bind(this)}> </span>
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

export default connect(mapStateToProps,mapDispatchToProps)(AppHeader);

