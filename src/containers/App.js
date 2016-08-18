/*
import React from 'react';
var ReactToastr = require("react-toastr");
import { connect } from 'react-redux';
var {ToastContainer} = ReactToastr; // This is a React Element.
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class CoreLayout extends React.Component {
    componentWillReceiveProps(nextProps,nextState){
        if(nextProps.toast &&  nextProps.toast.show == true) {
            if (nextProps.toast.toastData) {
                if(nextProps.toast.toastData.status == 'error') {
                    this.refs.container.error(
                        nextProps.toast.toastData.message, nextProps.toast.toastData.title, {
                            timeOut: 3000,
                            extendedTimeOut: 1000,
                            "showDuration": "300",
                            "hideDuration": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut"
                        });
                }else if(nextProps.toast.toastData.status == 'success') {
                    this.refs.container.success(
                        nextProps.toast.toastData.message, nextProps.toast.toastData.title, {
                            timeOut: 3000,
                            extendedTimeOut: 1000,
                            "showDuration": "300",
                            "hideDuration": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut"
                        });
                }else if(nextProps.toast.toastData.status == 'warning') {
                    this.refs.container.warning(
                        nextProps.toast.toastData.message, nextProps.toast.toastData.title, {
                            timeOut: 3000,
                            extendedTimeOut: 1000,
                            "showDuration": "300",
                            "hideDuration": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut"
                        });
                }else if(nextProps.toast.toastData.status == 'info') {
                    this.refs.container.info(
                        nextProps.toast.toastData.message, nextProps.toast.toastData.title, {
                            timeOut: 3000,
                            extendedTimeOut: 1000,
                            "showDuration": "300",
                            "hideDuration": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut"
                        });
                }
            }
        }
    }
    render() {
        return (
            <div className='cspage'>
                <ToastContainer ref="container"
                                toastMessageFactory={ToastMessageFactory}
                                className="toast-top-right"
                                iconClassName="error"/>
                {this.props.children}
            </div>

        );
    }
}


const mapStateToProps = (state) => ({
    toast: state.toast
});


export default connect(mapStateToProps)(CoreLayout);*/
