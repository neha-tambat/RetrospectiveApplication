/**
 * Created by nehat on 7/4/2016.
 */


import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Navbar, Nav,NavItem,Input,Image,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';

class RegisterFormRightPanel extends React.Component {

    render(){
        return(
            <form>
                <FormGroup controlId="formControlsParagraph" >
                    <p style={{fontSize:"20px", margin:"10px"}}>
                        "No matter how good a Scrum team is, there is always opportunity to improve.
                        Although a good scrum team will be constantly looking for improvement opportunities,
                        the team should set aside a brief, dedicated period at the end of each sprint to
                        deliberately reflect on how they are doing and to find ways to improve.
                        This occurs during the sprint retrospective."
                    </p>
                </FormGroup>
                <FormGroup controlId="formControlsImage" style={{margin:"10px"}}>
                    <img src="../images/scrum.png" style={{width:"400px",height:"200px"}}/>
                </FormGroup>
            </form>
        )
    }
}

//export default RegisterFormRightPanel;

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect (mapStateToProps, mapDispatchToProps) (RegisterFormRightPanel);
