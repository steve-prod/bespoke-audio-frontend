import React, { Component } from 'react';
import ReplyRecorder from './ReplyRecorder.js';
import Footer from './Footer.js';

export default class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            creatorID: "",
            messageID: "",
            isPublic: false,
            error: "",
            isShowReplyRecorder: false,
            isReplyPublicly: false
        }
        this.handleIsShowReplyRecorderChange = this.handleIsShowReplyRecorderChange.bind(this);
        this.getMessage();
    }

    handleIsShowReplyRecorderChange(isShowReplyRecorder) {
        this.setState({isShowReplyRecorder: isShowReplyRecorder});
    }

    getMessage() {
        var messageID = window.location.pathname.split("/")[2].replace(/[<>!;&]/g, "");
        var messagesXHR = new XMLHttpRequest();
        var that = this;
        messagesXHR.addEventListener('load', function(event) {
            if (event.target.status === 200) {
                var message = JSON.parse(event.target.responseText);
                that.setState({creatorID: message.creatorID});
                that.setState({messageID: message.messageID});
                that.setState({isPublic: message.isPublic});
            }
            if (event.target.status === 401) {
                that.setState({error: "Please log in."});
            }
            if (event.target.status === 403) {
                that.setState({error: "This is not your message."});
            }
            if (event.target.status === 404) {
                that.setState({error: "Message not found. It may have been deleted."});
            }
        });
        messagesXHR.addEventListener('error', function(event) {
          console.log('An error occurred while getting the message:');
          console.log(event);
        });
        messagesXHR.open('GET', '/messages/' + messageID);
        messagesXHR.setRequestHeader('Accept', 'application/json');
        messagesXHR.send();
    }

    render() {
        return (
            <div>
                <main role="main" class="container">
                    <div class="inner cover">
                        <form class="form-layout">
                            {this.state.error &&
                            <h1>{this.state.error}</h1>}
                            {!this.state.error &&
                            <h1>{this.state.isPublic ? "Public" : "Private"} message</h1>}
                            {!this.state.error &&
                            <ul class="no-bullets">
                                <div class="row align-items-center message">
                                    <div class="col-xs-12 col-sm-8">
                                        From: {this.state.creatorID}
                                        <audio id="received-message" controls='""' src={this.state.messageID ? "/audio/" + this.state.messageID + ".mp3" : ""}></audio>
                                    </div>
                                    <div class="col-xs-12 col-sm-4">
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            data-from={this.state.creatorID}
                                            data-message={"/messages/" + this.state.messageID}
                                            onClick={(e) => {
                                                this.setState({isShowReplyRecorder: true})
                                                this.setState({isReplyPublicly: false})
                                            }}
                                            >
                                                Reply
                                            </button>
                                        {!this.state.isPublic &&
                                        <button
                                            className="btn btn-danger"
                                            type="button"
                                            data-message={"/messages/" + this.state.messageID}
                                            data-from={this.state.creatorID}
                                            onClick={(e) => {
                                                var that = this;
                                                var xhr = new XMLHttpRequest();
                                                xhr.addEventListener("load", function(event){
                                                    that.setState({error: "Message Deleted"});
                                                });
                                                xhr.addEventListener("error", function(event){
                                                    alert("An error occurred while deleting the message.");
                                                });
                                                xhr.open("DELETE", this.state.messageID);
                                                xhr.send();
                                            }}
                                            >
                                                Delete
                                            </button>}
                                            {this.state.isPublic &&
                                                <button
                                                    className="btn btn-danger"
                                                    type="button"
                                                    data-from={this.state.creatorID}
                                                    data-message={"/messages/" + this.state.messageID}
                                                    onClick={(e) => {
                                                        this.setState({isReplyPublicly: true})
                                                        this.setState({isShowReplyRecorder: true})
                                                    }}
                                                    >
                                                        Reply All
                                                </button>}
                                    </div>
                                </div>
                                {this.state.isShowReplyRecorder &&
                                    <div>
                                        <ReplyRecorder
                                            isReplyPublicly={this.state.isReplyPublicly}
                                            onIsShowReplyRecorderChange={this.handleIsShowReplyRecorderChange}
                                            recipient={this.state.creatorID} />
                                    </div>
                                }
                            </ul>}
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}
