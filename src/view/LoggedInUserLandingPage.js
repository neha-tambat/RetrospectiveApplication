/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import * as scrumsActionCreator from '../actions/scrums/index';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import ModalBox from '../components/ModalBox';
import AppHeader from './AppHeader';

class LoggedInUserLandingPage extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: [], team:[],
            menuIndex: 2,
            show : false,
            createEmployee: false,
            modalBody_createEmployee: 'Confirm Details...',
            headerMsg : 'Create Project'
        };
    }

    componentWillMount(){
        this.props.actions.loadPage('/loginSuccess/ongoingRetro');

        this.firebaseRef = firebaseInit.database().ref('projects');

    }

    handleSelect(selectedKey) {
        var tab;
        //alert('selected ' + selectedKey);
        if(selectedKey == "1"){
            tab = "myProfile";
        }else if(selectedKey == "2"){
            tab = "ongoingRetro";
        }else if(selectedKey == "3"){
            tab = "pastRetro";
        }else if(selectedKey == "4"){
            tab = "teamManage";
        }else if(selectedKey == "5"){
            tab = "createSprintRetro";
        }

        this.props.actions.loadPage('/loginSuccess/'+tab);
        this.setState({menuIndex  : selectedKey});
    }

    createProject(){
        this.setState({show:true, createEmployee: true});
    }
    onHide(){
        this.setState({show:false});
    }

    addMemberToDatabase(matchedKey){
        if(matchedKey != null){
            var firebaseRef1 = firebase.database().ref('projects/'+ matchedKey +'/team');
            this.firebaseRef1 = firebase.database().ref('projects/'+ matchedKey +'/team');

            this.firebaseRef1.limitToLast(25).on('value', function (dataSnapshot) {
                console.log("Tree for team : " , 'projects/'+ matchedKey +'/team');
                var team = [];
                dataSnapshot.forEach(function (childSnapshot) {
                    var teamMate = childSnapshot.val();
                    teamMate['.key'] = childSnapshot.key;
                    team.push(teamMate);
                }.bind(this));

                console.log('team', team);

                this.setState({
                    team: team
                });
            }.bind(this));
        }
    }

    modalSubmitCreateProject(event,modalTab){
        console.log("ModalTab : ", modalTab);
        console.log("Event : " , event);

        if(modalTab == "Create Project"){
            var user = firebase.auth().currentUser;
            if (user) {
                event.user_id = user.uid;
                this.firebaseRef.push(event);
            }
            else{
                alert("Login to application before creating Application");
            }
        }else if(modalTab == "Add Member"){

            for(var index=0; index <= this.state.projects.length; index++){
                if(this.state.projects[index].project_name.toLowerCase() == event.teamMemberProjectName.toLowerCase()){
                    var matchedKey = this.state.projects[index]['.key'];
                    break;
                }
            }

            console.log("matchedKey : ", matchedKey);
            this.addMemberToDatabase(matchedKey);
            this.firebaseRef1.push(event);
        }

        this.setState({show:false, createEmployee: false});
    }


    render(){
        return(
            <Grid style={{backgroundColor: "#E6E6E6", textAlign: "center", margin: 0, width: "100%"}}>
                <AppHeader />
                <Row className="clearfix">
                    <Col xs={3} md={3} >
                        <Nav bsStyle="pills" stacked style={{backgroundColor:"black"}} activeKey={this.state.menuIndex} onSelect={this.handleSelect.bind(this)}>
                            <NavItem eventKey={0} >
                                <Button type="button" className="glyphicon glyphicon-menu-hamburger" style={{backgroundColor:"black",color:"white"}}> </Button>
                            </NavItem>
                            <NavItem eventKey={1} href="#myProfile"> <span style={{color:"white"}}>My Profile</span> </NavItem>
                            <NavItem eventKey={2} href="#ongoingRetro"> <span style={{color:"white"}}>Ongoing Retrospective</span> </NavItem>
                            <NavItem eventKey={3} href="#pastRetro"> <span style={{color:"white"}}>Past Retrospective</span> </NavItem>
                            <NavItem eventKey={4} href="#teamManage"> <span style={{color:"white"}}>Team Manage</span> </NavItem>
                            <NavItem eventKey={5} href="#createSprintRetro"> <span style={{color:"white"}}>Create Sprint Retrospective</span> </NavItem>
                        </Nav>
                    </Col>

                    <Col xs={9} md={9} style={{backgroundColor:"#E6E6E6",marginTop:"10px"}} >
                        <Row style={{margin:"20px", marginLeft:"1200px"}}>
                            <Button type="button" className="createProject" onClick={this.createProject.bind(this)} style={{color:"white", backgroundColor:"red"}}> Create Project </Button>
                        </Row>
                        <Row>
                            {this.props.children}
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <ModalBox
                        showModal= {this.state.show}
                        onHide= {this.onHide.bind(this)}
                        headerMsg= {this.state.headerMsg}
                        modalbody={this.state.modalBody_createEmployee}
                        onModalSubmit ={this.modalSubmitCreateProject.bind(this)}

                    />
                </Row>
            </Grid>
        );
    }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(LoggedInUserLandingPage);

