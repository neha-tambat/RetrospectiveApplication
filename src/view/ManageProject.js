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

    manageTeam(key){
        this.props.manageTeam();
        //this.props.actions.loadPage('/manageTeam');
    }
    remove(){

    }

    render() {
        var dataList = null;
        console.log("this.state.projects : ", this.state.projects);
        if(this.state.projects.length != 0){
            dataList = this.state.projects;
        }

        var selectRowProp = {
            mode: "checkbox",  //checkbox for multi select, radio for single select.
            clickToSelect: true,   //click row will trigger a selection on that row.
            bgColor: "rgb(200, 150, 150)"   //selected row background color
        };

        function manage_team(cell, row){
            return '<Button type="submit" onClick={this.manageTeam.bind(this)}> Manage Team </Button>';
        }

        function action(cell, row){
            return '<Button type="submit" onClick={this.remove.bind(this)}> Remove </Button>';
        }

        return (
            <Grid>
                <Row className="project-table">
                <BootstrapTable
                    data={dataList}
                    striped={true}
                    hover={true}
                    condensed={true}
                    pagination={true}
                    selectRow={selectRowProp}
                    insertRow={true}
                    deleteRow={true}
                    columnFilter={true}
                    search={true}>
                    <TableHeaderColumn dataField="project_name"
                                       isKey={true}
                                       dataAlign="center"
                                       dataSort={true}
                                       className="table-header">Project Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="description"
                                       dataAlign="center"
                                       dataSort={true}
                                       className="table-header">Description</TableHeaderColumn>
                    <TableHeaderColumn dataField="button"
                                       dataFormat={manage_team}
                                       dataAlign="center"
                                       className="table-header">Manage Team</TableHeaderColumn>
                    <TableHeaderColumn dataField="button"
                                       dataFormat={action}
                                       dataAlign="center"
                                       className="table-header">Action</TableHeaderColumn>
                </BootstrapTable>
                </Row>
            </Grid>
        );
    }
}


const mapStateToProps = (state) => ({
    leftDrawer: state.scrums.leftDrawer
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ManageProject);