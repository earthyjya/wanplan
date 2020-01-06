import React, {Component} from 'react';

class PlaceCard extends React.Component {

  render() {
      const {detail} = this.props
    return (
      <div >
      	This is placeCard
        <div>{detail.attractionName}</div>
        <div>{detail.attractionType}</div>
        <div>{detail.openTime}</div>
        <div>{detail.closeTime}</div>
        <div>{detail.cityId}</div>
        <div>{detail.entryFee}</div>
        <div>{detail.updatedTime}</div>
      </div>
    );
  }
}

export default PlaceCard;