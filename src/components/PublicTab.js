import React, { Component } from 'react';

export default class PublicTab extends Component {
    constructor(props) {
        super(props);
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            tags: "",
            buttonText: "Publish",
            buttonClasses: "btn btn-lg btn-primary btn-block"
        };
        this.indicateSuccess = this.indicateSuccess.bind(this);
        this.indicateFailure = this.indicateFailure.bind(this);
        this.resetPrivateTab = this.resetPrivateTab.bind(this);
    }

    indicateSuccess() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-success"});
        this.setState({buttonText: "Message Published"});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    indicateFailure() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-danger"});
        this.setState({buttonText: "Publish Failed :("});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    resetPrivateTab() {
        this.setState({buttonClasses: "btn btn-lg btn-primary btn-block"});
        this.setState({buttonText: "Publish"});
        this.setState({tags: ""});
        document.getElementById("tags").value = "";
    }

    handleChange(event) {
        this.setState({tags: event.target.value})
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

  render() {
    return (
      <div
        className="tab-pane fade show active"
        id="public"
        role="tabpanel"
        aria-labelledby="public-tab"
      >
        <div className="status-instructions">
          Share this message publicly with the world.
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12">
            <div className="form-group">
              <label for="tags" className="sr-only">
                Tags:
              </label>
              <input
                type="text"
                id="tags"
                className="form-control"
                name="tags"
                placeholder="#tag #topic"
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-sm-offset-4">
            <button
              id="btn-publish-recording"
              className={this.state.buttonClasses}
              type="button"
              onClick={() => {
                  if(this.props.isLoaded) {
                      var that = this;
                      var formData = new FormData();
                      formData.append("blob", that.props.recorder.getBlob());
                      formData.append("tags", that.state.tags);
                      formData.append("isPublic", true);
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
              }}
              disabled={!this.props.isLoaded}
            >
              {this.state.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
