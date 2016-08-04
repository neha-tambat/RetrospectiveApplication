/**
 * Created by nehat on 7/19/2016.
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

class CreateSprintRetrospective extends React.Component {

    constructor(){
        super();
        this.state = {
            retrospectives: [],
            scrumMasterName : null,
            projectName : null,
            sprintTitle : null,
            startDate : null,
            endDate : null,
            retrospectiveTime : null
        };
    }

    componentWillMount(){
        var firebaseRef = firebase.database().ref('retrospectives');
        //this.bindAsArray(firebaseRef.limitToLast(25), 'retrospectives');

        this.firebaseRef = firebase.database().ref('retrospectives');

        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
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

    scrumMasterNameChange(event){
        this.setState({scrumMasterName: event.target.value});
    }
    projectNameChange(event){
        this.setState({projectName: event.target.value});
    }
    sprintTitleChange(event){
        this.setState({sprintTitle: event.target.value});
    }
    startDateChange(newDate){
        var start_date = newDate.target.value;
        //    var start_date = new Date(new Number(newDate));
        this.setState({startDate: start_date});
    }
    endDateChange(newDate){
        var end_date = newDate.target.value;
        //    var end_date = new Date(newDate/1);
        this.setState({endDate: end_date});
    }
    retrospectiveTimeChange(newDate){
        var retrospectiveTime = newDate.target.value;
        //    var retrospectiveTime = new Date(newDate/1);
        this.setState({retrospectiveTime: retrospectiveTime});
    }

    registerScrum(){
        var retroRegister = {
            sprint_title: this.state.sprintTitle,
            sprint_start_date: this.state.startDate,
            sprint_end_date: this.state.endDate,
            retrospective_time: this.state.retrospectiveTime,
            project_id: this.state.selected_project_id
        };
        this.firebaseRef.push(retroRegister);
    }


    render(){
        return(
            <Grid style={{textAlign:"center", margin : "40px"}}>
                <Row style={{border:"2px solid black", width:"400px"}}>
                    <form style={{margin:"20px"}}>
                        <FormGroup controlId="formControlsScrumMasterName">
                            <FormControl type="text" placeholder="Scrum Master Name" onChange={this.scrumMasterNameChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsSprintTitle">
                            <FormControl type="text" placeholder="Sprint Title" onChange={this.sprintTitleChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsStartDate">
                            <FormControl type="date" placeholder="Start Date" onChange={this.startDateChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsEndDate">
                            <FormControl type="date" placeholder="End Date" onChange={this.endDateChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsRetrospectiveTime">
                            <FormControl type="time" placeholder="Retrospective Time" onChange={this.retrospectiveTimeChange.bind(this)}/>
                        </FormGroup>

                        <Button type="submit" style={{backgroundColor:"#FF0000", width:"150px"}} onClick={this.registerScrum.bind(this)} >
                            <span style={{color:"white", fontSize:"18px"}}> <strong>Create</strong> </span>
                        </Button>
                    </form>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    selected_project_id: state.scrums.selected_project_id
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(CreateSprintRetrospective);