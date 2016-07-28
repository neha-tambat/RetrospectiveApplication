/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';


class OngoingRetrospectiveDetails extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    handleSelectRetro(event){
        this.props.actions.loadPage('loginSuccess/dashboard');
    }

    render(){
        return(
            <Grid>
                <Row>
                    <a onClick={this.handleSelectRetro.bind(this)}> Retrospective 1 </a>
                </Row>
                <Row>
                    <a onClick={this.handleSelectRetro.bind(this)}> Retrospective 2 </a>
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

export default connect(mapStateToProps,mapDispatchToProps)(OngoingRetrospectiveDetails);
