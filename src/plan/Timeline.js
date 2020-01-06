import React, {Component}from 'react';
import PlaceCardList from './PlaceCardList';

class Timeline extends React.Component {
  state = {
      details : [ 
        {
          attractionName : "name1",
          attractionType : "type1",
          openTime : "01.00",
          closeTime : "11.00",
          cityId : "city1",
          entryFee : "100",
          updatedTime : "time1"
        },
        {
          attractionName : "name2",
          attractionType : "type2",
          openTime : "02.00",
          closeTime : "12.00",
          cityId : "city2",
          entryFee : "200",
          updatedTime : "time2"
        },
        {
          attractionName : "name3",
          attractionType : "type3",
          openTime : "03.00",
          closeTime : "13.00",
          cityId : "city3",
          entryFee : "300",
          updatedTime : "time3"
        }
      ]
  }

  render() {
    return (
      <div >
      	<h1>Your wonderful Trip !!!!!!</h1>
        <PlaceCardList details = {this.state.details}/>
      </div>
    );
  }
}

export default Timeline;