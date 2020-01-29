import React, { Component } from "react";
import { Jumbotron ,TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap";
import { Card, CardImg, CardTitle, CardText, CardBody, CardSubtitle, Row, Col, Container, Button} from "reactstrap";
// import withRequest from "../lib/withRequest"
import {Link} from "react-router-dom";
import classnames from 'classnames';

class PostDetail extends Component {
	constructor(props){
			super(props);
			this.state = {
				activeTab: '1'
			}
	}
	toggle(tab){
		if(this.state.activeTab !== tab)
			this.setState({activeTab: tab});
	}

	render() {
		return (
			<React.Fragment>
				<Jumbotron style={{"backgroundImage": "url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"}}>
					<h1>Japan</h1>
				</Jumbotron>
				<Nav tabs>
					<NavItem>
						<NavLink
							className={classnames({ active: this.state.activeTab === '1' })}
							onClick={() => { this.toggle('1'); }}
							>
							Overview
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({ active: this.state.activeTab === '2' })}
							onClick={() => { this.toggle('2'); }}
							>
							Details
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1">
							<Row>
								<Col>Plan description</Col>
								<Col>
									<Card>
										 <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" />
										 <CardBody>
											 <CardTitle>Card title</CardTitle>
											 <CardSubtitle>Card subtitle</CardSubtitle>
											 <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
											 <Button>Button</Button>
										 </CardBody>
									 </Card>
								</Col>
							</Row>
					</TabPane>
					<TabPane tabId="2">

					</TabPane>
			 </TabContent>
			</React.Fragment>
		);
	}
}

export default PostDetail;
