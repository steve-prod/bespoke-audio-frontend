import React, { Component } from 'react';
import TagList from './TagList.js';

export default class PublicMessagesList extends Component {
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
        const messages = this.props.messages;
        const messageItems = messages.map(message => (
            <div className="row align-items-center message">
                <div className="align-left col-xs-12 col-sm-8">
                    Tags: <TagList tags={message.tags} />
                    <audio
                        className="received-message"
                        controls='""'
                        src={"/audio/" + message.messageID + ".mp3"}
                    />
                </div>
                <div className="col-xs-12 col-sm-4">
                    <button
                        className="btn btn-primary"
                        type="button"
                        data-from={message.creatorID}
                        data-message={message.messageID}
                        onClick={(e) => {
                            this.handleIsReplyingToPublicChange(true);
                            this.handleIsReplyingPubliclyChange(false);
                            this.handleActiveTabChange("recorder");
                            this.handleMessageIDChange(e.target.dataset.message);
                        }}
                        >
                            Reply
                        </button>
                        <button
                            className="btn btn-danger"
                            type="button"
                            data-from={message.creatorID}
                            data-message={message.messageID}
                            onClick={(e) => {
                                this.handleIsReplyingToPublicChange(true);
                                this.handleIsReplyingPubliclyChange(true);
                                this.handleActiveTabChange("recorder");
                                this.handleMessageIDChange(e.target.dataset.message);
                            }}
                            >
                                Reply All
                            </button>
                        </div>
                    </div>
                ));

                return <ul id="browse-list">{messageItems}</ul>;
    };
}
