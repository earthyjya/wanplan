import React, { Component } from "react";

class AttCard extends React.Component {
	render() {
		
		return (
			<div className="AttCard">
				{this.props.isLoading ? (
      <div>Loading...</div>
    ) : this.props.error ? (
      <div>{this.props.error.message}</div>
    ) : (
		//{
		//	const data = this.props.data;
		//}
		this.props.data.map(dat => {
          
			return (
				<div key = {dat.atraction_id}>
					<div class = "timeFrom">{this.props.start_time}</div>
					<div class = "timeUntil">{this.props.end_time}</div>
					<h2 class = "attName">{dat.attraction_name}</h2>
					<h3 class = "attType">{dat.attraction_type}</h3>
				</div>
				
				)}))}
			</div>
		);
	}
}

export default AttCard;
