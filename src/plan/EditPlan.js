import React from "react";
import "./EditPlan.css";

class EditPlan extends React.Component {
  state = {
    plan_overview: {
      
    }
  };

  onChange = () => {};

  componentDidMount() {
    this.setState({ plan_overview: this.props.plan_overview });
  }

  render() {
    return (
      <div className="edit-plan-window">
        <div className="close-edit-plan" onClick={this.props.closeEditPlan}>
          &#10005;
        </div>
        <div>
          Plan Title
          <input
            className="url-box"
            value={this.state.plan_overview.title}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default EditPlan;
