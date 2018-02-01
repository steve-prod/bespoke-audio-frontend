import React, { Component } from 'react';
import MessageList from './MessageList.js';

export default class Inbox extends Component {
    constructor(props) {
        super(props);
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
        this.handleRecipientChange = this.handleRecipientChange.bind(this);
        this.handleIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
    }

    handleIsReplyingToPublicChange(isReplyingToPublic) {
        this.props.onIsReplyingToPublicChange(isReplyingToPublic);
    }

    handleRecipientChange(recipient) {
        this.props.onRecipientChange(recipient);
    }

    handleActiveTabChange(tab) {
        this.props.onActiveTabChange(tab);
    }

    handleStatusTabChange(tab) {
        this.props.onStatusTabChange(tab);
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

    render() {
        return (
            <div
                className="tab-pane fade show active"
                id="inbox"
                role="tabpanel"
                aria-labelledby="inbox-tab"
                >
                    {this.props.messages.length === 0 && (
                        <h1 className="text-center">No messages</h1>
                    )}
                    {this.props.messages.length > 0 && (
                        <h1 className="text-center">Inbox Messages</h1>
                    )}
                    <MessageList
                        onNeedsRefreshChange={this.handleNeedsRefreshChange}
                        messages={this.props.messages}
                        onActiveTabChange={this.handleActiveTabChange}
                        onStatusTabChange={this.handleStatusTabChange}
                        onRecipientChange={this.handleRecipientChange}
                        onIsReplyingToPublicChange={this.handleIsReplyingToPublicChange}
                    />
                </div>
            );
    }
}
