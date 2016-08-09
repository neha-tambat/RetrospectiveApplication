/**
 * Created by nehat on 8/5/2016.
 */

var React = require('react');
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

class ManageProject extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: []
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

    handleView(key){

    }
    handleEdit(key){

    }
    handleDelete(key){

    }

    render() {
        var dataList = null;
        console.log("this.state.projects : ", this.state.projects);
        if(this.state.projects.length != 0){
            dataList = this.state.projects;
        }

        return (
            <div style={{textAlign:'center', margin:'20px'}}>
                <Table
                    rowHeight={50}
                    rowsCount={dataList == null ? 0 : dataList.length}
                    width={900}
                    maxHeight={500}
                    headerHeight={50}
                    {...this.props}>

                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> Project Name </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="project_name" />}
                        width={300}
                        fixed={true}
                    />
                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> Scrum Master Name </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="owner" />}
                        width={300}
                        fixed={true}
                    />
                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> View </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="view" handleView={this.handleView.bind(this)} />}
                        width={100}
                        fixed={true}
                    />
                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> Edit </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="edit" handleEdit={this.handleEdit.bind(this)} />}
                        width={100}
                        fixed={true}
                    />
                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> Delete </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="delete" handleDelete={this.handleDelete.bind(this)} />}
                        width={100}
                        fixed={true}
                    />
                </Table>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(ManageProject);