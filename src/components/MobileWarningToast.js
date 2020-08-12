import {
  isMobileOnly
} from "react-device-detect";
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import React, { Component } from "react";

class MobileWarningToast extends Component {
  state =  {
    isOpen: true,
    toggle: null,
  }
  render(){
    return(
      <Toast isOpen={this.props.isOpen}>
        <ToastHeader toggle={this.props.toggleToast}>Mobile not supported!</ToastHeader>
        <ToastBody>
          This feature does not support mobile version yet. We will soon deliver it
          as soon as possible!
        </ToastBody>
      </Toast>
    )
  }
}

export default MobileWarningToast;
