/**
 * Created by nehat on 7/5/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
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
            name : "",
            start: "", stop: "", continue: "",
            notes:[], retrospectives: [],
            matchedProjectIDKey: null
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

    nameChange(event){
        this.setState({name: event.target.value});
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

    addNotesToDatabase(matchedProjectIDKey){
        var firebaseRef = firebase.database().ref('retrospectives/' + matchedProjectIDKey + '/notes');
        //this.bindAsArray(firebaseRef.limitToLast(25), 'retrospectives/notes');

        this.firebaseRef = firebase.database().ref('retrospectives/' + matchedProjectIDKey + '/notes');

        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            console.log("Tree for notes : ", 'retrospectives/' + matchedProjectIDKey + '/notes');
            var notes = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var note = childSnapshot.val();
                note['.key'] = childSnapshot.key;
                notes.push(note);
            }.bind(this));

            console.log("notes : ", notes);

            this.setState({
                notes: notes
            });
        }.bind(this));
    }

    onSubmit(event){
        event.preventDefault();
        let  continueObject, startObject, stopObject;
        var selected_project_id = this.props.selected_project_id;

        for(var index=0; index <= this.state.retrospectives.length; index++){
            if(this.state.retrospectives[index].project_id == selected_project_id){
                var matchedProjectIDKey = this.state.retrospectives[index]['.key'];
                break;
            }
        }
        console.log("matchedProjectIDKey : ", matchedProjectIDKey);

        if(this.state.start != "" ) {
            startObject = {note : this.state.start, username: "neha"};
        }
        if(this.state.stop != ""){
            stopObject = {note : this.state.stop, username: "neha"};
        }
        if(this.state.continue != ""){
            continueObject = {note : this.state.continue, username: "neha"};
        }

        if(startObject == undefined){
            if(stopObject == undefined){
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    continueNotes:continueObject
                });
            }else if(continueObject == undefined){
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    stopNotes: stopObject
                });
            }else {
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    stopNotes: stopObject,
                    continueNotes:continueObject
                });
            }
        }else if(stopObject == undefined){
            if(startObject == undefined){
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    continueNotes:continueObject
                });
            }else if(continueObject == undefined){
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    startNotes:startObject
                });
            }else {
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    startNotes:startObject,
                    continueNotes:continueObject
                });
            }
        }else if(continueObject == undefined){
            if(startObject == undefined){
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    stopNotes: stopObject
                });
            }else if(stopObject == undefined){
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    startNotes:startObject
                });
            }else {
                this.addNotesToDatabase(matchedProjectIDKey);
                this.firebaseRef.push({
                    startNotes:startObject,
                    stopNotes: stopObject
                });
            }
        }else {
            this.addNotesToDatabase(matchedProjectIDKey);
            this.firebaseRef.push({
                startNotes:startObject,
                stopNotes: stopObject,
                continueNotes:continueObject
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

    render(){

        if(this.state.notes.length != 0 ){
            var startData = this.state.notes.map((data,index,key) => {
                if(data.startNotes != undefined){
                    if(data.startNotes.note == "NA"){
                        return(
                            undefined
                        );
                    }
                    return (
                        <Row style={{margin:"10px",backgroundColor:"#72B53E",padding:"10px"}} id="start" key={index}>
                            <Col xs={10} md={10}> {data.startNotes.note} </Col>
                            <Col xs={2} md={2} className="glyphicon glyphicon-trash" title="start" style={{cursor:"pointer"}}
                                 id={index} accessKey={data['.key']} onClick={this.onDeleteNote.bind(this)}> </Col>
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
                            <Col xs={10} md={10}> {data.stopNotes.note} </Col>
                            <Col xs={2} md={2} className="glyphicon glyphicon-trash" title="stop" style={{cursor:"pointer"}}
                                 id={index} accessKey={data['.key']} onClick={this.onDeleteNote.bind(this)}> </Col>
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
                            <Col xs={10} md={10}> {data.continueNotes.note} </Col>
                            <Col xs={2} md={2} className="glyphicon glyphicon-trash" title="continue"
                                 style={{cursor:"pointer"}}
                                 id={index} accessKey={data['.key']} onClick={this.onDeleteNote.bind(this)}> </Col>
                        </Row>
                    );
                }
            });
        }

        return(
            <Grid style={{textAlign: "center"}}>

                <Row style={{marginTop:"20px"}}>
                    <Col xs={4} md={4}> </Col>
                    <Col xs={4} md={4}>
                        <h3> Welcome to your team room! </h3>
                    </Col>
                </Row>
                <Row style={{marginTop:"20px"}}>
                    <Col xs={4} md={4}> </Col>
                    <Col xs={4} md={4}>
                        <FormControl type="text" placeholder="Please enter your name" onChange={this.nameChange.bind(this)} />
                    </Col>
                </Row>

                <Row style={{marginTop:"20px"}}>
                    <Col xs={4} md={4}>
                        <Row>
                            <ControlLabel style={{color:"#72B53E"}}> <h3> Start </h3> </ControlLabel>
                        </Row>
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
                    </Col>
                    <Col xs={4} md={4}>
                        <Row>
                            <ControlLabel style={{color:"#F36576"}}> <h3> Stop </h3> </ControlLabel>
                        </Row>
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
                    </Col>
                    <Col xs={4} md={4}>
                        <Row>
                            <ControlLabel style={{color:"#6593F1"}}> <h3> Continue </h3> </ControlLabel>
                        </Row>
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


                <Row style={{margin:"20px"}}>
                    <Col xs={4} md={4}> </Col>
                    <Col xs={4} md={4}>
                        <Button type="submit" style={{backgroundColor:"#484848", width:"150px"}} onClick={this.onSubmit.bind(this)} >
                            <span style={{color:"white", fontSize:"18px"}}> <strong>Submit</strong> </span>
                        </Button>
                    </Col>
                </Row>

            </Grid>

        );
    }
}

reactMixin(Dashboard.prototype,ReactFireMixin);

//export default Dashboard;

const mapStateToProps = (state) => ({
    selected_project_id: state.scrums.selected_project_id
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect (mapStateToProps, mapDispatchToProps) (Dashboard);

