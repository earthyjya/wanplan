import React, { Component } from "react";
import axios from "axios";
import {
  faSadTear,
  faFrown,
  faMeh,
  faGrin,
  faGrinHearts,
  faThumbsDown,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class FeedbackForm extends Component {
  state = {
    web_rating: 0,
    web_use: null,
    web_comment: null,
  };
  // onSatisChange = (e) => {
  //   console.log(e.target.value);
  //   this.setState({
  //     web_rating: e.target.value,
  //   });
  // };

  onSatisChange1 = () => {
    this.setState({
      web_rating: 1,
    });
    console.log(1);
  };

  onSatisChange2 = () => {
    this.setState({
      web_rating: 2,
    });
  };

  onSatisChange3 = () => {
    this.setState({
      web_rating: 3,
    });
  };

  onSatisChange4 = () => {
    this.setState({
      web_rating: 4,
    });
  };

  onSatisChange5 = () => {
    this.setState({
      web_rating: 5,
    });
  };

  onUsefulChange = (e) => {
    this.setState({
      web_use: e.target.value,
    });
  };
  onUsefulChange1 = () => {
    this.setState({
      web_use: "yes",
    });
  };
  onUsefulChange2 = () => {
    this.setState({
      web_use: "no",
    });
  };
  onCommentChange = (e) => {
    this.setState({
      web_comment: e.target.value,
    });
  };

  onSubmit = async () => {
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/response";
    await axios
      .post(url, this.state)
      .then((res) => {
        console.log("post", res);
      })
      .catch((error) => {
        console.log(error);
      });
    this.props.toggleFeedback();
  };

  async componentDidMount() {
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/response";
    await axios
      .get(url)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="feedbackContent">
        <div className="close-feedback" onClick={this.props.toggleFeedback}>
          &#10005;
        </div>
        <div style={{ fontSize: "35px", fontWeight: "bold" }}>Help Us Improve</div>
        <div className="underline"></div>
        <div>
          1.เว็ปไซต์นี้ช่วยเกี่ยวกับการแพลนเที่ยวของคุณมากแค่ไหน
        </div>
        <div className="feedback-input-box">
          <div className="feedback-icon" value={1} onClick={this.onSatisChange1}>
            <FontAwesomeIcon icon={faSadTear} />
          </div>
          <div className="feedback-icon" value={2} onClick={this.onSatisChange2}>
            <FontAwesomeIcon icon={faFrown} />
          </div>
          <div className="feedback-icon" value={3} onClick={this.onSatisChange3}>
            <FontAwesomeIcon icon={faMeh} />
          </div>
          <div className="feedback-icon" value={4} onClick={this.onSatisChange4}>
            <FontAwesomeIcon icon={faGrin} />
          </div>
          <div className="feedback-icon" value={5} onClick={this.onSatisChange5}>
            <FontAwesomeIcon icon={faGrinHearts} />
          </div>
        </div>
        <div>2.หากได้ไปเที่ยวญี่ปุ่นจริงๆ จะใช้เว็ปไซต์เราในการแพลนมั้ย</div>
        <div className="feedback-input-box-2" >
          <div className="feedback-icon" value={"yes"} onClick={this.onUsefulChange1}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </div>
          <div className="feedback-icon" value={"no"} onClick={this.onUsefulChange2}>
            <FontAwesomeIcon icon={faThumbsDown} />
          </div>
         
        </div>
        {/* <select
          className="feedback-input-box"
          value={this.state.web_use}
          onChange={this.onUsefulChange}
          placeholder="Select"
        >
          <option value={0}>select</option>
          <option value={"yes"}>yes</option>
          <option value={"no"}>no</option>
        </select> */}
        <div>3.เหตุผลที่ ใช้/ไม่ใช้ และข้อเสนอแนะเพื่อเติมสำหรับเว็ปของเรา</div>
        <textarea
          type="text"
          className="input-comment-box"
          value={this.state.web_comment}
          onChange={this.onCommentChange}
          cols="40"
          rows="5"
        />
        <button className="Feedback-submit-button" onClick={this.onSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

export default FeedbackForm;
