/**
 * Created by nehat on 8/5/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
var FixedDataTable = require('fixed-data-table');
const {Table, Column, Cell, ColumnGroup} = FixedDataTable;


class TextCell extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

    handleView(event){
        var key = event.target.id;
        this.props.handleView(key);
    }
    handleEdit(event){
        var key = event.target.id;
        this.props.handleEdit(key);
    }
    handleDelete(event){
        var key = event.target.id;
        this.props.handleDelete(key);
    }

    render() {
        const {rowIndex, col, data, columnKey, ...props} = this.props;

        var id = data[rowIndex]['.key'];

        if(data == null || data.length == 0 || rowIndex > data.length){
            return(
                null
            );
        }

        if(col == "more"){
            return(
                <Cell {...props}>
                    <Button id={id}> More </Button>
                </Cell>
            );
        }

        if(col == "delete"){
            return(
                <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center',padding:"15px"}}
                      className="glyphicon glyphicon-remove-circle center-block" onClick={this.handleDelete.bind(this)}> </Cell>
            );
        }
        if(col == "edit"){
            return(
                <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center',padding:"15px"}}
                      className="glyphicon glyphicon-pencil center-block" onClick={this.handleEdit.bind(this)}> </Cell>
            );
        }
        if(col == "view"){
            return(
                <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center',padding:"15px"}}
                      className="glyphicon glyphicon-eye-open center-block" onClick={this.handleView.bind(this)}> </Cell>
            );
        }

        return(
            <Cell {...props} id={id} style={{cursor:'pointer',textAlign:'center'}} accessKey={rowIndex} >
                {data[rowIndex][col]}
            </Cell>
        );
    }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(TextCell);