/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import {getScreenMode} from '../utils/index';

class MyProfile extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    render(){
        var {loggedInUserDetails} = this.props;
        var screenSize = getScreenMode();
        var myProfileFormPosition = (screenSize == "medium") ? "myProfile-form-md" : "myProfile-form-lg";

        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className={myProfileFormPosition}>
                        <ControlLabel style={{fontSize:"20px", marginLeft:"200px"}}> My Profile </ControlLabel>
                        <FormGroup controlId="formControlsUserName">
                            <ControlLabel>Username</ControlLabel>
                            <FormControl type="text" value={loggedInUserDetails.full_name} />
                        </FormGroup>
                        <FormGroup controlId="formControlsFirstName">
                            <ControlLabel>Firstname</ControlLabel>
                            <FormControl type="text" value={loggedInUserDetails.first_name} />
                        </FormGroup>
                        <FormGroup controlId="formControlsLastName">
                            <ControlLabel>Lastname</ControlLabel>
                            <FormControl type="text" value={loggedInUserDetails.last_name} />
                        </FormGroup>
                        <FormGroup controlId="formControlsEmailId">
                            <ControlLabel>Email Id</ControlLabel>
                            <FormControl type="text" value={loggedInUserDetails.email} />
                        </FormGroup>

                    </form>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    loggedInUserDetails: state.scrums.loggedInUserDetails
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(MyProfile);