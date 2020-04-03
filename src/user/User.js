import React, { Component } from "react";
import { Table } from "reactstrap";
// import withRequest from "../lib/withRequest";

class User extends Component {
	render() {
		if (this.props.isLoading) {
			return <div>Loading...</div>;
		}
		if (this.props.error) {
			return <div>Something Went Wrong :(</div>;
		}
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
						{this.props.data.map((user) => (
							<tr key={user.user_id}>
								<th scope="row">{user.user_id}</th>
								<td>{user.username}</td>
								<td>{user.email}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
}

export default User;
