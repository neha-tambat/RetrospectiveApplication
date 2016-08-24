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
            projects:[]
        };
    }

    componentWillMount() {
        var firebaseRef = firebase.database().ref('projects');
        this.firebaseRef = firebase.database().ref('projects');

        this.firebaseRef.limitToLast(25).on('value', function (dataSnapshot) {
            console.log("Tree for projects : ", 'projects');
            var projects = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var project = childSnapshot.val();
                project['.key'] = childSnapshot.key;
                projects.push(project);
            }.bind(this));

            console.log("projects : ", projects);

            this.setState({
                projects: projects
            });
        }.bind(this));
    }

    handleManageTeam(key){
        this.props.actions.ManageTeamForProject_key(key);
        this.props.actions.loadPage('/manageTeam');
    }

    render() {
        var dataList = null;
        if (this.state.projects.length != 0) {
            dataList = this.state.projects;
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
    leftDrawer: state.scrums.leftDrawer
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ManageProject);