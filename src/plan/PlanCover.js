import "../scss/PlanCover.scss";
import React from "react";
// import axios from "axios";

class PlanCover extends React.Component {
  state = {
    URL: null,
    copied: false
  };

  componentDidMount() {
    this.setState({ URL: window.location.href });
  }

  render() {
    // const { URL, copied } = this.state;
    return (
      <div className="plan-cover-modal-content">
        <div className="close-modal" onClick={this.props.togglePlanCover}>
          &#10005;
        </div>
        <div>
          <input
            type="file"
            id="planCover"
            className="planCover"
            accept="image/png, image/jpeg"
            onChange={this.props.fileSelectedHandler}
          />
          <button onClick={this.props.uploadSelectedCover}>Upload</button>
        </div>
      </div>
    );
  }
}

export default PlanCover;
