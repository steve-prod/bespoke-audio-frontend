import React, { Component } from 'react';
import AudioRecorder from './AudioRecorder.js';
import StartRecordingButton from './StartRecordingButton.js';
import StopRecordingButton from './StopRecordingButton.js';
import PlayRecordingButton from './PlayRecordingButton.js';
import RecordingStatusBanner from './RecordingStatusBanner.js';
import StatusTabs from './StatusTabs.js';
import ReplyConsole from './ReplyConsole.js';

export default class Recorder extends Component {
    constructor(props) {
        super(props);
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.handleIsLoadedChange = this.handleIsLoadedChange.bind(this);
        this.handleIsRecordingChange = this.handleIsRecordingChange.bind(this);
        this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
        this.handleRecipientChange = this.handleRecipientChange.bind(this);
        this.handleIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
        this.handleIsReplyingPubliclyChange = this.handleIsReplyingPubliclyChange.bind(this);
        // Initial state is only time both isLoaded and isRecording are false.
        // At all other times, one will be true and the other false.
        this.state = {
            isLoaded: false,
            isRecording: false
        };
        var context = this;
        this.recorder = new AudioRecorder(context);
    }

    handleIsReplyingToPublicChange(isReplyingToPublic) {
        this.props.onIsReplyingToPublicChange(isReplyingToPublic);
    }

    handleIsReplyingPubliclyChange(isReplyingPublicly) {
        this.props.onIsReplyingPubliclyChange(isReplyingPublicly);
    }

    handleRecipientChange(recipient) {
        this.props.onRecipientChange(recipient);
    }

    handleStatusTabChange(tab) {
        this.props.onStatusTabChange(tab);
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

    handleIsLoadedChange(isLoaded) {
        this.setState({isLoaded: isLoaded})
    }

    handleIsRecordingChange(isRecording) {
        this.setState({isRecording: isRecording})
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
            </div>
            {!this.props.isReplyingToPublic && <StatusTabs
                isLoaded={this.state.isLoaded}
                recorder={this.recorder}
                onNeedsRefreshChange={this.handleNeedsRefreshChange}
                statusTab={this.props.statusTab}
                onStatusTabChange={this.handleStatusTabChange}
                recipient={this.props.recipient}
                onRecipientChange={this.handleRecipientChange}
             />}
             {this.props.isReplyingToPublic &&
                 <ReplyConsole
                     messageID={this.props.messageID}
                     isLoaded={this.state.isLoaded}
                     recorder={this.recorder}
                     isReplyingPublicly={this.props.isReplyingPublicly}
                     onIsReplyingPubliclyChange={this.handleIsReplyingPubliclyChange}
                     onNeedsRefreshChange={this.handleNeedsRefreshChange}
                     onIsReplyingToPublicChange={this.handleIsReplyingToPublicChange}
                 />}
        </div>
    );
  }
}
