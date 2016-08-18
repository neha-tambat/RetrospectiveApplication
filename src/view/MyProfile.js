/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';


class MyProfile extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    render(){
        return(
            <Grid style={{margin:"100px"}}>
                <Row>
                    <form className="myProfile-form">
                        <FormGroup controlId="formControlsUserName">
                            <ControlLabel>Username</ControlLabel>
                            <FormControl type="text"> </FormControl>
                        </FormGroup>
                        <FormGroup controlId="formControlsFirstName">
                            <ControlLabel>Firstname</ControlLabel>
                            <FormControl type="text"> </FormControl>
                        </FormGroup>
                        <FormGroup controlId="formControlsLastName">
                            <ControlLabel>Lastname</ControlLabel>
                            <FormControl type="text"> </FormControl>
                        </FormGroup>

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

export default connect(mapStateToProps,mapDispatchToProps)(MyProfile);