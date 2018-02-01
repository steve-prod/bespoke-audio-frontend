import React, { Component } from 'react';

export default class MessageList extends Component {
    constructor(props) {
        super(props);
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
        this.handleRecipientChange = this.handleRecipientChange.bind(this);
        this.hanldeIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
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
        const messageItems = this.props.messages.map(message => (
            <div className="row align-items-center message">
                <div className="align-left col-xs-12 col-sm-8">
                    From: {message.creatorID}
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
                        data-message={"/messages/" + message.messageID}
                        onClick={(e) => {
                            this.handleIsReplyingToPublicChange(false);
                            this.handleStatusTabChange('private-tab');
                            this.handleActiveTabChange('recorder');
                            this.handleRecipientChange(e.target.dataset.from);
                        }}
                        >
                            Reply
                        </button>
                        <button
                            className="btn btn-danger"
                            type="button"
                            data-message={"/messages/" + message.messageID}
                            onClick={(e) => {
                                var that = this;
                                var xhr = new XMLHttpRequest();
                                xhr.addEventListener("load", function(event){
                                    that.handleNeedsRefreshChange();
                                });
                                xhr.addEventListener("error", function(event){
                                    alert("An error occurred while deleting the message.");
                                });
                                xhr.open("DELETE", e.target.dataset.message);
                                xhr.send();
                            }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ));
        return <ul className="no-bullets">{messageItems}</ul>;
    }

}
