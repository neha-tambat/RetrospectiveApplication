/**
 * Created by synerzip on 3/16/2016.
 */
let React = require('react');
let ReactDom = require('react-dom');
let Bootstrap = require('react-bootstrap');
let _ = require('lodash');
import {Panel,Input,ButtonInput,Popover,Button,Modal,ModalBody,ModalFooter,ModalHeader,ModalTitle,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import ProjectList from '../view/ProjectList';

export default class ModalBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: null,
            projectInfo: null,
            teamMemberProjectName: null,
            employeeName: null,
            email: null,
            jobRole: null
        };

        this.createProject = "active", this.addTeamMembers = ""
    }
    onCancel(e) {
        e.preventDefault();
        this.props.onHide();
    }
    onSubmit(event) {
        var modalTab = event.target.id;
        if(modalTab == "Create Project") {
            var projectDetails = {project_name: this.state.projectName, description: this.state.projectInfo};
            this.props.onModalSubmit(projectDetails,modalTab);
        }else if(modalTab == "Add Member"){
            var TeamMemberDetails = {
                teamMemberProjectName: this.state.teamMemberProjectName,
                employeeName: this.state.employeeName,
                email : this.state.email,
                jobRole : this.state.jobRole
            };
            this.props.onModalSubmit(TeamMemberDetails,modalTab);
        }

    }
    projectNameCreationChange(event){
        this.setState({projectName : event.target.value});
    }
    additionalProjectInfoChange(event){
        this.setState({projectInfo : event.target.value});
    }
    onTabSelect(tabId){
        this.setState({selectedTab:tabId});
        this.createProject = "";
        this.addTeamMembers = "";
        if(tabId == 'createProject'){
            this.createProject = "active";
            this.addTeamMembers = "";
        }else{
            this.createProject = "";
            this.addTeamMembers = "active";
        }
    }
    projectNameChange(event){
        this.setState({teamMemberProjectName: event.target.value});
    }
    employeeNameChange(event){
        this.setState({employeeName : event.target.value});
    }

    emailChange(event){
        this.setState({email: event.target.value});
    }

    jobRoleChange(event){
        this.setState({jobRole : event.target.value});
    }

    render() {

        var modalHeaderTabs = (
            <div style={{cursor:'pointer', textAlign: "center"}}>
                <ul className="nav nav-tabs nav-justified">
                    <li className="createEmployee" style={{ backgroundColor:(this.createProject == "active" ? "#990000" : "#484848")}}>
                        <div onClick={this.onTabSelect.bind(this,'createProject')} style={{fontSize:20,margin:'10px'}}>
                            <a data toggle="tab" style={{color:"white"}}>
                                <b> Create Project </b>
                            </a>
                        </div>
                    </li>
                    <li className="addTeamMembers" style={{ backgroundColor:(this.addTeamMembers == "active" ? "#990000" : "#484848")}}>
                        <div onClick={this.onTabSelect.bind(this,'addTeamMembers')} style={{fontSize:20,margin:'10px'}}>
                            <a data toggle="tab" style={{color:"white"}}>
                                <b> Add Team Members </b>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        );

        var createProject = (
                <div style={{border : "2px solid black",margin:"100px", width:600}}>
                    <form style={{margin:"20px"}}>
                        <FormGroup controlId="formControlsProjectName">
                            <FormControl type="text" placeholder="Project Name" onChange={this.projectNameCreationChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsProjectInfo">
                            <FormControl type="textarea" componentClass="textarea" placeholder="Additional info about project"
                                         style={{height:"150px"}} onChange={this.additionalProjectInfoChange.bind(this)}/>
                        </FormGroup>
                    </form>
                </div>
        );

        var addTeamMembers = (
            <div style={{border : "2px solid black",margin:"100px", width:600}}>
                <form style={{margin:"20px"}}>
                    <ProjectList />
                    <FormGroup controlId="formControlsEmployeeName">
                        <FormControl type="text" placeholder="Employee Name"
                                     onChange={this.employeeNameChange.bind(this)}/>
                    </FormGroup>
                    <FormGroup controlId="formControlsEmailId">
                        <FormControl type="email" placeholder="Email Id"
                                     onChange={this.emailChange.bind(this)}/>
                    </FormGroup>
                    <FormGroup controlId="formControlsJobRole">
                        <FormControl type="text" placeholder="Job Role"
                                     onChange={this.jobRoleChange.bind(this)}/>
                    </FormGroup>
                </form>
            </div>
        );

        var modalSubmitName = this.createProject == "active" ? "Create Project" :
                                this.addTeamMembers == "active" ? "Add Member" : null;

        return (
            <Modal
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
                show={this.props.showModal}
                onHide={this.onCancel.bind(this)}
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title">
                        <div>
                            <div className="glyphicon glyphicon-remove"
                                 style={{float:'right', cursor:'pointer',margin:'10px'}}
                                 onClick={this.onCancel.bind(this)}> </div>
                        </div>
                        <div>
                            {modalHeaderTabs}
                        </div>

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        {this.createProject == "active" ? createProject :
                            this.addTeamMembers == "active" ? addTeamMembers : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.onCancel.bind(this)}>Cancel</Button>
                    <Button bsStyle="success" id={modalSubmitName} onClick={this.onSubmit.bind(this)}>{modalSubmitName}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}