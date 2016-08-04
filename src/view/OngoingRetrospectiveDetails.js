/**
 * Created by nehat on 7/19/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import WarningModalBox from '../components/WarningModalBox';

class OngoingRetrospectiveDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            warningShow: false,
            WaringHeaderMsg : 'Warning',
            modalBody_warning: 'Select project first and proceed.'
        };
    }

    handleSelectRetro(event){
        if(this.props.selected_project_id == null){
            this.setState({warningShow: true});
        }else {
            this.props.actions.loadPage('loginSuccess/dashboard');
        }
    }

    onWarningHide(){
        this.setState({warningShow: false});
    }

    modalSubmit(){
        console.log("Warning message : Select project first and proceed.");
        this.setState({warningShow: false});
    }

    render(){
        var {selected_project_id} = this.props;
        return(
            <Grid>
                <Row>
                    <a onClick={this.handleSelectRetro.bind(this)}> Retrospective 1 </a>
                </Row>
                <Row>
                    <a onClick={this.handleSelectRetro.bind(this)}> Retrospective 2 </a>
                </Row>
                <Row>
                    <WarningModalBox
                        showModal={this.state.warningShow}
                        onWarningHide={this.onWarningHide.bind(this)}
                        headerMsg= {this.state.WaringHeaderMsg}
                        modalbody={this.state.modalBody_warning}
                        onWarningModalSubmit ={this.modalSubmit.bind(this)}
                    />
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    selected_project_id: state.scrums.selected_project_id
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(OngoingRetrospectiveDetails);
