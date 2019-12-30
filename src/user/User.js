import React, { Component } from "react";
import { Table } from 'reactstrap';
// import withRequest from "../lib/withRequest";

class User extends Component {
	render() {
		return (
			<div>
				<Table>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>
						{this.props.data === undefined ? (
							<div></div>
						) : (
							this.props.data.map(user => (
								<tr key={user.id}>
									<th scope="row">{user.id}</th>
									<td>{user.name}</td>
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
