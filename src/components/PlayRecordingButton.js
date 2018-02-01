import React, { Component } from 'react';

export default class PlayRecordingButton extends Component {
    constructor(props) {
        super(props);
        this.handleIsRecordingChange = this.handleIsRecordingChange.bind(this);
        this.handleIsLoadedChange = this.handleIsLoadedChange.bind(this);
    }

    handleIsRecordingChange(isRecording) {
        this.props.onIsRecordingChange(isRecording);
    }

    handleIsLoadedChange(isLoaded) {
        this.props.onIsLoadedChange(isLoaded);
    }

    render() {
        return (
            <button
              className="btn btn-primary col-xs-12 col-sm-4"
              onClick={() => {
                  document.getElementById("recorded-message").play();
              }}
              type="button"
              disabled={!this.props.isLoaded || this.props.isRecording}
            >
              Play Recording
            </button>
        );
    };
}
