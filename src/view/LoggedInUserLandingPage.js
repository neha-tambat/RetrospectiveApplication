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

import AppHeader from './AppHeader';

class LoggedInUserLandingPage extends React.Component {
    constructor() {
        super();
        this.state = {
            menuIndex: 2
        };
    }

    componentWillMount(){
        this.props.actions.loadPage('/loginSuccess/ongoingRetro');
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
            tab = "createProject";
        }else if(selectedKey == "5"){
            tab = "teamManage";
        }else if(selectedKey == "6"){
            tab = "createSprintRetro";
        }

        this.props.actions.loadPage('/loginSuccess/'+tab);
        this.setState({menuIndex  : selectedKey});
    }

    render(){

        const tabsInstance = (
            <TabContainer id="left-tabs-example" defaultActiveKey={this.state.menuIndex} activeKey={this.state.menuIndex} onSelect={this.handleSelect.bind(this)}>
                <Row className="clearfix">
                    <Col xs={3} md={3} >
                        <Nav bsStyle="pills" stacked style={{backgroundColor:"black"}}>
                            <NavItem eventKey={0} >
                                <Button type="button" className="glyphicon glyphicon-menu-hamburger" style={{backgroundColor:"black",color:"white"}}> </Button>
                            </NavItem>
                            <NavItem eventKey={1} href="#myProfile"> <span style={{color:"white"}}>My Profile</span> </NavItem>
                            <NavItem eventKey={2} href="#ongoingRetro"> <span style={{color:"white"}}>Ongoing Retrospective</span> </NavItem>
                            <NavItem eventKey={3} href="#pastRetro"> <span style={{color:"white"}}>Past Retrospective</span> </NavItem>
                            <NavItem eventKey={4} href="#createProject"> <span style={{color:"white"}}>Create Project</span> </NavItem>
                            <NavItem eventKey={5} href="#teamManage"> <span style={{color:"white"}}>Team Manage</span> </NavItem>
                            <NavItem eventKey={6} href="#createSprintRetro"> <span style={{color:"white"}}>Create Sprint Retrospective</span> </NavItem>
                        </Nav>
                    </Col>

                    <Col xs={9} md={9} style={{backgroundColor:"#E6E6E6"}} >
                        {this.props.children}
                    </Col>
                </Row>
            </TabContainer>
        );

        return(
            <Grid style={{backgroundColor: "#E6E6E6", textAlign: "center", margin: 0, width: "100%"}}>
                <AppHeader />
                {tabsInstance}
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

