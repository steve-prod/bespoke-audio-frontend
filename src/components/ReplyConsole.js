import React, { Component } from 'react';

export default class ReplyConsole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Send",
            buttonClasses: "btn btn-primary",
            tags: ""
        };
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.indicateSuccess = this.indicateSuccess.bind(this);
        this.indicateFailure = this.indicateFailure.bind(this);
        this.resetReplyConsole = this.resetReplyConsole.bind(this);
        this.handleIsReplyingPubliclyChange = this.handleIsReplyingPubliclyChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
    }

    handleIsReplyingToPublicChange(isReplyingToPublic) {
        this.props.onIsReplyingToPublicChange(isReplyingToPublic);
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

    indicateSuccess() {
        this.setState({buttonClasses: "btn btn-outline-success"});
        this.setState({buttonText: "Message Sent"});
        var that = this;
        setTimeout(that.resetReplyConsole, 2000);
    }

    indicateFailure() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-danger"});
        this.setState({buttonText: "Send Failed :("});
        var that = this;
        setTimeout(that.resetReplyConsole, 2000);
    }

    resetReplyConsole() {
        this.setState({buttonClasses: "btn btn-primary"});
        this.setState({buttonText: "Send Reply"});
        this.setState({tags: ""})
    }

    handleIsReplyingPubliclyChange(isReplyingPublicly) {
        this.props.onIsReplyingPubliclyChange(isReplyingPublicly);
    }

    handleTagsChange(tags) {
        this.setState({tags: tags})
    }

    render() {
        return (
            <div id="reply-console">
                <div className={this.props.isReplyingPublicly ? "row" : "row hidden"}>
                <div className="col-xs-12 col-sm-12">
                  <div className="form-group">
                    <label for="reply-tags" className="sr-only">
                      Tags:
                    </label>
                    <input
                      id="reply-tags"
                      type="text"
                      className="form-control"
                      name="tags"
                      placeholder="#tag #topic"
                      onChange={(e) => {
                          this.handleTagsChange(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="align-left col-sm-7">
                  <div className="form-check">
                    <input
                      id="public-radio"
                      type="radio"
                      className="form-check-input"
                      name="is-public"
                      value="true"
                      checked={this.props.isReplyingPublicly}
                      onClick={() => this.handleIsReplyingPubliclyChange(true)}
                    />
                    <label className="form-check-label" for="public-radio">
                      Reply Publicly
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      id="private-radio"
                      type="radio"
                      className="form-check-input"
                      name="is-public"
                      value="false"
                      checked={!this.props.isReplyingPublicly}
                      onClick={() => this.handleIsReplyingPubliclyChange(false)}
                    />
                    <label className="form-check-label" for="private-radio">
                      Reply Privately
                    </label>
                  </div>
                </div>
                <div className="col-sm-5">
                    <button
                        id="btn-cancel-reply"
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                            this.handleIsReplyingToPublicChange(false);
                        }}
                        >
                            Cancel
                        </button>
                      <button
                        id="btn-send-reply"
                        className={this.state.buttonClasses}
                        type="button"
                        onClick={(e) => {
                            var that = this;
                            var formData = new FormData();
                            formData.append("blob", that.props.recorder.blob);
                            formData.append("isPublic", that.props.isReplyingPublicly);
                            if (that.props.isReplyingPublicly) {
                                formData.append("tags", this.state.tags);
                            }
                            var xhr = new XMLHttpRequest();
                            xhr.addEventListener("load", function(event){
                                that.handleNeedsRefreshChange();
                                that.indicateSuccess();
                            });
                            xhr.addEventListener("error", function(event){
                                that.indicateFailure();
                            });
                            xhr.open("POST", "/reply/" + that.props.messageID);
                            xhr.send(formData);
                        }}
                        disabled={!this.props.isLoaded}
                      >
                        {this.state.buttonText}
                      </button>
                  <br />
                </div>
              </div>
              <hr />
              <span id="original-message-span">Original Message:</span>
              <audio src={"/audio/" + this.props.messageID} controls></audio>
            </div>
        );
    }
}
