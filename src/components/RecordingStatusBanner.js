import React from 'react';
export default function RecordingStatusBanner(props) {
    if (props.isRecording) {
        return (
            <div>
        <hr />
            <h1 className="status-recording text-center">
                Recording <img src="/static/css/spinner.svg" alt="spinner" />
            </h1>
            <hr />
        </div>
        );
    } else {
        return (
            <div>
            <hr />
            <h1 className="status-not-recording text-center">
                Not Recording
            </h1>
            <hr />
        </div>
        );
    }

}
