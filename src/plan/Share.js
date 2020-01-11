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
    const { URL, copied } = this.state;
    return (
      <div className="share-modal-content">
        <div
          style={{ float: "right", cursor: "pointer", fontSize: "20px" }}
          onClick={this.props.close}
        >
          &#10005;
        </div>
        <div>
          <div>Here is your link!</div>
          <div>
            <input value={URL} />
          </div>
          <div>
            <CopyToClipboard
              text={URL}
              onCopy={() => this.setState({ copied: true })}
            >
              <button>Copy</button>
            </CopyToClipboard>
            {copied ? <span style={{ color: "red" }}>Copied.</span> : null}
          </div>
          <div>
            <a href="" class="fa fa-facebook" />
            <a href="" class="fa fa-twitter" />
          </div>
        </div>
      </div>
    );
  }
}

export default Share;
