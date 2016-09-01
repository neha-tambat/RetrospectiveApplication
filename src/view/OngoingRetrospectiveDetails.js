/**
 * Created by nehat on 7/19/2016.
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
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import WarningModalBox from '../components/WarningModalBox';
import TextCell from './TextCell';
var FixedDataTable = require('fixed-data-table');
const {Table, Column, Cell, ColumnGroup} = FixedDataTable;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {getScreenMode} from '../utils/index';

class OngoingRetrospectiveDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            warningShow: false,
            WaringHeaderMsg : 'Warning',
            modalBody_warning: 'Select project first and proceed.',
            retrospectives: [], userSpecificRetrospectives:[], projects: []
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
            //console.log("Tree for notes : ", 'retrospectives');
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

    handleView(key){
        this.props.actions.RetrospectiveKey_selected(key);
        this.props.actions.loadPage('/dashboard');
    }

    render(){
        var {selected_project_id,selected_project_name} = this.props;
        var {retrospectives,userSpecificRetrospectives, projects} = this.state;
        var screenSize = getScreenMode();
        var dataList = [];

        if (retrospectives.length != 0 && userSpecificRetrospectives.length != 0) {
            for(var index = 0; index < userSpecificRetrospectives.length; index++){
                for(var place=0; place < retrospectives.length; place++){
                    if(userSpecificRetrospectives[index]['.key'] == retrospectives[place]['.key']
                        && retrospectives[place].is_completed == false)
                    {
                        /*Only ongoing user specific retrospectives*/
                        dataList.push(retrospectives[place]);
                    }
                }
            }
        }

        if(dataList.length == 0){
            return(
                <div style={{margin:"10px", fontSize:"20px"}}>
                    No ongoing retrospectives to display.
                </div>
            );
        }else {
            return(
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
                            cell={<TextCell data={dataList} col="view" handleView={this.handleView.bind(this)} />}
                            width={300}
                        />

                    </Table>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    windowWidth: state.scrums.windowWidth,
    windowHeight: state.scrums.windowHeight,
    loggedInUserDetails: state.scrums.loggedInUserDetails,
    selected_project_id: state.scrums.selected_project_id,
    selected_project_name: state.scrums.selected_project_name
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(OngoingRetrospectiveDetails);
