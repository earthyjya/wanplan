import React, { Component } from "react";
import axios from "axios";

class FeedbackForm extends Component {
  state = {
    web_rating: 0,
    web_use: null,
    web_comment: null,
  };
  onSatisChange = (e) => {
    this.setState({
      web_rating: e.target.value,
    });
  };

  onUsefulChange = (e) => {
    this.setState({
        web_use: e.target.value,
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
        <div style={{ fontSize: "27px" }}>Feedback form</div>
        <div>
          1.เว็ปไซต์นี้ช่วยเกี่ยวกับการแพลนเที่ยวของคุณมากแค่ไหน (1:น้อยที่สุด,
          5:มากที่สุด)
        </div>
        <select
          className="feedback-input-box"
          value={this.state.web_rating}
          onChange={this.onSatisChange}
        >
          <option value={0}>select</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
        <div>2.หากได้ไปเที่ยวญี่ปุ่นจริงๆ จะใช้เว็ปไซต์เราในการแพลนมั้ย</div>
        <select
          className="feedback-input-box"
          value={this.state.web_use}
          onChange={this.onUsefulChange}
          placeholder="Select"
        >
          <option value={0}>select</option>
          <option value={"yes"}>yes</option>
          <option value={"no"}>no</option>
        </select>
        <div>3.ข้อเสนอที่จะทำให้เว็ปเราดีขึ้น</div>
        <textarea
          type="text"
          className="input-comment-box"
          value={this.state.web_comment}
          onChange={this.onCommentChange}
          cols="40"
          rows="5"
        />
        <button className="save" onClick={this.onSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

export default FeedbackForm;
