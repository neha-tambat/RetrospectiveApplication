/**
 * Created by nehat on 8/19/2016.
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
import ProjectList from './ProjectList';
import WarningModalBox from '../components/WarningModalBox';

class AddTeamMember extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: [], team: [], users:[],
            employeeName: null,
            employeeEmail: null,
            employeeJobRole: null,
            userKey: null,
            warningShow_addMember: false,
            WaringHeaderMsg_addMember : 'Error',
            modalBody_addMember: 'This email id is not found in record. Please provide correct email id.'
        };
    }

    componentWillMount(){
        this.props.actions.windowSize();

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

        this.firebaseRef1 = firebase.database().ref('projects/'+ this.props.projectKeyForManageTeam +'/team');
        this.firebaseRef1.limitToLast(25).on('value', function (dataSnapshot) {
            console.log("Tree for team : " , 'projects/'+ this.props.projectKeyForManageTeam +'/team');
            var team = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var teamMate = childSnapshot.val();
                teamMate['.key'] = childSnapshot.key;
                team.push(teamMate);
            }.bind(this));

            this.setState({
                team: team
            });
        }.bind(this));
    }

    employeeName_Change(event){
        this.setState({employeeName: event.target.value});
    }
    employeeEmailId(event){
        var Email = event.target.value;
        var matchedUserKey = null;
        for(var place=0; place < this.state.users.length; place++){
            if(this.state.users[place].email == Email){
                matchedUserKey = this.state.users[place]['.key'];
            }
        }
        this.setState({employeeEmail: Email, userKey: matchedUserKey});
    }
    employeeJobRole(event){
        this.setState({employeeJobRole: event.target.value});
    }
    addTeamMember(event){
        if(this.state.userKey != null){
            this.firebaseRef1.push({
                user: this.state.userKey,
                jobRole: this.state.employeeJobRole
            });
            var firebaseRef = firebase.database().ref('users/' + this.state.userKey + '/projects');
            firebaseRef.push({project_id: this.props.projectKeyForManageTeam});
            this.props.actions.loadPage('/manageTeam');
        }else {
            this.setState({warningShow_addMember: true});
        }
    }

    onWarningHide(){
        this.setState({warningShow_addMember: false});
    }
    modalSubmit_addMember(){
        console.log("This email id is not found in record. Please provide correct email id.");
        this.setState({warningShow_addMember: false});
    }

    render(){
        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className="addMemberToProject-form" >
                        <ProjectList />

                        <FormGroup controlId="formControlsEmployeeName">
                            <FormControl type="text" placeholder="Employee Name" onChange={this.employeeName_Change.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsEmployeeEmail">
                            <FormControl type="text" placeholder="Email Id" onChange={this.employeeEmailId.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsEmployeeJobRole">
                            <FormControl type="text" placeholder="Job Role" onChange={this.employeeJobRole.bind(this)}/>
                        </FormGroup>
                        <FormControl type="button" className="signUp-button" value="Add Team Member"
                                     style={{backgroundColor: "#FF0000", color:'#ffffff'}}
                                     onClick={this.addTeamMember.bind(this)} />
                    </form>
                </Row>
                <Row>
                    <WarningModalBox
                        showModal={this.state.warningShow_addMember}
                        onWarningHide={this.onWarningHide.bind(this)}
                        headerMsg= {this.state.WaringHeaderMsg_addMember}
                        modalbody={this.state.modalBody_addMember}
                        onWarningModalSubmit ={this.modalSubmit_addMember.bind(this)}
                    />
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

export default connect(mapStateToProps,mapDispatchToProps)(AddTeamMember);
