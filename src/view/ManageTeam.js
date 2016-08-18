/**
 * Created by nehat on 8/18/2016.
 */

var React = require('react');
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import * as scrumsActionCreator from '../actions/scrums/index';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
import firebase from 'firebase';
import database from 'firebase/database';
import auth from 'firebase/auth';
import firebaseInit from '../firebase/firebaseInit';

class ManageTeam extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: [],
            projectName: null,
            projectInfo: null
        };
    }

    render(){

        var selectRowProp = {
            mode: "checkbox",  //checkbox for multi select, radio for single select.
            clickToSelect: true,   //click row will trigger a selection on that row.
            bgColor: "rgb(200, 150, 150)"   //selected row background color
        };

        function action(cell, row){
            return '<Button type="submit" onClick={this.remove.bind(this)}> Remove </Button>';
        }

        return(
            <Grid>
                <Row className="project-table">
                    <BootstrapTable
                        data={dataList}
                        striped={true}
                        hover={true}
                        condensed={true}
                        pagination={true}
                        selectRow={selectRowProp}
                        insertRow={true}
                        deleteRow={true}
                        columnFilter={true}
                        search={true}>
                        <TableHeaderColumn dataField="employeeName"
                                           isKey={true}
                                           dataAlign="center"
                                           dataSort={true}
                                           className="table-header">Employee Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="jobRole"
                                           dataAlign="center"
                                           dataSort={true}
                                           className="table-header">Role</TableHeaderColumn>
                        <TableHeaderColumn dataField="email"
                                           dataAlign="center"
                                           dataSort={true}
                                           className="table-header">Email</TableHeaderColumn>
                        <TableHeaderColumn dataField="button"
                                           dataFormat={action}
                                           dataAlign="center"
                                           className="table-header">Action</TableHeaderColumn>
                    </BootstrapTable>
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

export default connect(mapStateToProps,mapDispatchToProps)(ManageTeam);