/**
 * Created by nehat on 8/18/2016.
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
import TextCell from './TextCell';
var FixedDataTable = require('fixed-data-table');
const {Table, Column, Cell, ColumnGroup} = FixedDataTable;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class ManageTeam extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: [],
            projectName: null,
            projectInfo: null,
            team:[],
            users:[]
        };
    }

    componentWillMount(){

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


        this.firebaseRef = firebase.database().ref('users');
        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
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


        this.firebaseRef = firebase.database().ref('projects/'+ this.props.projectKeyForManageTeam + '/team');
        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
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

    handleAddMemberToTeam(){
        this.props.actions.loadPage('/addTeamMember');
    }

    handleManageTeamCancel(){
        this.props.actions.loadPage('/manageProject');
    }
    handle_Remove(key){
        console.log("Team Member Remove Key:", key);
        var path = "projects/"+ this.props.projectKeyForManageTeam + "/team/"+ key;
        console.log("path:", path);
        this.firebaseRef.child(key).remove();
    }

    render(){
        var {selected_project_id,selected_project_name,projectKeyForManageTeam} = this.props;
        var {projects,team,users} = this.state;
        var teamList = null;
        var dataList = [];
        var userDetails = [];

        if(team != 0 && users != 0){
            for(var index=0; index < team.length; index++){
                for(var place=0; place < users.length; place++){
                    if(team[index].user == users[place]['.key']){
                        userDetails.push(users[place]);
                        break;
                    }
                }
            }
        }

        if(team.length == 0){
            teamList = (
                <div style={{margin:"10px", fontSize:"20px"}}>
                    No members are added to this project team.
                </div>
            );
        }else {
            teamList = (
                <Row style={{margin:"10px"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={team.length}
                        width={1500}
                        maxHeight={500}
                        headerHeight={50}>

                        <Column
                            header={<Cell style={{backgroundColor: '#484848', color:'#ffffff'}}> Employee Name </Cell>}
                            cell={<TextCell data={userDetails} col="full_name" />}
                            width={400}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Role </Cell>}
                            cell={<TextCell data={team} col="jobRole" />}
                            width={400}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Email </Cell>}
                            cell={<TextCell data={userDetails} col="email" />}
                            width={400}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Action </Cell>}
                            cell={<TextCell data={team} col="remove" handle_Remove={this.handle_Remove.bind(this)} />}
                            width={300}
                        />

                    </Table>
                </Row>
            );
        }

        return(
            <div>
                <Row style={{margin:"10px"}}>
                    <Button className="button" onClick={this.handleAddMemberToTeam.bind(this)}> Add </Button>
                </Row>

                {teamList}

                <Row style={{margin:"10px"}}>
                    <Button className="button"> Save Changes </Button>
                    <Button className="button" onClick={this.handleManageTeamCancel.bind(this)}> Cancel </Button>
                </Row>
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    projectKeyForManageTeam: state.scrums.projectKeyForManageTeam,
    selected_project_id: state.scrums.selected_project_id,
    selected_project_name: state.scrums.selected_project_name
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ManageTeam);