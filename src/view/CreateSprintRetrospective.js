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
            retrospectives: [],
            userRoleInRetrospective: null,
            projectName : null,
            sprintTitle : null,
            startDate : null,
            endDate : null,
            retrospectiveTime : null
        };
    }

    componentWillMount(){
        this.firebaseRef = firebase.database().ref('retrospectives');
        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            var retrospectives = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var retrospective = childSnapshot.val();
                retrospective['.key'] = childSnapshot.key;
                retrospectives.push(retrospective);
            }.bind(this));

            console.log("retrospectives : ", retrospectives);

            this.setState({
                retrospectives: retrospectives
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
    retrospectiveTimeChange(newDate){
        var retrospectiveTime = newDate.target.value;
        //    var retrospectiveTime = new Date(newDate/1);
        this.setState({retrospectiveTime: retrospectiveTime});
    }

    registerScrum(){
        var retroRegister = {
            scrum_master: this.props.loggedInUserDetails['.key'],
            sprint_title: this.state.sprintTitle,
            sprint_start_date: this.state.startDate,
            sprint_end_date: this.state.endDate,
            retrospective_time: this.state.retrospectiveTime,
            project_id: this.props.projectKeyForManageTeam
        };
        this.firebaseRef.push(retroRegister);
        //var firebaseRef = firebase.database().ref('users/' + this.props.loggedInUserDetails['.key'] + '/retrospectives');
        //firebaseRef.push({retrospective_id: this.props.projectKeyForManageTeam});
        this.props.actions.loadPage('/ongoingRetro');
    }


    render(){
        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className="retrospective-form">

                        <ProjectList />

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