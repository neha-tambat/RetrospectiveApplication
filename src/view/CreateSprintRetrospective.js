/**
 * Created by nehat on 7/19/2016.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import ProjectList from './ProjectList';

class CreateSprintRetrospective extends React.Component {

    constructor(){
        super();
        this.state = {
            userRoleInRetrospective: null, users:[], team:[],retrospectives:[], projects:[],
            projectName : null,
            sprintTitle : null,
            startDate : null,
            endDate : null,
            retrospectiveDate: null,
            retrospectiveTime : null
        };
    }

    componentWillMount(){
        /*All retrospectives*/
        this.firebaseRef_retrospectives = firebase.database().ref('retrospectives');

        /*All users*/
        this.firebaseRef_users = firebase.database().ref('users');
        this.firebaseRef_users.limitToLast(25).on('value', function (dataSnapshot) {
            var users = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var user = childSnapshot.val();
                user['.key'] = childSnapshot.key;
                users.push(user);
            }.bind(this));

            console.log('users', users);

            this.setState({
                users: users
            });
        }.bind(this));

        /*All projects*/
        this.firebaseRef = firebase.database().ref('projects');
        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
            // console.log("Tree for projects : ", 'projects');
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

        /*Team of selected project*/
        this.firebaseRef_team = firebase.database().ref('projects/'+ this.props.projectKeyForManageTeam + '/team');
        this.firebaseRef_team.limitToLast(25).on('value', function (dataSnapshot) {
            var team = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var member = childSnapshot.val();
                member['.key'] = childSnapshot.key;
                team.push(member);
            }.bind(this));

            console.log('team', team);

            this.setState({
                team: team
            });
        }.bind(this));
    }

    userRoleInRetrospective(event){
        this.setState({userRoleInRetrospective: event.target.value});
    }
    projectNameChange(event){
        this.setState({projectName: event.target.value});
    }
    sprintTitleChange(event){
        this.setState({sprintTitle: event.target.value});
    }
    startDateChange(newDate){
        var start_date = newDate.target.value;
        //    var start_date = new Date(new Number(newDate));
        this.setState({startDate: start_date});
    }
    endDateChange(newDate){
        var end_date = newDate.target.value;
        //    var end_date = new Date(newDate/1);
        this.setState({endDate: end_date});
    }
    retrospectiveDateChange(newDate){
        var retrospective_date = newDate.target.value;
        //    var end_date = new Date(newDate/1);
        this.setState({retrospectiveDate: retrospective_date});
    }
    retrospectiveTimeChange(newDate){
        var retrospectiveTime = newDate.target.value;
        //    var retrospectiveTime = new Date(newDate/1);
        this.setState({retrospectiveTime: retrospectiveTime});
    }

    registerScrum(){
        /*Check retrospective status completed or not*/
        var todayDate = new Date().toJSON().slice(0,10);
        console.log("Today's date:", todayDate);
        var Retro_status = (this.state.retrospectiveDate > todayDate) ;
        console.log("Retro_status:",Retro_status);

        var retroRegister = {
            scrum_master: this.props.loggedInUserDetails['.key'],
            sprint_title: this.state.sprintTitle,
            sprint_start_date: this.state.startDate,
            sprint_end_date: this.state.endDate,
            retrospective_date: this.state.retrospectiveDate,
            retrospective_time: this.state.retrospectiveTime,
            project_id: this.props.projectKeyForManageTeam,
            is_completed: !Retro_status,
            timestamp: Date.now()
        };

        /*Add new retrospective to database*/
        var new_retrospective = this.firebaseRef_retrospectives.push(retroRegister);
        console.log("new_retrospective",new_retrospective);

        /*Add retrospective id to all project team active members in user list*/
        for(var index=0; index < this.state.team.length; index++){
            if(this.state.team[index].is_active_member == true) {
                var userKeyToAddRetrospective = this.state.team[index].user;
                var firebaseRef1 = firebase.database().ref('users/' + userKeyToAddRetrospective + '/retrospectives');
                firebaseRef1.push({retrospective_id: new_retrospective.key});
            }
        }

        /*Go to ongoing retrospective page*/
        this.props.actions.loadPage('/ongoingRetro');
    }


    render(){
        var {projects} = this.state;
        var selectedProjectName = null;
        for(var index=0; index < projects.length; index++){
            if(projects[index]['.key'] == this.props.projectKeyForManageTeam){
                selectedProjectName = projects[index].project_name;
            }
        }

        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className="retrospective-form">
                        <FormGroup controlId="formControlsProjectName">
                            <FormControl type="text" placeholder="Project Name" value={selectedProjectName} readOnly="readOnly" />
                        </FormGroup>
                        <FormGroup controlId="formControlsRoleInRetrospective">
                            <ControlLabel>Role in retrospective</ControlLabel>
                            <FormControl componentClass="select" placeholder="Select role" onChange={this.userRoleInRetrospective.bind(this)}>
                                <option value="select">Select role</option>
                                <option value="scrumMaster">Scrum Master</option>
                                <option value="user">User</option>
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId="formControlsSprintTitle">
                            <ControlLabel>Sprint Title</ControlLabel>
                            <FormControl type="text" onChange={this.sprintTitleChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsStartDate">
                            <ControlLabel>Start Date</ControlLabel>
                            <FormControl type="date" onChange={this.startDateChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsEndDate">
                            <ControlLabel>End Date</ControlLabel>
                            <FormControl type="date" onChange={this.endDateChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsRetrospectiveDate">
                            <ControlLabel>Retrospective Date</ControlLabel>
                            <FormControl type="date" onChange={this.retrospectiveDateChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsRetrospectiveTime">
                            <ControlLabel>Retrospective Time</ControlLabel>
                            <FormControl type="time" onChange={this.retrospectiveTimeChange.bind(this)}/>
                        </FormGroup>
                        <FormControl type="button" className="signUp-button" value="Create Retrospective"
                                     style={{backgroundColor: "#FF0000", color:'#ffffff'}}
                                     onClick={this.registerScrum.bind(this)} />
                    </form>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    projectKeyForManageTeam: state.scrums.projectKeyForManageTeam,
    retrospectiveKey_selected: state.scrums.retrospectiveKey_selected,
    loggedInUserDetails: state.scrums.loggedInUserDetails,
    selected_project_id: state.scrums.selected_project_id,
    selected_project_name: state.scrums.selected_project_name
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(CreateSprintRetrospective);