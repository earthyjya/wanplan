import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class EditPlanOverview extends Component {
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
				<Form style={{zIndex:1}}>
					<Row form>
						<FormGroup>
							<Input type="select" name="select" id="exampleSelect">
								<option>1</option>
								<option>2</option>
							</Input>
						</FormGroup>
					</Row>
					<Row form>
						<FormGroup>
							<Input placeholder="lg" bsSize="lg" />
						</FormGroup>
					</Row>
				</Form>
			</Container>
		</React.Fragment>
		);
	}
}

export default EditPlanOverview;
