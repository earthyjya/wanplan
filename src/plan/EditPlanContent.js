import "../scss/EditPlanContent.scss";
import React from "react";

class EditPlanContent extends React.Component {
  state = {
    originalCityId: 0,
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
    let available = 0;
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

  onCityChange = e => {
    const { cities } = this.props;
    const city_id = Number(e.target.value);
    const city = cities.filter(city => city.city_id === city_id)[0].city;
    this.setState({
      plan_overview: {
        ...this.state.plan_overview,
        city_id,
        city
      }
    });
  };

  onSave = async () => {
    await this.props.updatePlanOverview(this.state.plan_overview);
    this.props.reloadPlanOverview();
    this.props.toggleEditPlanContent();
  };

  async componentDidMount() {
    this.setState({
      plan_overview: this.props.plan_overview,
      originalCityId: this.props.plan_overview.city_id,
      isLoading: false
    });
  }

  render() {
    const { isLoading, plan_overview } = this.state;
    const { cities } = this.props;
    let styles = ["Sightseeing", "Cultural", "Adventure"];
    if (isLoading) return <div>Loading...</div>;
    return (
      <div className="edit-plan-content">
        <div className="close-edit-plan" onClick={this.props.toggleEditPlanContent}>
          &#10005;
        </div>
        <div>
          <span className="input-title">Plan Title * : </span>
          <input
            className="input-box"
            value={plan_overview.plan_title}
            onChange={this.onTitleChange}
          />
        </div>
        <div>
          <span className="input-title">City : </span>
          <select
            className="input-box"
            value={this.state.plan_overview.city_id}
            onChange={this.onCityChange}
          >
            {cities.map(city => {
              return (
                <option key={city.city_id} value={city.city_id} className={city.city}>
                  {city.city}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <span className="input-title">Plan Description * : </span>
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
              return <option key={style}>{style}</option>;
            })}
          </select>
        </div>
        {/*
        <div>
          <span className="input-title">Privacy : </span>
          <select
            className="input-box"
            value={this.state.plan_overview.available === 0 ? "Unlisted" : "Public"}
            onChange={this.onPrivacyChange}
          >
            <option>Unlisted</option>
            <option>Public</option>
          </select>
        </div>
      */}
        <button className="save" onClick={this.onSave}>
          Save
        </button>
        <button className="cancel" onClick={this.props.toggleEditPlanContent}>
          Cancel
        </button>
      </div>
    );
  }
}

export default EditPlanContent;
