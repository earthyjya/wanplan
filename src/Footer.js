import "./scss/Footer.scss";
import React, { Component } from "react";

class Footer extends Component {
  render(){
    return(
      <div className="footer-container">
        <div className="footer-header">Oneplan Team</div>
        <div className="footer-email"> staff@oneplan.com <br/> logo logo logo </div>
        <div className="footer-site-map">Site map</div>
        <div className="footer-question">Got questions? <br/>  Send us message</div>
        <div className="footer-link">  </div>
        <div className="footer-link">
          About us <br/>
          How it works <br/>
          Search plan <br/>
          Create plan
        </div>
        <div className="footer-input">
          <input type="text" placeholder="ชื่อ"/>
          <br/>
          <input type="text" placeholder="ข้อความ..."/>
        </div>
        <div className="footer-link"></div>
        <div className="footer-link"></div>
        <div className="footer-send-button">
          <button>ส่งเลย</button>
        </div>
      </div>

    )
  }
}

export default Footer;
