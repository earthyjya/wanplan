import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../scss/Share.scss";

class Share extends React.Component {
  state = {
    URL: null,
    copied: false
  };

  componentDidMount() {
    this.setState({ URL: window.location.href });
  }

  render() {
    const { URL, copied } = this.state;
    return (
      <div className="share-modal-content">
        <div className="close-share-modal" onClick={this.props.closeShareModal}>
          &#10005;
        </div>
        <div>
          <div>Here is your link!</div>
          <div className="copy-bar">
            <input className="url-box" value={"" + URL} readOnly />
            <CopyToClipboard text={URL} onCopy={() => this.setState({ copied: true })}>
              <button className="copy-button">Copy</button>
            </CopyToClipboard>
            {copied ? <span className="copied">Copied</span> : null}
          </div>
          <div>
            <a href="www.facebook.com" className="fa fa-facebook">
              {" "}
            </a>
            <a href="www.twitter.com" className="fa fa-twitter">
              {" "}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Share;
