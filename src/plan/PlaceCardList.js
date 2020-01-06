import React, {Component} from 'react';
import PlaceCard from './PlaceCard';

class PlaceCardList extends React.Component {

  render() {
    const {details} = this.props;
    return <div class = "placeList">{(details.map(detail => {
        return(
          
              <PlaceCard detail = {detail}/>
          
        )
    }))}
        <button >Add</button>
    
    </div>
  }
}

export default PlaceCardList;