import React, { Component } from "react";
import { Table } from "reactstrap";
// import withRequest from "../lib/withRequest";

class User extends Component {
	render() {
		return (
			<div>
				<Table>
					<thead>
						<tr>
							<th>Id</th>
							<th>Username</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>
						{this.props.isLoading ? (
							<div>Loading...</div>
						) : this.props.error ? (
							<div>{this.props.error.response.status}</div>
						) : (
							this.props.data.map(user => (
								<tr key={user.user_id}>
									<th scope="row">{user.user_id}</th>
									<td>{user.username}</td>
									<td>{user.email}</td>
								</tr>
							))
						)}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default User;
