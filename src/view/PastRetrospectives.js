/**
 * Created by nehat on 8/3/2016.
 */

import React from 'react';
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
//var FixedDataTable = require('fixed-data-table');
//const {Table, Column, Cell, ColumnGroup} = FixedDataTable;
import {Table, Column, Cell, ColumnGroup} from 'fixed-data-table';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class PastRetrospectives extends React.Component {
    constructor() {
        super();
        this.state = {
            retrospectives: [], projects: [], userSpecificRetrospectives: []
        };
    }

    componentWillMount(){
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

        /*All retrospectives*/
        this.firebaseRef = firebase.database().ref('retrospectives');
        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            console.log("Tree for notes : ", 'retrospectives');
            var retrospectives = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var retrospective = childSnapshot.val();
                retrospective['.key'] = childSnapshot.key;
                retrospectives.push(retrospective);
            }.bind(this));

            this.setState({
                retrospectives: retrospectives
            });
        }.bind(this));

        /*User specific retrospectives*/
        this.firebaseRef_userRetrospectives = firebase.database().ref('users/' + this.props.loggedInUserDetails['.key'] + '/retrospectives');
        this.firebaseRef_userRetrospectives.limitToLast(25).on('value', function (dataSnapshot) {
            var userSpecificRetrospectives = [];
            dataSnapshot.forEach(function (childSnapshot) {
                var user_retrospective = childSnapshot.val();
                user_retrospective['.key'] = childSnapshot.key;
                userSpecificRetrospectives.push(user_retrospective);
            }.bind(this));

            console.log("userSpecificRetrospectives : ", userSpecificRetrospectives);

            this.setState({
                userSpecificRetrospectives: userSpecificRetrospectives
            });
        }.bind(this));
    }

    handleMore(retroId){
        console.log("retroId", retroId);
        this.props.actions.RetrospectiveKey_selected(retroId);
        this.props.actions.loadPage('/dashboard');
    }

    render(){
        var {selected_project_id,selected_project_name,projectKeyForManageTeam} = this.props;
        var {retrospectives, projects, userSpecificRetrospectives} = this.state;
        var dataList = [];
        if(retrospectives.length != 0 && userSpecificRetrospectives.length != 0){
            for(var place=0; place < userSpecificRetrospectives.length; place++){
                for(var index=0; index < retrospectives.length; index++){
                    if(userSpecificRetrospectives[place]['.key'] == retrospectives[index]['.key']
                        && retrospectives[index].is_completed == true){
                        /*Only past user specific retrospectives*/
                        dataList.push(retrospectives[index]);
                    }
                }
            }
        }

        if(dataList.length == 0){
            return(
                <div style={{margin:"10px", fontSize:"20px"}}>
                    No past retrospectives to display.
                </div>
            );
        }else {
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
                            cell={<TextCell data={dataList} project_data={projects} col="projectName" />}
                            width={300}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848', color:'#ffffff'}}> Sprint End Date </Cell>}
                            cell={<TextCell data={dataList} col="sprint_end_date" />}
                            width={300}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Retrospective Date </Cell>}
                            cell={<TextCell data={dataList} col="retrospective_date" />}
                            width={300}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Retrospective Time </Cell>}
                            cell={<TextCell data={dataList} col="retrospective_time" />}
                            width={300}
                        />
                        <Column
                            header={<Cell style={{backgroundColor: '#484848',color:'#ffffff'}}> Action </Cell>}
                            cell={<TextCell data={dataList} col="more" handleMore={this.handleMore.bind(this)} />}
                            width={300}
                        />

                    </Table>
                </div>
            );
        }
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

export default connect(mapStateToProps,mapDispatchToProps)(PastRetrospectives);