import React, {Component} from 'react';
import PlaceCard from './PlaceCard';

class PlaceCardList extends React.Component {

  render() {
    const {details} = this.props;
    return (details.map(detail => {
        return(
          <div>
              <PlaceCard detail = {detail}/>
          </div>
        )
    }))
  }
}

export default PlaceCardList;