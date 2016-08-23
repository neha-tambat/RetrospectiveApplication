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
            retrospectives: []
        };
    }

    componentWillMount(){
        var firebaseRef = firebase.database().ref('retrospectives');
        //this.bindAsArray(firebaseRef.limitToLast(25), 'retrospectives/notes');

        this.firebaseRef = firebase.database().ref('retrospectives');

        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            console.log("Tree for notes : ", 'retrospectives');
            var retrospectives = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var retrospective = childSnapshot.val();
                retrospective['.key'] = childSnapshot.key;
                retrospectives.push(retrospective);
            }.bind(this));

            console.log("retrospectives : ", retrospectives);

            this.setState({
                retrospectives: retrospectives
            });
        }.bind(this));
    }

    handleMore(event){
        console.log("event", event);
    }

    render(){
        var {selected_project_id,selected_project_name,projectKeyForManageTeam} = this.props;
        var {retrospectives} = this.state;
        var dataList = [];
        if(retrospectives.length != 0){
            for(var index=0; index < retrospectives.length; index++){
                if(retrospectives[index].project_id == projectKeyForManageTeam){
                    dataList.push(retrospectives[index]);
                }
            }
        }

        var selectRowProp = {
            mode: "checkbox",  //checkbox for multi select, radio for single select.
            clickToSelect: true,   //click row will trigger a selection on that row.
            bgColor: "rgb(200, 150, 150)"   //selected row background color
        };

        function more_button(cell, row){
            return '<Button type="submit" onClick={this.handleMore.bind(this)}> More </Button>';
        }

        return(
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
                        <TableHeaderColumn dataField="sprint_end_date"
                                           isKey={true}
                                           dataAlign="center"
                                           dataSort={true}
                                           className="table-header">Sprint End Date</TableHeaderColumn>
                        <TableHeaderColumn dataField="retrospective_time"
                                           dataAlign="center"
                                           dataSort={true}
                                           className="table-header">Retrospective Date</TableHeaderColumn>
                        <TableHeaderColumn dataField="button"
                                           dataFormat={more_button}
                                           dataAlign="center"
                                           className="table-header">More</TableHeaderColumn>
                    </BootstrapTable>
                </Row>
            </Grid>
        );
    }
}


const mapStateToProps = (state) => ({
    projectKeyForManageTeam: state.scrums.projectKeyForManageTeam,
    retrospectiveKey_selected: state.scrums.retrospectiveKey_selected,
    selected_project_id: state.scrums.selected_project_id,
    selected_project_name: state.scrums.selected_project_name
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(PastRetrospectives);