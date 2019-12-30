import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

class Share extends React.Component {
  state = {
    URL: null,
    copied: false
  };

  componentDidMount() {
    this.setState({ URL: window.location.href });
  }

  render() {
    return (
      <div className="share-modal-content">
        <div
          style={{ float: "right", cursor: "pointer", fontSize: "25px" }}
          onClick={this.props.close}
        >
          &times;
        </div>
        <div>
          <div>Here is your link!</div>
          <div>
            <input value={this.state.URL} />
          </div>
          <div>
            <CopyToClipboard
              text={this.state.URL}
              onCopy={() => this.setState({ copied: true })}
            >
              <button>Copy</button>
            </CopyToClipboard>
            {this.state.copied ? (
              <span style={{ color: "red" }}>Copied.</span>
            ) : null}
          </div>
          <div>
            <a href="#" class="fa fa-facebook"></a>
            <a href="#" class="fa fa-twitter"></a>
          </div>
        </div>
      </div>
    );
  }
}

export default Share;
