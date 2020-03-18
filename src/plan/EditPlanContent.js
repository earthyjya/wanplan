import React from "react";
import "./EditPlanContent.css";

class EditPlanContent extends React.Component {
  state = {
    isLoading: true
  };

  onTitleChange = e => {
    this.setState({
      plan_overview: {
        ...this.state.plan_overview,
        plan_title: e.target.value
      }
    });
  };

  onDescriptionChange = e => {
    this.setState({
      plan_overview: {
        ...this.state.plan_overview,
        plan_description: e.target.value
      }
    });
  };

  onStyleChange = e => {
    this.setState({
      plan_overview: {
        ...this.state.plan_overview,
        plan_style: e.target.value
      }
    });
  };

  onPrivacyChange = e => {
    var available = 0;
    switch (e.target.value) {
      case "Unlisted":
        available = 0;
        break;
      case "Public":
        available = 1;
        break;
      default:
        available = 2;
    }
    this.setState({
      plan_overview: {
        ...this.state.plan_overview,
        available: available
      }
    });
  };

  onSave = () => {
    this.props.updatePlanOverview(this.state.plan_overview);
    this.props.closeEditPlan();
  };

  async componentDidMount() {
    this.setState({ plan_overview: this.props.plan_overview });
    this.setState({ isLoading: false });
  }

  render() {
    const { isLoading, plan_overview } = this.state;
    let styles = ["Sightseeing", "Cultural", "Adventure"];
    if (isLoading) return <div></div>;
    return (
      <div className="edit-plan-content">
        <div className="close-edit-plan" onClick={this.props.closeEditPlan}>
          &#10005;
        </div>
        <div>
          <span className="input-title">Plan Title* : </span>
          <input
            className="input-box"
            value={plan_overview.plan_title}
            onChange={this.onTitleChange}
          />
        </div>
        <div>
          <span className="input-description">Plan Description* : </span>
          <input
            className="input-description-box"
            value={plan_overview.plan_description}
            onChange={this.onDescriptionChange}
          />
        </div>
        <div>
          <span className="input-title">Plan Style : </span>
          <select
            className="input-box"
            value={plan_overview.plan_style}
            onChange={this.onStyleChange}
          >
            {styles.map(style => {
              return <option>{style}</option>;
            })}
          </select>
        </div>
        <div>
          <span className="input-title">Privacy : </span>
          <select
            className="input-box"
            value={
              this.state.plan_overview.available === 0 ? "Unlisted" : "Public"
            }
            onChange={this.onPrivacyChange}
          >
            <option>Unlisted</option>
            <option>Public</option>
          </select>
        </div>
        <button className="save" onClick={this.onSave}>
          Save
        </button>
        <button className="cancel" onClick={this.props.closeEditPlan}>
          Cancel
        </button>
      </div>
    );
  }
}

export default EditPlanContent;
