/**
 * Created by nehat on 8/3/2016.
 */

let React = require('react');
let ReactDom = require('react-dom');
let Bootstrap = require('react-bootstrap');
let _ = require('lodash');
import {Panel,Input,ButtonInput,Popover,Button,Modal,ModalBody,ModalFooter,ModalHeader,ModalTitle,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';

export default class WarningModalBox extends React.Component {

    onCancel(e) {
        e.preventDefault();
        this.props.onWarningHide();
    }

    onSubmit(){
        this.props.onWarningModalSubmit();
    }

    render(){
        return(
            <Modal
                bsSize="small"
                aria-labelledby="contained-modal-title-sm"
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
                        <div> {this.props.headerMsg} </div>

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.modalbody}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.onCancel.bind(this)}>Cancel</Button>
                    <Button bsStyle="success" id="OK_btn" onClick={this.onSubmit.bind(this)}>Ok</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}