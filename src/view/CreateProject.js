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
import {getScreenMode} from '../utils/index';

class CreateProject extends React.Component {
    constructor() {
        super();
        this.state = {
            projects:[], team:[],
            projectName: null,
            projectInfo: null
        };
    }

    componentWillMount(){
        this.firebaseRef = firebase.database().ref('projects');
        this.firebaseRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', function(snapshot) {
            console.log('new record of project', snapshot.key);
            console.log("this.props.loggedInUserDetails['.key']",this.props.loggedInUserDetails['.key']);

            var firebaseRef1 = firebase.database().ref('users/' + this.props.loggedInUserDetails['.key'] + '/projects');
            firebaseRef1.push({project_id: snapshot.key});

            var firebaseRef2 = firebase.database().ref('projects/'+ snapshot.key +'/team');
            firebaseRef2.push({user: this.props.loggedInUserDetails['.key']});
        }.bind(this));
    }

    projectNameCreationChange(event){
        this.setState({projectName: event.target.value});
    }
    additionalProjectInfoChange(event){
        this.setState({projectInfo: event.target.value});
    }
    createProject(event){
        var projectDetails = {
            project_name: this.state.projectName,
            description: this.state.projectInfo,
            owner: this.props.loggedInUserDetails['.key'],
            timestamp: Date.now()
        };
        this.firebaseRef.push(projectDetails);
        this.props.actions.loadPage('/addTeamMember');
    }

    render(){
        var screenSize = getScreenMode();
        var createProjectFormPosition = (screenSize == "medium") ? "createProject-form-md" : "createProject-form-lg";

        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className={createProjectFormPosition} >
                        <FormGroup controlId="formControlsProjectName">
                            <FormControl type="text" placeholder="Project Name" onChange={this.projectNameCreationChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsProjectDescription">
                            <FormControl type="text" componentClass="textarea" placeholder="Additional info about project" onChange={this.additionalProjectInfoChange.bind(this)}/>
                        </FormGroup>
                        <FormControl type="button" value="Create Project"
                                     style={{backgroundColor:"#FF0000",color:'#ffffff'}}
                                     onClick={this.createProject.bind(this)} />


                    </form>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    loggedInUserDetails: state.scrums.loggedInUserDetails,
    projectKeyForManageTeam: state.scrums.projectKeyForManageTeam,
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(CreateProject);
