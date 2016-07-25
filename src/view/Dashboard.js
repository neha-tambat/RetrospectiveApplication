/**
 * Created by nehat on 7/5/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import _ from 'lodash';
import reactMixin from 'react-mixin';
import ReactFireMixin from 'reactfire';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

class Dashboard extends React.Component {

    constructor(){
        super();
        this.state = {
            name : "",
            start: "", stop: "", continue: "",
            notes:[]
        };
    }

    componentWillMount(){
        var firebaseRef = firebase.database().ref('retrospective-application/notes');
        this.bindAsArray(firebaseRef.limitToLast(25), 'notes');

        this.firebaseRef = firebase.database().ref('retrospective-application/notes');

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


        // code to handle new child.
        this.firebaseRef.on('child_added', function(childSnapshot, prevChildKey) {
            /*var notes = [];
            var newNote = childSnapshot.val();
            newNote['.key'] = childSnapshot.key;
            notes.push(newNote);

            this.setState({
                notes: notes
            });*/
        }.bind(this));


        // code to handle child removal.
        this.firebaseRef.on('child_removed', function(oldChildSnapshot) {
            /*var note = oldChildSnapshot.val();
            note['.key'] = oldChildSnapshot.key;
            var removed_note = notes.map((data,key) => {

            });

            this.setState({
                notes: notes
            });*/
        }.bind(this));


        // code to handle child data changes.
        this.firebaseRef.on('child_changed', function(childSnapshot, prevChildKey) {
            /*var changeNote = childSnapshot.val();
            changeNote['.key'] = childSnapshot.key;
            var updated_note = notes.map((data, index) => {
                if(data.key == prevChildKey){

                }
            });

            this.setState({
                notes: updated_note
            });*/
        }.bind(this));
    }

    componentWillUnmount() {
        this.firebaseRefs.off();
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

    onSubmit(event){
        event.preventDefault();

        /*firebase.auth.signInWithEmailAndPassword(email,password).catch(function(error){
         var errorCode = error.code;
         var errorMessage = error.message;
         });*/

        let  continueObject, startObject, stopObject;

        if(this.state.start != "" ) {
            startObject = {note : this.state.start, username: "neha"};
        }/*else{
            startObject = {note : 'NA', username: "neha"};
        }*/
        if(this.state.stop != ""){
            stopObject = {note : this.state.stop, username: "neha"};
        }/*else{
            stopObject = {note : 'NA', username: "neha"};
        }*/
        if(this.state.continue != ""){
            continueObject = {note : this.state.continue, username: "neha"};
        }/*else{
            continueObject = {note : 'NA', username: "neha"};
        }*/


        if(startObject == undefined){
            if(stopObject == undefined){
                this.firebaseRef.push({
                    continueNotes:continueObject
                });
            }else if(continueObject == undefined){
                this.firebaseRef.push({
                    stopNotes: stopObject
                });
            }else {
                this.firebaseRef.push({
                    stopNotes: stopObject,
                    continueNotes:continueObject
                });
            }
        }else if(stopObject == undefined){
            if(startObject == undefined){
                this.firebaseRef.push({
                    continueNotes:continueObject
                });
            }else if(continueObject == undefined){
                this.firebaseRef.push({
                    startNotes:startObject
                });
            }else {
                this.firebaseRef.push({
                    startNotes:startObject,
                    continueNotes:continueObject
                });
            }
        }else if(continueObject == undefined){
            if(startObject == undefined){
                this.firebaseRef.push({
                    stopNotes: stopObject
                });
            }else if(stopObject == undefined){
                this.firebaseRef.push({
                    startNotes:startObject
                });
            }else {
                this.firebaseRef.push({
                    startNotes:startObject,
                    stopNotes: stopObject
                });
            }
        }else {
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
            <Grid style={{backgroundColor: "#E6E6E6", textAlign: "center"}}>
                <Row style={{backgroundColor:"#FF0000"}}>
                    <Col xs={3} md={3} style={{marginTop:"20px"}}>
                        <FormGroup controlId="formControlsUserImage">
                            <Image src="../images/logo.png" style={{width:"200px", height:"50px"}} />
                        </FormGroup>
                    </Col>
                    <Col xs={3} md={3} style={{ color:"white",fontSize:30}}>
                        <strong> LiveRetro </strong>
                    </Col>
                    <Col xs={2} md={2}>
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
                    </Col>
                    <Col xs={1} md={1}>
                        <FormGroup controlId="formControlsUserImage">
                            <Image src="../images/common.jpg" style={{width:"40px", height:"40px"}} />
                        </FormGroup>
                    </Col>
                    <Col xs={2} md={2}>
                        <FormGroup>
                            <FormControl type="text" placeholder="User Name"/>
                        </FormGroup>
                    </Col>
                    <Col xs={1} md={1}>
                        <Button type="submit" style={{backgroundColor:"white",width:"30px", height:"30px"}}>
                            <span className="glyphicon glyphicon-bell" style={{textAlign:"center",fontSize:"20px"}}> </span>
                        </Button>
                    </Col>
                </Row>

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
    loading : state.scrums.loading
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect (mapStateToProps, mapDispatchToProps) (Dashboard);

