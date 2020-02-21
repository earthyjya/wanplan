import React, { Component } from "react";
import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Card,
	CardTitle,
	CardBody,
	CardSubtitle,
	Row,
	Col
} from "reactstrap";
import classnames from "classnames";
import "./PostDetail.css";

class PostDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: "1"
		};
	}
	toggle(tab) {
		if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
	}

	render() {
		return (
			<React.Fragment>
				<div
					className="post-header"
					style={{
						backgroundImage:
							"url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"
					}}
				></div>
				<Nav tabs>
					<NavItem>
						<NavLink
							className={classnames({ active: this.state.activeTab === "1" })}
							onClick={() => {
								this.toggle("1");
							}}
						>
							Overview
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({ active: this.state.activeTab === "2" })}
							onClick={() => {
								this.toggle("2");
							}}
						>
							Details
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({ active: this.state.activeTab === "3" })}
							onClick={() => {
								this.toggle("3");
							}}
						>
							Map
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1" className="tab-content">
						<Row>
							<Col sm={12} md={6} lg={7} className="overview-description-wrap">
								<h2>Post Name</h2>
								Lorem Ipsum is simply dummy text of the printing and typesetting
								industry. Lorem Ipsum has been the industry's standard dummy
								text ever since the 1500s, when an unknown printer took a galley
								of type and scrambled it to make a type specimen book. It has
								survived not only five centuries, but also the leap into
								electronic typesetting, remaining essentially unchanged. It was
								popularised in the 1960s with the release of Letraset sheets
								containing Lorem Ipsum passages, and more recently with desktop
								publishing software like Aldus PageMaker including versions of
								Lorem Ipsum.
							</Col>
							<Col>
								<Card>
									<img
										src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
										className="avatar-image"
										alt="author"
									/>

									<CardBody>
										<CardTitle>John Doe</CardTitle>
										<CardSubtitle>User description</CardSubtitle>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="2" className="tab-content"></TabPane>
				</TabContent>
			</React.Fragment>
		);
	}
}

export default PostDetail;
