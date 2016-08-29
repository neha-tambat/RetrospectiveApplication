/**
 * Created by nehat on 8/5/2016.
 */

var React = require('react');
import Component from 'react';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import * as scrumsActionCreator from '../actions/scrums/index';
import TextCell from './TextCell';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
var FixedDataTable = require('fixed-data-table');
const {Table, Column, Cell, ColumnGroup} = FixedDataTable;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class ManageProject extends React.Component {

    constructor(){
        super();
        this.state={
            projects:[], userSpecificProjects:[]
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

    handleManageTeam(key){
        /*Set key for selected project*/
        this.props.actions.ManageTeamForProject_key(key);

        /*Go to manage team page*/
        this.props.actions.loadPage('/manageTeam');
    }

    render() {
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


        if (dataList == null || dataList.length == 0) {
            return (
                <div style={{margin:"10px", fontSize:"20px"}}>
                    No projects to display.
                </div>
            );
        } else {
            return (
                <div style={{margin:"10px"}}>
                    <Table
                        rowHeight={50}
                        rowsCount={dataList.length}
                        width={1500}
                        maxHeight={500}
                        headerHeight={50}>

                        <Column
                            header={<Cell style={{backgroundColor: '#484848', color:'#ffffff'}}> Project Name </Cell>}
                            cell={<TextCell data={dataList} col="project_name" />}
                            width={500}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Description </Cell>}
                            cell={<TextCell data={dataList} col="description" />}
                            width={500}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Action </Cell>}
                            cell={<TextCell data={dataList} col="manage_team" handleManageTeam={this.handleManageTeam.bind(this)} />}
                            width={500}
                        />

                    </Table>
                </div>
            );
        }
    }
}


const mapStateToProps = (state) => ({
    leftDrawer: state.scrums.leftDrawer,
    loggedInUserDetails: state.scrums.loggedInUserDetails,
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ManageProject);