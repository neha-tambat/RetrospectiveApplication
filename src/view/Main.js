/**
 * Created by nikhila on 29/12/15.
 */

var React = require('react');
var RegisterFormLeftPanel = require('./RegisterFormLeftPanel');
var RegisterFormRightPanel = require('./RegisterFormRightPanel');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Button,Grid,Row,Col} from 'react-bootstrap';

class Main extends React.Component {

    constructor(){
        super();
        this.state = {

        };
    }

    handleNext(){
        this.props.actions.loadPage('/dashboard');
    }

    render() {
        return (
            <Grid style={{backgroundColor: "#E6E6E6", textAlign: "center"}}>
                <Row style={{backgroundColor:"#FF0000"}}>
                    <Col xs={11} md={11} style={{ color:"white",fontSize:30}}> <strong> LiveRetro </strong> </Col>
                    <Col xs={1} md={1} className="glyphicon glyphicon-circle-arrow-right"
                                        onClick={this.handleNext.bind(this)}
                                        style={{cursor:'pointer' ,color:'white',fontSize:"25px",float: 'right', marginTop:"7px"}}> </Col>
                </Row>

                <Row style={{margin : "50px"}}>
                    <Col xs={5} md={5} style={{backgroundColor:"white",boxShadow: "5px 5px 5px", padding: "10px"}}>
                        <RegisterFormLeftPanel/>
                    </Col>
                    <Col xs={7} md={7}>
                        <RegisterFormRightPanel/>
                    </Col>
                </Row>
                <Row>
                    {this.props.children}
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

export default connect(mapStateToProps,mapDispatchToProps)(Main);
