/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

class CreateProject extends React.Component {
    constructor() {
        super();
        this.state = {
            projects:[],
            projectName: null,
            projectInfo: null
        };
    }

    componentWillMount(){
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

    projectNameCreationChange(event){
        this.setState({projectName: event.target.value});
    }
    additionalProjectInfoChange(event){
        this.setState({projectInfo: event.target.value});
    }
    createProject(event){
        var projectDetails = {project_name: this.state.projectName, description: this.state.projectInfo};
        this.firebaseRef.push(projectDetails);
    }

    render(){
        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className="createProject-form" >
                        <FormGroup controlId="formControlsProjectName">
                            <FormControl type="text" placeholder="Project Name" onChange={this.projectNameCreationChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsProjectDescription">
                            <FormControl type="text" componentClass="textarea" placeholder="Additional info about project" onChange={this.additionalProjectInfoChange.bind(this)}/>
                        </FormGroup>
                        <Button type="submit" style={{backgroundColor:"#FF0000", width:"500px"}} onClick={this.createProject.bind(this)} >
                            <span style={{color:"white", fontSize:"18px"}}> <strong>Create Project</strong> </span>
                        </Button>
                    </form>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(CreateProject);
