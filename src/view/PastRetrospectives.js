/**
 * Created by nehat on 8/3/2016.
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
import TextCell from './TextCell';
import {Navbar, Nav,NavItem,Input,Image,Tab,TabContainer,TabContent,TabPane,Button,Grid,Row,Col,FormGroup,FormControl,ControlLabel} from 'react-bootstrap';
var FixedDataTable = require('fixed-data-table');
const {Table, Column, Cell, ColumnGroup} = FixedDataTable;

class PastRetrospectives extends React.Component {
    constructor() {
        super();
        this.state = {
            retrospectives: []
        };
    }

    componentWillMount(){
        var firebaseRef = firebase.database().ref('retrospectives');
        //this.bindAsArray(firebaseRef.limitToLast(25), 'retrospectives/notes');

        this.firebaseRef = firebase.database().ref('retrospectives');

        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            console.log("Tree for notes : ", 'retrospectives');
            var retrospectives = [];
            dataSnapshot.forEach(function(childSnapshot) {
                var retrospective = childSnapshot.val();
                retrospective['.key'] = childSnapshot.key;
                retrospectives.push(retrospective);
            }.bind(this));

            console.log("retrospectives : ", retrospectives);

            this.setState({
                retrospectives: retrospectives
            });
        }.bind(this));
    }

    render(){
        var dataList = null;
        console.log("this.state.retrospectives : ", this.state.retrospectives);
        if(this.state.retrospectives.length != 0){
            dataList = this.state.retrospectives;
        }

        return(
            <div style={{textAlign:'center', margin:'20px', width:'1370px'}}>
                <Table
                    rowHeight={50}
                    rowsCount={dataList == null ? 0 : dataList.length}
                    width={1370}
                    maxHeight={500}
                    headerHeight={50}
                    {...this.props}>

                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> Sprint End Date </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="sprint_end_date" />}
                        width={500}
                    />
                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> Retrospective Date </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="retrospectiveDate" />}
                        width={500}
                    />
                    <Column
                        header={<Cell style={{backgroundColor: '#484848',color:'white'}}>
                                    <div style={{margin:'10px'}}> More </div>
                                </Cell>}
                        cell={<TextCell data={dataList} col="more" />}
                        width={370}
                    />
                </Table>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(scrumsActionCreator, dispatch)
});

export default connect(mapStateToProps,mapDispatchToProps)(PastRetrospectives);