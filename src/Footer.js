import "./scss/Footer.scss";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class Footer extends Component {
  render(){
    return(
      <div className="footer-container">
        <div className="header">Oneplan Team</div>
        <div className="email">
          staff@oneplan.com <br/>
          <FontAwesomeIcon icon={["fab", "facebook-square"]}/>
          <FontAwesomeIcon icon={["fab", "instagram-square"]}/>
          <FontAwesomeIcon icon={["fab", "twitter-square"]}/>
        </div>
        <div className="site-map">Site map</div>
        <div className="question">Got questions? <br/>  Send us message</div>
        <div className="link">  </div>
        <div className="link">
          About us <br/>
          How it works <br/>
          Search plan <br/>
          Create plan
        </div>
        <div className="input">
          <input type="text" placeholder="ชื่อ"/>
          <br/>
          <input type="text" placeholder="ข้อความ..."/>
        </div>
        <div className="send-button">
          <button>ส่งเลย</button>
        </div>
      </div>

    )
  }
}

export default Footer;
