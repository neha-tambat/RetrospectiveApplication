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
            projects: [],
            projectName: null,
            projectId: null
        };
    }

    componentWillMount() {
        var firebaseRef = firebase.database().ref('projects');
        this.firebaseRef = firebase.database().ref('projects');

        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
           // console.log("Tree for projects : ", 'projects');
            var projects = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var project = childSnapshot.val();
                project['.key'] = childSnapshot.key;
                projects.push(project);
            }.bind(this));

            //console.log("projects : ", projects);

            this.setState({
                projects: projects
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
            //console.log("projectId:", event.target.id);
            this.props.actions.selectProject({
                projectName: event.target.value,
                projectId: event.target.selectedOptions[0].id
            });
            this.setState({projectName: event.target.value, projectId: event.target.selectedOptions[0].id});
        }
    }

    render(){
        var {projectKeyForManageTeam} = this.props;
        var {projects} = this.state;

        var projectList = projects.map(data => {
            //console.log("Projects : ", data);
            var projectName = data.project_name;
            return(
                <option id={data['.key']} key={data['.key']}
                        selected={(projectKeyForManageTeam == data['.key']) ? "selected" : ""}
                        value={projectName.toLowerCase()}>{projectName}</option>
            );
        });

        //console.log("ProjectList : ", projectList);

        return(
            <FormGroup controlId="formControlsProjectName">
                <FormControl componentClass="select" placeholder="Project Name" onChange={this.projectNameChange.bind(this)}>
                    <option value="select">Project Name</option>
                    {projectList}
                </FormControl>
            </FormGroup>
        );
    }

}


const mapStateToProps = (state) => ({
    projectKeyForManageTeam: state.scrums.projectKeyForManageTeam
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ProjectList);

