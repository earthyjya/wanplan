import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import { CustomInput } from 'reactstrap';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import "../scss/EditPlanOverview.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class EditPlanOverview extends Component {

	state = {
		dropdownOpen: false,
	}

	toggleDropDown = () => {
		this.setState({dropdownOpen: !this.state.dropdownOpen});
	}

	render() {
		const { plan_overview } = this.props;
		return (
		<React.Fragment>
			<Container
				fluid
				className="plan-description-picture"
				style={{
					backgroundImage:
						"url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"
				}}
			>
			</Container>
			<Container
				fluid
				className="plan-description-container plan-header"
			>
				<div className="choose-photo-container">
					<FontAwesomeIcon icon="camera" size="lg"/>
					<span style={{marginLeft:"8px"}}>choose a cover photo</span>
				</div>
					<Row>
						<Dropdown className="privacy-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
				      <DropdownToggle
								tag="div"
				        data-toggle="dropdown"
								className="privacy-dropdown-toggle">
								<div style={{width:"auto"}}><FontAwesomeIcon  icon="globe-asia" size="lg"/></div>
				        <span>public</span>
								<div style={{width:"auto"}}><FontAwesomeIcon icon="angle-down" size="lg"/></div>
				      </DropdownToggle>
				      <DropdownMenu style={{zIndex:3}}>
				        <div onClick={this.toggleDropDown}>public</div>
				        <div onClick={this.toggleDropDown}>private</div>
				      </DropdownMenu>
				    </Dropdown>
					</Row>
					<Row>
						<div>
							<input type="textarea" id="title-input" placeholder={plan_overview.plan_title} />
							<FontAwesomeIcon className="title-input-icon" icon="pencil-alt" />
						</div>
					</Row>
			</Container>
		</React.Fragment>
		);
	}
}

export default EditPlanOverview;
