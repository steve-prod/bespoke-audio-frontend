import React, { Component } from 'react';
import StartRecordingButton from './StartRecordingButton.js';
import StopRecordingButton from './StopRecordingButton.js';
import PlayRecordingButton from './PlayRecordingButton.js';
import RecordingStatusBanner from './RecordingStatusBanner.js';
import AudioRecorder from './AudioRecorder.js';

export default class ReplyRecorder extends Component {
    constructor(props) {
        super(props);
        this.handleIsLoadedChange = this.handleIsLoadedChange.bind(this);
        this.handleIsRecordingChange = this.handleIsRecordingChange.bind(this);
        this.handleSendReply = this.handleSendReply.bind(this);
        this.handleIsShowReplyRecorderChange = this.handleIsShowReplyRecorderChange.bind(this);
        // Initial state is only time both isLoaded and isRecording are false.
        // At all other times, one will be true and the other false.
        this.state = {
            isLoaded: false,
            isRecording: false
        };
        var context = this;
        this.recorder = new AudioRecorder(context);
    }

    handleIsShowReplyRecorderChange(isShowReplyRecorderChange) {
        this.props.onIsShowReplyRecorderChange(isShowReplyRecorderChange);
    }

    handleSendReply() {
        if(this.state.isLoaded) {
            var that = this;
            var formData = new FormData();
            formData.append("blob", that.recorder.getBlob());
            formData.append("recipient", that.props.recipient);
            formData.append("isPublic", that.props.isReplyPublicly);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function(event){
                that.handleIsShowReplyRecorderChange(false);
            });
            xhr.addEventListener("error", function(event){
                console.log("error event: ", event);
            });
            xhr.open("POST", "/messages");
            xhr.send(formData);
        } else {
            alert('No message has been recorded.')
        }
    }

    handleIsLoadedChange(isLoaded) {
        this.setState({isLoaded: isLoaded});
    }

    handleIsRecordingChange(isRecording) {
        this.setState({isRecording: isRecording});
    }

    render() {
      return (
          <div>
              <div id="recorder">
                  <StartRecordingButton
                      recorder={this.recorder}
                      isLoaded={this.state.isLoaded}
                      onIsLoadedChange={this.handleIsLoadedChange}
                      isRecording={this.state.isRecording}
                      onIsRecordingChange={this.handleIsRecordingChange}
                  />
                  <StopRecordingButton
                      recorder={this.recorder}
                      isLoaded={this.state.isLoaded}
                      onIsLoadedChange={this.handleIsLoadedChange}
                      isRecording={this.state.isRecording}
                      onIsRecordingChange={this.handleIsRecordingChange}
                  />
                  <PlayRecordingButton
                      recorder={this.recorder}
                      isLoaded={this.state.isLoaded}
                      onIsLoadedChange={this.handleIsLoadedChange}
                      isRecording={this.state.isRecording}
                      onIsRecordingChange={this.handleIsRecordingChange}
                  />
                  <RecordingStatusBanner isRecording={this.state.isRecording}/>
                  <audio id="recorded-message" controls />
                  <button
                      className="btn btn-primary"
                      type="button"
                      onClick={this.handleSendReply}
                  >Send Reply</button>
              </div>
          </div>
      );
    }
}
