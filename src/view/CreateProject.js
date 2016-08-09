/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';


class CreateProject extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    projectNameCreationChange(event){

    }
    additionalProjectInfoChange(event){

    }
    createProject(event){

    }

    render(){
        return(
            <Grid style={{textAlign:"center", margin : "40px"}}>
                <Row style={{border : "2px solid black",width:"600px"}}>
                    <form style={{margin:"20px"}}>
                        <FormGroup controlId="formControlsProjectName">
                            <ControlLabel>Project Name</ControlLabel>
                            <FormControl type="text" onChange={this.projectNameCreationChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup controlId="formControlsProjectInfo">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl type="text" componentClass="textarea" placeholder="Additional info about project" onChange={this.additionalProjectInfoChange.bind(this)}/>
                        </FormGroup>
                        <Button type="submit" style={{backgroundColor:"#FF0000", width:"150px"}} onClick={this.createProject.bind(this)} >
                            <span style={{color:"white", fontSize:"18px"}}> <strong>Create Project</strong> </span>
                        </Button>
                    </form>
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

export default connect(mapStateToProps,mapDispatchToProps)(CreateProject);
