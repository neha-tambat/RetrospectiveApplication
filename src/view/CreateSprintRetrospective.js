/**
 * Created by nehat on 7/19/2016.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';
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
            users:[], team:[],retrospectives:[],
            projectName : null,
            sprintTitle : null,
            today: null,
            startDate : null,
            endDate : null,
            retrospectiveDate: null,

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

            /*Today's date*/
            var todayDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

            this.setState({
                users: users, today: todayDate
            });
        }.bind(this));
    }

    projectNameChange(event){
        this.setState({projectName: event.target.value});
    }
    sprintTitleChange(event){
        this.setState({sprintTitle: event.target.value});
    }
    startDateChange(newDate){
        var start_date = new Date(new Number(newDate));
        var dateFormatChange_startDate = moment(start_date).format("YYYY-MM-DD HH:mm:ss");
        this.setState({startDate: dateFormatChange_startDate});
    }
    endDateChange(newDate){
        var end_date = new Date(newDate/1);
        var dateFormatChange_endDate = moment(end_date).format("YYYY-MM-DD HH:mm:ss");
        this.setState({endDate: dateFormatChange_endDate});
    }
    retrospectiveDateChange(newDate){
        var retrospective_date = new Date(newDate/1);
        var dateFormatChange_retroDate = moment(retrospective_date).format("YYYY-MM-DD HH:mm:ss");
        this.setState({retrospectiveDate: dateFormatChange_retroDate});
    }

    registerScrum(){
        /*Check retrospective status completed or not*/
        var Retro_status = (this.state.retrospectiveDate > this.state.today);
        console.log("Retro_status:",Retro_status);

        var retroRegister = {
            scrum_master: this.props.loggedInUserDetails['.key'],
            sprint_title: this.state.sprintTitle,
            sprint_start_date: this.state.startDate,
            sprint_end_date: this.state.endDate,
            retrospective_date: this.state.retrospectiveDate,
            project_id: this.props.projectKeyForManageTeam,
            is_completed: !Retro_status,
            timestamp: Date.now()
        };

        /*Add new retrospective to database*/
        var new_retrospective = this.firebaseRef_retrospectives.push(retroRegister);
        console.log("new_retrospective",new_retrospective);

        /*Team of selected project*/
        this.firebaseRef_team = firebase.database().ref('projects/'+ this.props.projectKeyForManageTeam + '/team');
        this.firebaseRef_team.limitToLast(25).once('value', function (dataSnapshot) {
            var team = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var member = childSnapshot.val();
                member['.key'] = childSnapshot.key;
                team.push(member);
            }.bind(this));

            /*Add retrospective id to all project team active members in user list*/
            for(var index=0; index < team.length; index++){
                if(team[index].is_active_member == true) {
                    var userKeyToAddRetrospective = team[index].user;
                    var firebaseRef1 = firebase.database().ref('users/' + userKeyToAddRetrospective + '/retrospectives/'+ new_retrospective.key);
                    firebaseRef1.push({retrospective_date: this.state.retrospectiveDate});
                }
            }

            /*Go to ongoing retrospective page*/
            this.props.actions.loadPage('/ongoingRetro');

        }.bind(this));
    }


    render(){
        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className="retrospective-form">

                        <ProjectList />

                        <FormGroup controlId="formControlsSprintTitle">
                            <ControlLabel>Sprint Title</ControlLabel>
                            <FormControl type="text" onChange={this.sprintTitleChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsStartDateTime">
                            <ControlLabel>Start Date</ControlLabel>
                            <DateTimeField minDate={moment(this.state.today)} size="md"
                                           onChange={this.startDateChange.bind(this)} style={{cursor:'pointer'}} />
                        </FormGroup>
                        <FormGroup controlId="formControlsEndDateTime">
                            <ControlLabel>End Date</ControlLabel>
                            <DateTimeField minDate={moment(this.state.startDate)} size="md"
                                           onChange={this.endDateChange.bind(this)} style={{cursor:'pointer'}} />
                        </FormGroup>
                        <FormGroup controlId="formControlsRetrospectiveDateTime">
                            <ControlLabel>Retrospective Date</ControlLabel>
                            <DateTimeField  minDate={moment(this.state.endDate)} size="md"
                                            onChange={this.retrospectiveDateChange.bind(this)} style={{cursor:'pointer'}} />
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