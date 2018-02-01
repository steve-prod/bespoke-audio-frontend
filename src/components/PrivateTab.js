import React, { Component } from 'react';

export default class PrivateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Send",
            buttonClasses: "btn btn-lg btn-primary btn-block"
        };
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.indicateSuccess = this.indicateSuccess.bind(this);
        this.indicateFailure = this.indicateFailure.bind(this);
        this.resetPrivateTab = this.resetPrivateTab.bind(this);
        this.handleRecipientChange = this.handleRecipientChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.handleSendMessage();
        }
    }

    handleRecipientChange(event) {
        this.props.onRecipientChange(event.target.value);
    }

    indicateSuccess() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-success"});
        this.setState({buttonText: "Message Sent"});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    indicateFailure() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-danger"});
        this.setState({buttonText: "Send Failed :("});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    resetPrivateTab() {
        this.setState({buttonClasses: "btn btn-lg btn-primary btn-block"});
        this.setState({buttonText: "Send"});
        this.setState({recipient: ""});
        document.getElementById("recipient").value = "";
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

    handleSendMessage() {
        if(this.props.isLoaded) {
            var that = this;
            var formData = new FormData();
            formData.append("blob", that.props.recorder.getBlob());
            formData.append("recipient", that.props.recipient);
            formData.append("isPublic", false);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function(event){
                that.handleNeedsRefreshChange();
                that.indicateSuccess();
            });
            xhr.addEventListener("error", function(event){
                that.indicateFailure();
            });
            xhr.open("POST", "/messages");
            xhr.send(formData);
        } else {
            alert('No message has been recorded.')
        }
    }

  render() {
    return (
      <div
        className="tab-pane fade show active"
        id="private"
        role="tabpanel"
        aria-labelledby="private-tab"
      >
        <div className="status-instructions">
          Send a private message to the address below.
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12">
            <div className="form-group">
              <label for="recipient" className="sr-only">
                To:
              </label>
              <input
                type="email"
                id="recipient"
                className="form-control"
                name="recipient"
                placeholder="email@address.com"
                value={this.props.recipient}
                onChange={this.handleRecipientChange}
                onKeyPress={(e) => this.handleKeyPress(e)}
                required={this.props.isLoaded}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-sm-offset-4">
            <button
              id="btn-send-recording"
              className={this.state.buttonClasses}
              type="button"
              onClick={this.handleSendMessage}
              disabled={this.props.recipient.indexOf("@") === -1 || !this.props.isLoaded}
            >
              {this.state.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
