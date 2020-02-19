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
          style={{
            float: "right",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "900"
          }}
          onClick={this.props.closeShareModal}
        >
          &#10005;
        </div>
        <div>
          <div style={{margin: "10px"}} >Here is your link!</div>
          <div style={{ display: "inline-flex" }}>
            <input
              value={URL}
              style={{
                border: "none",
                borderRadius: "4px 0px 0px 4px",
                width: "300px",
                height: "35px",
                padding: "10px"
              }}
            />
            <CopyToClipboard
              text={URL}
              onCopy={() => this.setState({ copied: true })}
            >
              <button
                style={{
                  border: "none",
                  borderRadius: "0px 4px 4px 0px",
                  backgroundColor: "lightgray",
                  height: "35px"
                }}
              >
                Copy
              </button>
            </CopyToClipboard>
            {copied ? (
              <span
                style={{ color: "lightgray", height: "35px", padding: "5px" }}
              >
                Copied.
              </span>
            ) : null}
          </div>
          <div>
            <a href="" className="fa fa-facebook" />
            <a href="" className="fa fa-twitter" />
          </div>
        </div>
      </div>
    );
  }
}

export default Share;
