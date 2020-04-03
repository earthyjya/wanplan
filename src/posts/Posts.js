import React, { Component } from "react";
import { Table } from "reactstrap";
// import withRequest from "../lib/withRequest"
import { Link } from "react-router-dom";

class Posts extends Component {
	render() {
		return (
			<div>
				<Table>
					<thead>
						<tr>
							<th>UserId</th>
							<th>Id</th>
							<th>Title</th>
							<th>Body</th>
						</tr>
					</thead>
					<tbody>
						{this.props.isLoading ? (
							<div>Loading...</div>
						) : this.props.error ? (
							<div>{this.props.error.message}</div>
						) : (
							this.props.data.map(post => (
								<tr key={post.id}>
									<th scope="row">{post.id}</th>
									<td>{post.userId}</td>
									<td>
										<Link to={`${post.id}`}>{post.title}</Link>
									</td>
									<td>{post.body}</td>
								</tr>
							))
						)}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default Posts;
