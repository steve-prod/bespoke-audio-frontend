import React, { Component } from 'react';

export default class StopRecordingButton extends Component {
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
              onClick={this.props.recorder.stop}
              type="button"
              disabled={!this.props.isRecording}
            >
              Stop Recording
            </button>
        );
    };
}
