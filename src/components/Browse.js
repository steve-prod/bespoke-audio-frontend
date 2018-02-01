import React, { Component } from 'react';
import PublicMessagesList from './PublicMessagesList.js';

export default class Browse extends Component {
    constructor(props) {
        super(props);
        this.handleMessageIDChange = this.handleMessageIDChange.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
        this.handleIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
        this.handleIsReplyingPubliclyChange = this.handleIsReplyingPubliclyChange.bind(this);
    }

    handleIsReplyingToPublicChange(isReplyingToPublic) {
        this.props.onIsReplyingToPublicChange(isReplyingToPublic);
    }

    handleIsReplyingPubliclyChange(isReplyingPublicly) {
        this.props.onIsReplyingPubliclyChange(isReplyingPublicly);
    }

    handleActiveTabChange(tab) {
        this.props.onActiveTabChange(tab);
    }

    handleStatusTabChange(tab) {
        this.props.onStatusTabChange(tab);
    }

    handleMessageIDChange(messageID) {
        this.props.onMessageIDChange(messageID);
    }

    render() {
        return (
            <div>
                <h1 className="text-center">Public Messages</h1>
                <PublicMessagesList
                    messages={this.props.messages}
                    onActiveTabChange={this.handleActiveTabChange}
                    onStatusTabChange={this.handleStatusTabChange}
                    onMessageIDChange={this.handleMessageIDChange}
                    onIsReplyingToPublicChange={this.handleIsReplyingToPublicChange}
                    onIsReplyingPubliclyChange={this.handleIsReplyingPubliclyChange}
                    />
            </div>
        );
    }

}
