/**
 * Created by nehat on 7/4/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Navbar, Nav,NavItem,Input,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import moment from 'moment';
import * as scrumsActionCreator from '../actions/scrums/index';
import DateTimePickerDate from "react-bootstrap-datetimepicker";
import DateTimePickerTime from 'react-bootstrap-datetimepicker';

class RegisterFormLeftPanel extends React.Component {

    constructor(){
        super();
        this.state = {
            scrumMasterName : null,
            projectName : null,
            sprintTitle : null,
            startDate : null,
            endDate : null,
            retrospectiveTime : null
        };
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
        console.log("User Input : " , this.state);
    }

    render(){
        return(
            <form style={{margin:"10px"}}>
                <ControlLabel style={{fontSize:"25px"}}> Register </ControlLabel>
                <FormGroup controlId="formControlsScrumMasterName">
                    <FormControl type="text" placeholder="Scrum Master Name" onChange={this.scrumMasterNameChange.bind(this)}/>
                </FormGroup>
                <FormGroup controlId="formControlsProjectName">
                    <FormControl componentClass="select" placeholder="Project Name" onChange={this.projectNameChange.bind(this)}>
                        <option value="select">Project Name</option>
                        <option value="peopleadmin">PeopleAdmin</option>
                        <option value="fuelquest">FuelQuest</option>
                        <option value="qsi">QSI</option>
                        <option value="chartspan">ChartSpan</option>
                        <option value="stepone">StepOne</option>
                    </FormControl>
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
        );
    }
}


//export default RegisterFormLeftPanel;


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect (mapStateToProps, mapDispatchToProps) (RegisterFormLeftPanel);
