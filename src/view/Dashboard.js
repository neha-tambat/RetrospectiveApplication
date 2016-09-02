/**
 * Created by nehat on 7/5/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel,Tooltip,Overlay,Popover, OverlayTrigger} from 'react-bootstrap';
import _ from 'lodash';
import * as scrumsActionCreator from '../actions/scrums/index';
import reactMixin from 'react-mixin';
import ReactFireMixin from 'reactfire';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import RetrospectiveList from './RetrospectiveList';

class Dashboard extends React.Component {

    constructor(){
        super();
        this.state = {
            selectedTab: 'myContribution',
            start: "", stop: "", continue: "",
            notes:[], retrospectives: [],
            matchedProjectIDKey: null,
            userInfoDisplay: false, userInfoForTitle: null, userInfoForIndex: null
        };
        this.myContributionClass = 'active';
        this.teamContributionClass = '';
    }

    componentWillMount(){

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

        var path = (this.state.selectedTab == 'myContribution') ?
        'retrospectives/'+ this.props.retrospectiveKey_selected + '/notes/' + this.props.loggedInUserDetails['.key'] :
        'retrospectives/'+ this.props.retrospectiveKey_selected + '/notes/public';

        /*Notes of my contribution or team contribution*/
        this.firebaseRef = firebase.database().ref(path);
        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            var notes = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var note = childSnapshot.val();
                note['.key'] = childSnapshot.key;
                notes.push(note);
            }.bind(this));

            this.setState({
                notes: notes
            });
        }.bind(this));
    }

    onTabSelect(tabId){
        this.setState({selectedTab:tabId});
        this.myContributionClass = "";
        this.teamContributionClass = "";
        if(tabId == 'myContribution'){
            this.myContributionClass = "active";
            this.teamContributionClass = "";
            this.addNotesToDatabase();
        }else{
            this.myContributionClass = "";
            this.teamContributionClass = "active";
            var path = 'retrospectives/'+ this.props.retrospectiveKey_selected + '/notes/public/';

            /*Notes of team contribution*/
            var firebaseRef = firebase.database().ref(path);
            firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
                var notes = [];
                dataSnapshot.forEach(function(childSnapshot) {
                    var note = childSnapshot.val();
                    note['.key'] = childSnapshot.key;
                    notes.push(note);
                }.bind(this));

                this.setState({
                    notes: notes
                });
            }.bind(this));
        }
    }

    addNote(event){
        var note = event.target.value;
            if(event.target.id == "start"){
                this.setState({start : note});
            }else if(event.target.id == "stop"){
                this.setState({stop : note});
            }else if(event.target.id == "continue"){
                this.setState({continue : note});
            }
    }

    addNotesToDatabase(){
        this.firebaseRef1 = firebase.database().ref('retrospectives/'+ this.props.retrospectiveKey_selected + '/notes/' + this.props.loggedInUserDetails['.key']);
        this.firebaseRef1.limitToLast(25).on('value', function(dataSnapshot) {
            var notes = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var note = childSnapshot.val();
                note['.key'] = childSnapshot.key;
                notes.push(note);
            }.bind(this));

            this.setState({
                notes: notes
            });
        }.bind(this));
    }

    addNotesToDatabase_publish(type, data){
        var path = 'retrospectives/'+ this.props.retrospectiveKey_selected + '/notes/public/' + type;

        var firebaseRef = firebase.database().ref(path);
        firebaseRef.push(data);
    }

    onPublish(event){
        event.preventDefault();
        let  continueObject_save, startObject_save, stopObject_save;

        if(this.state.start != "" ) {
            startObject_save = {note : this.state.start, username: this.props.loggedInUserDetails.full_name};
            this.addNotesToDatabase_publish('start', startObject_save);
            //this.firebaseRef1.push(startObject_save);
        }
        if(this.state.stop != ""){
            stopObject_save = {note : this.state.stop, username: this.props.loggedInUserDetails.full_name};
            this.addNotesToDatabase_publish('stop', stopObject_save);
            //this.firebaseRef1.push(stopObject_save);
        }
        if(this.state.continue != ""){
            continueObject_save = {note : this.state.continue, username: this.props.loggedInUserDetails.full_name};
            this.addNotesToDatabase_publish('continue', continueObject_save);
            //this.firebaseRef1.push(continueObject_save);
        }

        //this.addNotesToDatabase_publish();
        //this.firebaseRef1.push();

        this.setState({
            start: "",
            stop: "",
            continue: ""
        });
    }

    onSave(event){
        event.preventDefault();
        let  continueObject, startObject, stopObject;

        if(this.state.start != "" ) {
            startObject = {note : this.state.start, username: this.props.loggedInUserDetails.full_name};
        }
        if(this.state.stop != ""){
            stopObject = {note : this.state.stop, username: this.props.loggedInUserDetails.full_name};
        }
        if(this.state.continue != ""){
            continueObject = {note : this.state.continue, username: this.props.loggedInUserDetails.full_name};
        }

        if(startObject == undefined){
            if(stopObject == undefined){
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    continueNotes:continueObject,
                    isPublished: false
                });
            }else if(continueObject == undefined){
               this.addNotesToDatabase();
                this.firebaseRef1.push({
                    stopNotes: stopObject,
                    isPublished: false
                });
            }else {
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    stopNotes: stopObject,
                    continueNotes:continueObject,
                    isPublished: false
                });
            }
        }else if(stopObject == undefined){
            if(startObject == undefined){
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    continueNotes:continueObject,
                    isPublished: false
                });
            }else if(continueObject == undefined){
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    startNotes:startObject,
                    isPublished: false
                });
            }else {
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    startNotes:startObject,
                    continueNotes:continueObject,
                    isPublished: false
                });
            }
        }else if(continueObject == undefined){
            if(startObject == undefined){
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    stopNotes: stopObject,
                    isPublished: false
                });
            }else if(stopObject == undefined){
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    startNotes:startObject,
                    isPublished: false
                });
            }else {
                this.addNotesToDatabase();
                this.firebaseRef1.push({
                    startNotes:startObject,
                    stopNotes: stopObject,
                    isPublished: false
                });
            }
        }else {
            this.addNotesToDatabase();
            this.firebaseRef1.push({
                startNotes:startObject,
                stopNotes: stopObject,
                continueNotes:continueObject,
                isPublished: false
            });
        }

        this.setState({
            start: "",
            stop: "",
            continue: ""
        });
    }

    onDeleteNote(event){
        var deleteNodeCategory = event.target.title;
        var dataToDelete = event.target.parentNode.innerText;
        var key = event.target.accessKey;
        var index = event.target.id;

        this.firebaseRef.child(key + "/" + deleteNodeCategory + "Notes").remove();
        //this.firebaseRef.child(key).remove();
    }

    setUserInfoDisplay(event){
        var title = event.target.title;
        var index = event.target.id;
        this.setState({userInfoDisplay: true, userInfoForTitle: title, userInfoForIndex: index});
    }


    render(){
        var {retrospectiveKey_selected, loggedInUserDetails} = this.props;
        var {retrospectives} = this.state;

        for(var k=0; k < retrospectives.length; k++){
            if(retrospectives[k]['.key'] == retrospectiveKey_selected){
                var selectedRetroStatus = retrospectives[k].is_completed;
            }
        }

        if(this.state.notes.length != 0 ){
            if(this.state.selectedTab == 'teamContribution'){
                var startData_public = [];
                var stopData_public = [];
                var continueData_public = [];
                for(var index=0; index < this.state.notes.length; index++){

                    if(this.state.notes[index]['.key'] == "start"){
                        var startData = this.state.notes[index];
                        for (var key in startData){
                            if (startData[key] != "start") {
                                startData[key].key = key;
                                startData_public.push(startData[key]);
                            }
                        }
                    }

                    if(this.state.notes[index]['.key'] == "continue"){
                        var continueData = this.state.notes[index];
                        for (var key in continueData){
                            if (continueData[key] != "continue") {
                                continueData[key].key = key;
                                continueData_public.push(continueData[key]);
                            }
                        }
                    }

                    if(this.state.notes[index]['.key'] == "stop"){
                        var stopData = this.state.notes[index];
                        for (var key in stopData){
                            if (stopData[key] != "stop") {
                                stopData[key].key = key;
                                stopData_public.push(stopData[key]);
                            }
                        }
                    }
                }

                var startData = startData_public.map((public_startData, index, key) => {
                    var type = "start";
                    var overlayShowStatus = false;
                    overlayShowStatus = (this.state.userInfoForTitle == type && this.state.userInfoForIndex == index);

                    return (
                        <Row style={{margin:"10px",backgroundColor:"#72B53E",padding:"10px"}} id={type} key={index}>
                            <Col xs={10} md={10} className="notes"> {public_startData.note} </Col>
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                            overlay={
                                                <Popover id="popover-trigger-hover-focus">
                                                    {public_startData.username}
                                                </Popover>
                                            }
                            >
                                <Col xs={1} md={1} style={{cursor:"pointer"}}
                                     id={index} accesskey={public_startData.key} name={public_startData.username}
                                     onClick={this.setUserInfoDisplay.bind(this)}>
                                    <span className="glyphicon glyphicon-info-sign" />
                                </Col>
                            </OverlayTrigger>
                            {
                                (selectedRetroStatus) ? null :
                                    <Col xs={1} md={1} className="glyphicon glyphicon-trash" title={type} style={{cursor:"pointer"}}
                                        id={index} accessKey={public_startData.key} onClick={this.onDeleteNote.bind(this)}> </Col>
                            }

                        </Row>
                    );
                });

                var stopData = stopData_public.map((public_stopData, index, key) => {
                    var type = "stop";
                    var overlayShowStatus = false;
                    overlayShowStatus = (this.state.userInfoForTitle == type && this.state.userInfoForIndex == index);
                    return (
                        <Row style={{margin:"10px",backgroundColor:"#F36576",padding:"10px"}} id={type} key={index}>
                            <Col xs={10} md={10} className="notes"> {public_stopData.note} </Col>
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                            overlay={
                                                <Popover id="popover-trigger-hover-focus">
                                                    {public_stopData.username}
                                                </Popover>
                                            }
                            >
                                <Col xs={1} md={1} style={{cursor:"pointer"}}
                                     id={index} accesskey={public_stopData.key} name={public_stopData.username}
                                     onClick={this.setUserInfoDisplay.bind(this)}>
                                        <span className="glyphicon glyphicon-info-sign" />
                                </Col>
                            </OverlayTrigger>
                            {
                                (selectedRetroStatus) ? null :
                                    <Col xs={1} md={1} className="glyphicon glyphicon-trash" title={type} style={{cursor:"pointer"}}
                                         id={index} accessKey={public_stopData.key} onClick={this.onDeleteNote.bind(this)}> </Col>
                            }

                        </Row>
                    );
                });

                var continueData = continueData_public.map((public_continueData, index, key) => {
                    var type = "continue";
                    var overlayShowStatus = false;
                    overlayShowStatus = (this.state.userInfoForTitle == type && this.state.userInfoForIndex == index);
                    return (
                        <Row style={{margin:"10px",backgroundColor:"#6593F1",padding:"10px"}} id={type} key={index}>
                            <Col xs={10} md={10} className="notes"> {public_continueData.note} </Col>
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                            overlay={
                                                <Popover id="popover-trigger-hover-focus">
                                                    {public_continueData.username}
                                                </Popover>
                                            }
                            >
                            <Col xs={1} md={1} style={{cursor:"pointer"}}
                                 id={index} accesskey={public_continueData.key} name={public_continueData.username}
                                 onClick={this.setUserInfoDisplay.bind(this)}>
                                    <span className="glyphicon glyphicon-info-sign" />
                            </Col>
                            </OverlayTrigger>
                            {
                                (selectedRetroStatus) ? null :
                                    <Col xs={1} md={1} className="glyphicon glyphicon-trash" title={type} style={{cursor:"pointer"}}
                                         id={index} accessKey={public_continueData.key} onClick={this.onDeleteNote.bind(this)}> </Col>
                            }

                        </Row>
                    );
                });

            }else{
                var startData = this.state.notes.map((data,index,key) => {
                    if(data.startNotes != undefined){
                        if(data.startNotes.note == "NA"){
                            return(
                                undefined
                            );
                        }
                        return (
                            <Row style={{margin:"10px",backgroundColor:"#72B53E",padding:"10px"}} id="start" key={index}>
                                <Col xs={10} md={10} className="notes"> {data.startNotes.note} </Col>
                                {
                                    (selectedRetroStatus) ? null :
                                        <Col xs={2} md={2} className="glyphicon glyphicon-trash" title="start" style={{cursor:"pointer"}}
                                             id={index} accessKey={data['.key']} onClick={this.onDeleteNote.bind(this)}> </Col>
                                }

                            </Row>
                        );
                    }
                });

                var stopData = this.state.notes.map((data,index,key) => {
                    if(data.stopNotes != undefined){
                        if(data.stopNotes.note == "NA"){
                            return(
                                undefined
                            );
                        }
                        return (
                            <Row style={{margin:"10px",backgroundColor:"#F36576",padding:"10px"}} id="stop" key={index}>
                                <Col xs={10} md={10} className="notes"> {data.stopNotes.note} </Col>
                                {
                                    (selectedRetroStatus) ? null :
                                        <Col xs={2} md={2} className="glyphicon glyphicon-trash" title="stop" style={{cursor:"pointer"}}
                                             id={index} accessKey={data['.key']} onClick={this.onDeleteNote.bind(this)}> </Col>
                                }

                            </Row>
                        );
                    }
                });

                var continueData = this.state.notes.map((data,index,key) => {
                    if(data.continueNotes != undefined){
                        if(data.continueNotes.note == "NA"){
                            return(
                                undefined
                            );
                        }
                        return (
                            <Row style={{margin:"10px",backgroundColor:"#6593F1",padding:"10px"}} id="continue" key={index}>
                                <Col xs={10} md={10} className="notes"> {data.continueNotes.note} </Col>
                                {
                                    (selectedRetroStatus) ? null :
                                        <Col xs={2} md={2} className="glyphicon glyphicon-trash" title="continue" style={{cursor:"pointer"}}
                                             id={index} accessKey={data['.key']} onClick={this.onDeleteNote.bind(this)}> </Col>
                                }

                            </Row>
                        );
                    }
                });
            }
        }

        var StartInputBox = (this.state.selectedTab == 'teamContribution') ? null :
            (
                <Row>
                    <Col xs={1} md={1}>
                        <span className="glyphicon glyphicon-pencil" style={{fontSize:"20px"}}> </span>
                    </Col>
                    <Col xs={11} md={11}>
                        <FormControl type="text" id="start"
                                     placeholder="Create a note"
                                     value={this.state.start}
                                     onChange={this.addNote.bind(this)}
                                     style={{border: "transparent", borderBottom:"3px solid black" ,backgroundColor:"#E6E6E6"}} />
                    </Col>
                </Row>
            );

        var StopInputBox = (this.state.selectedTab == 'teamContribution') ? null :
            (
                <Row>
                    <Col xs={1} md={1}>
                        <span className="glyphicon glyphicon-pencil" style={{fontSize:"20px"}}> </span>
                    </Col>
                    <Col xs={11} md={11}>
                        <FormControl type="text" id="stop"
                                     placeholder="Create a note"
                                     value={this.state.stop}
                                     onChange={this.addNote.bind(this)}
                                     style={{border: "transparent", borderBottom:"3px solid black" ,backgroundColor:"#E6E6E6"}} />
                    </Col>
                </Row>
            );

        var ContinueInputBox = (this.state.selectedTab == 'teamContribution') ? null :
            (
                <Row>
                    <Col xs={1} md={1}>
                        <span className="glyphicon glyphicon-pencil" style={{fontSize:"20px"}}> </span>
                    </Col>
                    <Col xs={11} md={11}>
                        <FormControl type="text" id="continue"
                                     placeholder="Create a note"
                                     value={this.state.continue}
                                     onChange={this.addNote.bind(this)}
                                     style={{border: "transparent", borderBottom:"3px solid black" ,backgroundColor:"#E6E6E6"}} />
                    </Col>
                </Row>
            );



        if(selectedRetroStatus){
            var Buttons = <Row style={{margin:"20px"}}>
                    <span style={{fontSize:"20px"}}> Retrospective completed... ! </span>
                </Row>
        }else {
            var Buttons = (this.state.selectedTab == 'teamContribution') ?
                <Row style={{margin:"20px"}}>
                    <Col xs={3} md={3}> </Col>
                    <Col xs={6} md={6}>
                        <Button type="submit" className="button"> Retrospective Scheduled </Button>
                    </Col>
                </Row>
                :
                (
                    <Row style={{margin:"20px"}}>
                        <Col xs={3} md={3}> </Col>
                        <Col xs={6} md={6}>
                            <Button type="submit" className="button" id="save"
                                    onClick={this.onSave.bind(this)} style={{margin:"10px"}}> Save </Button>
                            <Button type="submit" className="button" id="publish"
                                    onClick={this.onPublish.bind(this)} style={{margin:"10px"}}> Publish </Button>
                        </Col>
                    </Row>
                );
        }

        return(
            <div style={{textAlign: "center"}}>

                <Row style={{cursor:'pointer', textAlign: "center", margin:'10px'}}>
                    <ul className="nav nav-tabs nav-justified">
                        <li className={this.myContributionClass} style={{ backgroundColor:(this.myContributionClass == "active")? "#000000" : "#6A6A6A"}}>
                            <div onClick={this.onTabSelect.bind(this,'myContribution')} style={{fontSize:16 ,margin:15}}>
                                <a data toggle="tab" style={{color:"white"}}>
                                    <b> My Contribution </b>
                                </a>
                            </div>
                        </li>
                        <li className={this.teamContributionClass} style={{ backgroundColor:(this.teamContributionClass == "active")? "#000000" : "#6A6A6A"}}>
                            <div onClick={this.onTabSelect.bind(this,'teamContribution')} style={{fontSize:16 ,margin:15}}>
                                <a data toggle="tab" style={{color:"white"}}>
                                    <b> Team Contribution </b>
                                </a>
                            </div>
                        </li>
                    </ul>
                </Row>

                <Row style={{marginTop:"20px"}}>
                    <Col xs={4} md={4}>
                        <Row>
                            <ControlLabel style={{color:"#72B53E"}}> <h3> Start </h3> </ControlLabel>
                        </Row>
                        {StartInputBox}
                    </Col>
                    <Col xs={4} md={4}>
                        <Row>
                            <ControlLabel style={{color:"#F36576"}}> <h3> Stop </h3> </ControlLabel>
                        </Row>
                        {StopInputBox}
                    </Col>
                    <Col xs={4} md={4}>
                        <Row>
                            <ControlLabel style={{color:"#6593F1"}}> <h3> Continue </h3> </ControlLabel>
                        </Row>
                        {ContinueInputBox}
                    </Col>
                </Row>


                <Row style={{marginTop:"20px"}}>
                    <Col xs={4} md={4}>
                        {startData}
                    </Col>
                    <Col xs={4} md={4}>
                        {stopData}
                    </Col>
                    <Col xs={4} md={4}>
                        {continueData}
                    </Col>
                </Row>


                {Buttons}

            </div>

        );
    }
}

reactMixin(Dashboard.prototype,ReactFireMixin);

//export default Dashboard;

const mapStateToProps = (state) => ({
    retrospectiveKey_selected: state.scrums.retrospectiveKey_selected,
    loggedInUserDetails: state.scrums.loggedInUserDetails,
    selected_project_id: state.scrums.selected_project_id
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect (mapStateToProps, mapDispatchToProps) (Dashboard);

