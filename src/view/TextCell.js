/**
 * Created by nehat on 8/5/2016.
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
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
//var FixedDataTable = require('fixed-data-table');
import {Table, Column, Cell, ColumnGroup} from 'fixed-data-table';
//const {Table, Column, Cell, ColumnGroup} = FixedDataTable;


class TextCell extends React.Component {

    constructor() {
        super();
        this.state = {

        };
    }

    handleView(event){
        var key = event.target.id;
        this.props.handleView(key);
    }
    handleEdit(event){
        var key = event.target.id;
        this.props.handleEdit(key);
    }
    handle_Remove(event){
        var key = event.target.id;
        this.props.handle_Remove(key);
    }
    handleManageTeam(key){
        this.props.handleManageTeam(key);
    }
    handleMore(retroId){
        this.props.handleMore(retroId);
    }

    select_Row(event){
        var data = {
            select_Row: event.currentTarget.id,
            selectedRow_rowIndex: event.currentTarget.accessKey
        };
        this.props.handleSelect(data);
    }

    render() {
        const {rowIndex, col, data, columnKey,selectRow,project_data, ...props} = this.props;

        var id = data[rowIndex]['.key'];
        if(selectRow == id){
            var background = "#337ab7";
        }

        if(data == null || data.length == 0 || rowIndex > data.length){
            return(
                null
            );
        }

        if(col == "more"){
            return(
                <Cell {...props}>
                    <Button id={id} className="button" onClick={this.handleMore.bind(this,id)}> More </Button>
                </Cell>
            );
        }
        if(col == "manage_team"){
            if(this.props.loggedInUserDetails['.key'] == data[rowIndex].owner){
                return(
                    <Cell {...props} style={{backgroundColor:background}}>
                        <Button id={id} className="button" onClick={this.handleManageTeam.bind(this,id)}> Manage Team </Button>
                    </Cell>
                );
            }else {
                return(
                    <Cell {...props} id={id} style={{backgroundColor:background}}> - </Cell>
                );
            }
        }

        if(col == "remove"){
            return(
                <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center',padding:"15px"}}
                      className="glyphicon glyphicon-remove-circle center-block" onClick={this.handle_Remove.bind(this)}> </Cell>
            );
        }
        if(col == "edit"){
            return(
                <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center',padding:"15px"}}
                      className="glyphicon glyphicon-pencil center-block" onClick={this.handleEdit.bind(this)}> </Cell>
            );
        }
        if(col == "view"){
            return(
                <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center',padding:"15px"}}
                      className="glyphicon glyphicon-eye-open center-block" onClick={this.handleView.bind(this)}> </Cell>
            );
        }
        if(col == "projectName"){
            for(var k=0; k < project_data.length; k++){
                if(data[rowIndex].project_id == project_data[k]['.key']){
                    var projectName = project_data[k].project_name;
                }
            }
            return(
                <Cell {...props} id={project_data[rowIndex]['.key']} >
                    {projectName}
                </Cell>
            );
        }

        return(
            <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center',backgroundColor:background}} accessKey={rowIndex} onClick={this.select_Row.bind(this)}>
                {data[rowIndex][col]}
            </Cell>
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

export default connect(mapStateToProps,mapDispatchToProps)(TextCell);