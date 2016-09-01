/**
 * Created by nehat on 8/11/2016.
 */

import React from 'react';
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

class ProjectList extends React.Component {
    constructor() {
        super();
        this.state = {
            userSpecificProjects: [], projects: [],
            projectName: null,
            projectId: null
        };
    }

    componentWillMount() {
        /*All projects*/
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

        /*Logged in user specific projects*/
        this.firebaseRef_userProjects = firebase.database().ref('users/' + this.props.loggedInUserDetails['.key'] + '/projects');
        this.firebaseRef_userProjects.limitToLast(25).on('value', function (dataSnapshot) {
            var userSpecificProjects = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var user_project = childSnapshot.val();
                user_project['.key'] = childSnapshot.key;
                userSpecificProjects.push(user_project);
            }.bind(this));

            this.setState({
                userSpecificProjects: userSpecificProjects
            });
        }.bind(this));
    }

    projectNameChange(event){
        if(event.target.value == "select"){
            this.props.actions.selectProject({
                projectName: null,
                projectId: null
            });

            this.props.actions.loadPage('/ongoingRetro');
            this.setState({projectName: null, projectId: null});
        }else {
            this.props.actions.selectProject({
                projectName: event.target.value,
                projectId: event.target.selectedOptions[0].id
            });
            this.setState({projectName: event.target.value, projectId: event.target.selectedOptions[0].id});
        }
    }

    render(){
        var {projectKeyForManageTeam} = this.props;
        var {userSpecificProjects,projects} = this.state;
        var dataList = [];
        if (projects.length != 0 && userSpecificProjects != 0) {
            for(var index = 0; index < userSpecificProjects.length; index++){
                for(var place=0; place < projects.length; place++){
                    if(userSpecificProjects[index].project_id == projects[place]['.key']){
                        /*User specific project list*/
                        dataList.push(projects[place]);
                    }
                }
            }
        }

        var projectList = dataList.map(data => {
            var projectName = data.project_name;
            return(
                <option id={data['.key']} key={data['.key']}
                        selected={(projectKeyForManageTeam == data['.key']) ? "selected" : ""}
                        value={projectName.toLowerCase()}>{projectName}</option>
            );
        });

        return(
            <FormGroup controlId="formControlsProjectName">
                <FormControl
                    componentClass="select"
                    placeholder="Project Name"
                    onChange={this.projectNameChange.bind(this)}
                >

                    <option value="select">Project Name</option>
                    {projectList}

                </FormControl>
            </FormGroup>
        );
    }

}


const mapStateToProps = (state) => ({
    projectKeyForManageTeam: state.scrums.projectKeyForManageTeam,
    loggedInUserDetails: state.scrums.loggedInUserDetails,
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ProjectList);

