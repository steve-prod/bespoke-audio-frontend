import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from 'classnames';
import lamejs from 'lamejs'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false}
  }

  componentDidMount() {
      var that = this;
      var statusXHR = new XMLHttpRequest();
      statusXHR.addEventListener('load', function(event) {
          if(event.target.status === 200) {
              that.setState({isLoggedIn:true})
          } else {
              that.setState({isLoggedIn:false})
          }
      });
      statusXHR.addEventListener('error', function(event) {
        that.setState({isLoggedIn:false})
      });
      statusXHR.open('GET', '/status');
      statusXHR.send();
  }

  render() {
    var mainScreen = null;
    var menu = <Menu isLoggedIn={this.state.isLoggedIn} />;
    // setup frontend routing
    var pathname = window.location.pathname.split("/")[1].replace(/[\W]/g, "");
    switch (pathname) {
        case "":
            mainScreen = <SignupForm />;
            break;
        case "messages":
            if (window.location.pathname.split("/").length > 2) {
                mainScreen = <Message />;
            } else {
                mainScreen = <Messages />;
            }
            break;
        case "signups":
            mainScreen = <AccountConfirmedScreen />;
            break;
        case "resets":
            mainScreen = <ResetScreen />
            break;
        case "about":
            mainScreen = <About />;
            break;
        default:
            window.location.href = "/"
            break;
    }

    return (
      <div className="App">
        {menu}
        {mainScreen}
      </div>
    );
  }
}

class About extends Component {
    render() {
        return (
            <div>
            <main role="main" className="container">
                <div className="inner cover">
                    <form className="form-layout">
                        <p>Thanks for stopping by.  This web app is meant to be a proof of concept
                        messaging app that I've been thinking about building for a while.  The frontend
                        is written in React and uses Bootstrap 4 and the LAME mp3 encoder (www.mp3dev.org)
                        to convert WAV files to mp3s.  The backend is written in Go and uses Postgres
                        to store user and message data.</p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
        );
    };
}

class AccountConfirmedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleEmailChange(email) {
        this.setState({email: email})
    }

    handlePasswordChange(password) {
        this.setState({password:password})
    }

    render() {
        return (
            <main role="main" class="container">
                <div class="inner cover">
                    <h1 class="cover-heading text-center">Account verified.</h1>
                    <form class="form-signin" method="POST" action="/login">
                        <h2 class="form-signin-heading">Please log in</h2>
                        <label for="email" class="sr-only">Email address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email address"
                            onChange={(e) => this.handleEmailChange(e.target.value)}
                            required autofocus />
                        <label for="password" class="sr-only">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={(e) => this.handlePasswordChange(e.target.value)}
                            required />
                        <button class="btn btn-lg btn-primary btn-block"
                            type="button"
                            onClick={(e) => {
                                var that = this;
                                var formData = new FormData();
                                formData.append("email", that.state.email);
                                formData.append("password", that.state.password);
                                var resetsXHR = new XMLHttpRequest();
                                resetsXHR.addEventListener('load', function(event) {
                                    if (event.target.status === 200) {
                                        window.location.href = "/messages";
                                    } else {
                                        // TODO: alert user login failed
                                    }
                                });
                                resetsXHR.addEventListener('error', function(event) {
                                    // TODO: alert user login failed
                                });
                                resetsXHR.open('POST', '/login');
                                resetsXHR.send(formData);
                            }}
                            >Sign in</button>
                    </form>
                </div>
            </main>
        )
    }
}

class ResetScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coverHeadingText: "Password Reset",
            formSigninHeadingText: "Enter email address of account you want to reset.",
            isShowRequestForm: true,
            isShowResetForm: true,
            email: "",
            resetID: window.location.pathname.split("/").length > 2 && window.location.pathname.split("/")[2].replace(/[\<>!;&]/g, ""),
            password: "",
            samePassword: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSamePasswordChange = this.handleSamePasswordChange.bind(this);
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    handleSamePasswordChange(event) {
        this.setState({samePassword: event.target.value})
    }

    handleChange(e) {
        if(e.target.value.indexOf("@") !== -1) {
            this.setState({email: e.target.value}) // API handles whitelisting
        }
    }
    render() {
        var properForm;
        if (window.location.pathname.split("/").length === 2) { // render reset request form
            properForm = (
                <div>
                    <main role="main" class="container">
                        <div class="inner cover">
                            <h1 class="cover-heading text-center">{this.state.coverHeadingText}</h1>
                            <h2 class="form-signin-heading text-center">{this.state.formSigninHeadingText}</h2>
                            {this.state.isShowRequestForm &&
                            <form class="form-signin">
                                <label for="email" class="sr-only">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    class="form-control"
                                    placeholder="Email address"
                                    onChange={(e) => this.handleChange(e)}
                                    required autofocus />
                                <button
                                    className="btn btn-lg btn-primary btn-block"
                                    type="button"
                                    onClick={() => {
                                        var that = this;
                                        var formData = new FormData();
                                        formData.append("email", this.state.email);
                                        var resetsXHR = new XMLHttpRequest();
                                        resetsXHR.addEventListener('load', function(event) {
                                            if (event.target.status === 201) {
                                                that.setState({coverHeadingText: "Reset link sent."})
                                                that.setState({formSigninHeadingText: "Please click the link in the email sent to the address indicated. It may have gone to your spam folder."})
                                                that.setState({isShowRequestForm: false})
                                            } else {
                                                that.setState({coverHeadingText: "There was an error creating password reset request."})
                                                that.setState({formSigninHeadingText: "Please try again later."})
                                                that.setState({isShowRequestForm: false})
                                            }
                                        });
                                        resetsXHR.addEventListener('error', function(event) {
                                            that.setState({coverHeadingText: "There was an error creating password reset request."})
                                            that.setState({formSigninHeadingText: "Please try again later."})
                                            that.setState({isShowRequestForm: false})
                                        });
                                        resetsXHR.open('POST', '/resets');
                                        resetsXHR.send(formData);
                                    }}
                                    >Request Reset</button>
                                </form>}
                            </div>
                        </main>
                        <Footer />
                    </div>
            );
        } else {
            properForm = (
                <main role="main" class="container">
                    <div class="inner cover">
                        <h1 class="cover-heading text-center">Password Reset</h1>
                        <h2 class="form-signin-heading text-center">Enter email address of account you want to reset.</h2>
                        {this.state.isShowResetForm &&
                        <form class="form-reset">
                            <label for="new-password" class="sr-only">New Password</label>
                            <input
                                type="password"
                                name="new-password"
                                class="form-control"
                                placeholder="New Password"
                                onChange={(e) => this.handlePasswordChange(e)}
                                required autofocus />
                            <label for="same-password" class="sr-only">Same Password Again</label>
                            <input
                                type="password"
                                name="same-password"
                                class="form-control"
                                placeholder="Same Password Again"
                                onChange={(e) => this.handleSamePasswordChange(e)}
                                required />
                            <button
                                className="btn btn-lg btn-primary btn-block"
                                type="button"
                                onClick={(event) => {
                                    var that = this;
                                    console.log(that.state.resetID);
                                    if (this.state.password === this.state.samePassword) {
                                        var that = this;
                                        var formData = new FormData();
                                        formData.append("password", that.state.password);
                                        var resetsXHR = new XMLHttpRequest();
                                        resetsXHR.addEventListener('load', function(event) {
                                            if (event.target.status === 200) {
                                                that.setState({coverHeadingText: "Your password has been reset."})
                                                that.setState({formSigninHeadingText: "Please log in."})
                                                that.setState({isShowResetForm: false})
                                            } else {
                                                that.setState({coverHeadingText: "There was an error resetting your password."})
                                                that.setState({formSigninHeadingText: "Please try again later."})
                                                that.setState({isShowResetForm: false})
                                            }
                                        });
                                        resetsXHR.addEventListener('error', function(event) {
                                            that.setState({coverHeadingText: "There was an error creating password reset request."})
                                            that.setState({formSigninHeadingText: "Please try again later."})
                                            that.setState({isShowResetForm: false})
                                        });
                                        resetsXHR.open('POST', '/resets/' + that.state.resetID);
                                        resetsXHR.send(formData);
                                    } else {
                                        // TODO: notify user that passwords don't match
                                        alert("Passwords don't match");
                                    }

                                }}>Request Reset</button>
                        </form>}
                        {!this.state.isShowResetForm &&
                            <form class="form-signin" method="POST" action="/login">
                                <h2 class="form-signin-heading">Please log in</h2>
                                <label for="email" class="sr-only">Email address</label>
                                <input type="email" name="email" class="form-control" placeholder="Email address" required autofocus />
                                <label for="password" class="sr-only">Password</label>
                                <input type="password" name="password" class="form-control" placeholder="Password" required />
                                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                            </form>
                        }
                        </div>
                    </main>
            );
        }
            return <div>{properForm}</div>;
        }
};

function getMessage() {
    var messageID = window.location.pathname.split("/")[1].replace(/[\W=]/g, "");
    var messagesXHR = new XMLHttpRequest();
    messagesXHR.addEventListener('load', function(event) {
      console.log(messagesXHR.responseText);
      return [];
      // var publicMessages = {};
      // publicMessages.raw = messagesXHR.responseText;
      // publicMessages.raw = publicMessages.raw.slice(2,publicMessages.raw.length-2);
      // publicMessages.raw = publicMessages.raw.split("},{");
      // publicMessages.mArray = [];
      // publicMessages.raw.forEach(function(v, i) {
      //     var line = v.split(",");
      //     var message = {};
      //     if(v != "") {
      //         message.id = JSON.parse(line[0].split(":")[1]);
      //         message.tags = atob(JSON.parse(line[1].split(":")[1]));
      //         message.tags = message.tags.slice(2,message.tags.length-2).split(",");
      //         publicMessages.mArray.push(message);
      //     }
      //     delete line;
      // })
      // delete publicMessages.raw;
      // // Add a div for each public message
      // publicMessages.mArray.forEach(function(v,i) {
      //     addMessage(v);
      // })
    });
    messagesXHR.addEventListener('error', function(event) {
      console.log('An error occurred while deleting the message.');
      return [];
    });
    messagesXHR.open('GET', '/messages/' + messageID);
    messagesXHR.send();
}

function Message() {
    const message = getMessage();
        return (
            <div>
            <main role="main" class="container">
                <div class="inner cover">
                    <form class="form-layout">
                        <ul class="no-bullets">
                            <div class="row align-items-center message">
                                <div class="col-xs-12 col-sm-7">
                                    From: {message.CreatorID}
                                    <audio id="received-message" controls="" src={"/audio/" + message.MessageID + ".mp3"}></audio>
                                </div>
                                <div class="col-xs-12 col-sm-5">
                                    <button id="btn-messages" class="btn btn-primary" type="button" onclick='gotoMessages(event)'>Messages</button>
                                    <button id="btn-delete" class="btn btn-danger" type="button" data-from={message.CreatorID} data-message={"/messages/" + message.MessageID} onclick='deleteMessage(event)'>Delete</button>
                                </div>
                            </div>
                        </ul>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
        );
}

class Messages extends Component {
  render() {
    return (
      <div>
        <main role="main" className="container">
          <div className="inner cover">
            <form className="form-layout">
              <MessageTabs />
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

class MessageTabs extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'inbox',
            statusTab: 'private-tab',
            messages: [],
            public: [],
            needsRefresh: false,
            recipient: "",
            messageID: "",
            isReplyingToPublic: false,
            isReplyingPublicly: false
        };
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handleRecipientChange = this.handleRecipientChange.bind(this);
        this.handleMessageIDChange = this.handleMessageIDChange.bind(this);
        this.handleIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
        this.handleIsReplyingPubliclyChange = this.handleIsReplyingPubliclyChange.bind(this);
    }

    handleIsReplyingToPublicChange(isReplyingToPublic) {
        this.setState({isReplyingToPublic: isReplyingToPublic});
    }

    handleIsReplyingPubliclyChange(isReplyingPublicly) {
        this.setState({isReplyingPublicly: isReplyingPublicly});
    }

    handleMessageIDChange(messageID) {
        this.setState({messageID: messageID});
    }

    handleRecipientChange(recipient) {
        this.setState({recipient: recipient})
    }

    handleActiveTabChange(tab) {
        this.toggle(tab);
    }

    handleStatusTabChange(tab) {
        if (this.state.statusTab !== tab) {
            this.setState({
                statusTab: tab
            })
        }
    }

    handleNeedsRefreshChange() {
        this.refreshMessages();
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentDidMount() {
        this.refreshMessages();
    }

    refreshMessages() {
        var that = this;

        // get private messages
        var messagesXHR = new XMLHttpRequest();
        messagesXHR.addEventListener('load', function(event) {
            if (event.target.responseText === "[]") {
                that.setState({messages:[]});
            } else {
                var messages = {};
                messages.raw = messagesXHR.responseText;
                messages.raw = messages.raw.slice(2,messages.raw.length-2); // Remove leading [{ and trailing }]
                messages.raw = messages.raw.split("},{");
                messages.mArray = [];
                var line;
                messages.raw.forEach(function(v, i) {
                    line = v.split(",");
                    var message = {};
                    message.creatorID = JSON.parse(line[0].split(":")[1]);
                    message.messageID = JSON.parse(line[1].split(":")[1]);
                    messages.mArray.push(message);
                });
                that.setState({messages:messages.mArray});
            }
        });
        messagesXHR.addEventListener('error', function(event) {
          that.setState({messages:[]})
        });
        messagesXHR.open('GET', '/messages');
        messagesXHR.setRequestHeader('Accept', 'application/json');
        messagesXHR.send();

        // get public
        var publicXHR = new XMLHttpRequest();
        publicXHR.addEventListener('load', function(event) {
            if(event.target.responseText === "[]") {
                that.setState({public:[]});
            } else {
                var messages = {};
                messages.raw = event.target.responseText;
                messages.raw = messages.raw.slice(2,messages.raw.length-2); // Remove leading [{ and trailing }]
                messages.raw = messages.raw.split("},{");
                messages.mArray = [];
                var line;
                messages.raw.forEach(function(v, i) {
                    line = v.split(",");
                    var message = {};
                    message.messageID = JSON.parse(line[0].split(":")[1]);
                    message.tags = atob(JSON.parse(line[1].split(":")[1]));
                    message.tags = message.tags.slice(2, message.tags.length - 2).split(',');
                    messages.mArray.push(message);
                });
                that.setState({public:messages.mArray});
            }
        });
        publicXHR.addEventListener('error', function(event) {
          that.setState({public:[]})
        });
        publicXHR.open('GET', '/public');
        publicXHR.send();
    }

  render() {
    return (
      <div>
         <Nav tabs>
           <NavItem>
             <NavLink
               className={classnames({ active: this.state.activeTab === 'inbox' })}
               onClick={() => { this.toggle('inbox'); }}
             >
               Inbox
             </NavLink>
           </NavItem>
           <NavItem>
             <NavLink
               className={classnames({ active: this.state.activeTab === 'recorder' })}
               onClick={() => { this.toggle('recorder'); }}
             >
               Record
             </NavLink>
           </NavItem>
           <NavItem>
             <NavLink
               className={classnames({ active: this.state.activeTab === 'browse' })}
               onClick={() => { this.toggle('browse'); }}
             >
               Browse
             </NavLink>
           </NavItem>
         </Nav>
         <TabContent activeTab={this.state.activeTab}>
           <TabPane tabId="inbox">
             <Row>
               <Col sm="12">
                 <Inbox
                     onNeedsRefreshChange={this.handleNeedsRefreshChange}
                     messages={this.state.messages}
                     onStatusTabChange={this.handleStatusTabChange}
                     onActiveTabChange={this.handleActiveTabChange}
                     onRecipientChange={this.handleRecipientChange}
                     onIsReplyingToPublicChange={this.handleIsReplyingToPublicChange}
                 />
               </Col>
             </Row>
           </TabPane>
           <TabPane tabId="recorder">
             <Row>
               <Col sm="12">
                 <Recorder
                     onNeedsRefreshChange={this.handleNeedsRefreshChange}
                     statusTab={this.state.statusTab}
                     onStatusTabChange={this.handleStatusTabChange}
                     recipient={this.state.recipient}
                     onRecipientChange={this.handleRecipientChange}
                     isReplyingToPublic={this.state.isReplyingToPublic}
                     isReplyingPublicly={this.state.isReplyingPublicly}
                     onIsReplyingToPublicChange={this.handleIsReplyingToPublicChange}
                     onIsReplyingPubliclyChange={this.handleIsReplyingPubliclyChange}
                     messageID={this.state.messageID}
                 />
               </Col>
             </Row>
           </TabPane>
           <TabPane tabId="browse">
             <Row>
               <Col sm="12">
                 <Browse
                     messages={this.state.public}
                     onStatusTabChange={this.handleStatusTabChange}
                     onActiveTabChange={this.handleActiveTabChange}
                     onMessageIDChange={this.handleMessageIDChange}
                     onIsReplyingToPublicChange={this.handleIsReplyingToPublicChange}
                     onIsReplyingPubliclyChange={this.handleIsReplyingPubliclyChange}
                 />
               </Col>
             </Row>
           </TabPane>
         </TabContent>
       </div>
    );
  }
}

class Browse extends Component {
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

class PublicMessagesList extends Component {
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

function TagList(props) {
  const tags = props.tags.map(function(tag) {
      return tag = '#' + tag;
  }).join(' ');
  return tags;
}

// The AudioRecorder function below is based on Daniel Storey's webrtc-audio-recording
// https://github.com/danielstorey/webrtc-audio-recording
// which is in turn based on Muaz Khan's RecordRTC Repository
// https://github.com/muaz-khan/RecordRTC
function AudioRecorder(context) {
    var self = this;
    var mediaStream, audioInput, jsAudioNode, messageBlob;
    var bufferSize = 4096;
    var sampleRate = 44100;
    var numberOfAudioChannels = 1;
    var leftChannel = [];
    var recordingLength = 0;

    var kbps = 32; // originally encoded to 128kbps mp3
    var mp3encoder = new lamejs.Mp3Encoder(numberOfAudioChannels, sampleRate, kbps);
    var mp3Data = [];
    var samples;
    var sampleBlockSize = 1152;

    this.start = function() {
        messageBlob = null;
        setupStorage();
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(onMicrophoneCaptured)
        .catch(onMicrophoneCaptureError);
    };

    this.stop = function() {
        stopRecording(function(blob) {
            messageBlob = blob
            document.getElementById("recorded-message").src = URL.createObjectURL(blob);
        });
    };

    this.getBlob = function () {
            return messageBlob;
    }

    function stopRecording(callback) {
        context.handleIsRecordingChange(false);
        context.handleIsLoadedChange(true);
        audioInput.disconnect(); // to make sure onaudioprocess stops firing
        jsAudioNode.disconnect();

        mergeLeftRightBuffers({
            sampleRate: sampleRate,
            internalInterleavedLength: recordingLength,
            leftBuffers: leftChannel
        }, function(buffer, view) {
            samples = new Int16Array(view.buffer)
            var sampleChunk, mp3buf;
            for (var i = 0; i < samples.length; i += sampleBlockSize) {
                sampleChunk = samples.subarray(i, i + sampleBlockSize);
                mp3buf = mp3encoder.encodeBuffer(sampleChunk);
                if (mp3buf.length > 0) mp3Data.push(mp3buf);
            }
            mp3buf = mp3encoder.flush();
            if (mp3buf.length > 0) mp3Data.push(new Int8Array(mp3buf));
            self.blob = new Blob(mp3Data, {type: 'audio/mp3'});
            callback(self.blob);
            clearRecordedData();
        });
    }

    function clearRecordedData() {
        leftChannel = [];
        recordingLength = 0;
        mp3Data = [];
    }

    function CreateStorageException(message) {
        this.message = message;
        this.name = 'CreateStorageException';
    }

    function setupStorage() {
        Storage.context = new AudioContext();
        if (Storage.context.createJavaScriptNode) {
            jsAudioNode = Storage.context.createJavaScriptNode(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
        } else if (Storage.context.createScriptProcessor) {
            jsAudioNode = Storage.context.createScriptProcessor(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
        } else {
            throw new CreateStorageException('WebAudio API has no support on this browser.');
        }
        jsAudioNode.connect(Storage.context.destination);
    }

    function onMicrophoneCaptured(microphone) {
        mediaStream = microphone;
        audioInput = Storage.context.createMediaStreamSource(microphone);
        audioInput.connect(jsAudioNode);
        jsAudioNode.onaudioprocess = onAudioProcess;
        context.handleIsRecordingChange(true);
        context.handleIsLoadedChange(false);
    }

    function onMicrophoneCaptureError(err) {
        console.log("There was an error accessing the microphone. You may need to allow the browser access.");
        console.log(err)
    }

    function onAudioProcess(e) {
        if (!context.state.isRecording) return;
        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                console.log('MediaStream has stopped.');
                return;
            }
        } else if ('ended' in mediaStream) { // old hack
            if (mediaStream.ended) {
                console.log('MediaStream has stopped.');
                return;
            }
        }
        leftChannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
        recordingLength += bufferSize;
        self.recordingLength = recordingLength;
    }

    function mergeLeftRightBuffers(config, callback) {
        function mergeAudioBuffers(config, cb) {
            var leftBuffers = config.leftBuffers;
            var sampleRate = config.sampleRate;
            var internalInterleavedLength = config.internalInterleavedLength;
            var desiredSampRate = config.desiredSampRate;

            leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
            if (desiredSampRate) leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
            if (desiredSampRate) sampleRate = desiredSampRate;
            var buffer = new ArrayBuffer(leftBuffers.length * 2);
            var view = new DataView(buffer);

            // write the pulse-code modulation (PCM) samples
            var index = 0;
            for (var i = 0; i < leftBuffers.length; i++) {
                view.setInt16(index, leftBuffers[i] * 0x7FFF, true);
                index += 2;
            }

            if (cb) return cb({buffer: buffer,view: view});

            postMessage({buffer: buffer,view: view});

            // **************** End mergeAudioBuffers code *********************
            // **************** Begin web worker functions *********************
            // for changing the sampling rate, reference:
            // http://stackoverflow.com/a/28977136/552182
            function interpolateArray(data, newSampleRate, oldSampleRate) {
                var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
                var newData = [];
                var springFactor = Number((data.length - 1) / (fitCount - 1));
                newData[0] = data[0]; // for new allocation
                var tmp, before, after, atPoint;
                for (var i = 1; i < fitCount - 1; i++) {
                    tmp = i * springFactor;
                    before = Number(Math.floor(tmp)).toFixed();
                    after = Number(Math.ceil(tmp)).toFixed();
                    atPoint = tmp - before;
                    newData[i] = data[before] + (data[after] - data[before]) * atPoint; // linearly interpolate
                }
                newData[fitCount - 1] = data[data.length - 1]; // for new allocation
                return newData;
            }

            function mergeBuffers(channelBuffer, rLength) {
                var result = new Float64Array(rLength);
                var offset = 0;
                for (var i = 0; i < channelBuffer.length; i++) {
                    result.set(channelBuffer[i], offset);
                    offset += channelBuffer[i].length;
                }
                return result;
            }
        }

        var webWorker = processInWebWorker(mergeAudioBuffers);
        webWorker.onmessage = function(event) {
            callback(event.data.buffer, event.data.view);
            URL.revokeObjectURL(webWorker.workerURL); // release memory
        };
        webWorker.postMessage(config);
    }

    function processInWebWorker(_function) {
        var workerURL = URL.createObjectURL(new Blob([_function.toString(),
            ';this.onmessage =  function (e) {' + _function.name + '(e.data);}'
        ], {type: 'application/javascript'}));
        var worker = new Worker(workerURL);
        worker.workerURL = workerURL;
        return worker;
    }
}

class StartRecordingButton extends Component {
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
              onClick={this.props.recorder.start}
              type="button"
              disabled={this.props.isRecording}
            >
              Start Recording
            </button>
        );
    };
}

class StopRecordingButton extends Component {
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

class PlayRecordingButton extends Component {
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

function RecordingStatusBanner(props) {
    if (props.isRecording) {
        return (
            <div>
        <hr />
            <h1 className="status-recording text-center">
                Recording <img src="static/css/spinner.svg" alt="spinner" />
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

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.Storage = {};
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
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

class ReplyConsole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Send",
            buttonClasses: "btn btn-primary",
            tags: ""
        };
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.indicateSuccess = this.indicateSuccess.bind(this);
        this.indicateFailure = this.indicateFailure.bind(this);
        this.resetReplyConsole = this.resetReplyConsole.bind(this);
        this.handleIsReplyingPubliclyChange = this.handleIsReplyingPubliclyChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
    }

    handleIsReplyingToPublicChange(isReplyingToPublic) {
        this.props.onIsReplyingToPublicChange(isReplyingToPublic);
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

    indicateSuccess() {
        this.setState({buttonClasses: "btn btn-outline-success"});
        this.setState({buttonText: "Message Sent"});
        var that = this;
        setTimeout(that.resetReplyConsole, 2000);
    }

    indicateFailure() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-danger"});
        this.setState({buttonText: "Send Failed :("});
        var that = this;
        setTimeout(that.resetReplyConsole, 2000);
    }

    resetReplyConsole() {
        this.setState({buttonClasses: "btn btn-primary"});
        this.setState({buttonText: "Send Reply"});
        this.setState({tags: ""})
    }

    handleIsReplyingPubliclyChange(isReplyingPublicly) {
        this.props.onIsReplyingPubliclyChange(isReplyingPublicly);
    }

    handleTagsChange(tags) {
        this.setState({tags: tags})
    }

    render() {
        return (
            <div id="reply-console">
                <div className={this.props.isReplyingPublicly ? "row" : "row hidden"}>
                <div className="col-xs-12 col-sm-12">
                  <div className="form-group">
                    <label for="reply-tags" className="sr-only">
                      Tags:
                    </label>
                    <input
                      id="reply-tags"
                      type="text"
                      className="form-control"
                      name="tags"
                      placeholder="#tag #topic"
                      onChange={(e) => {
                          this.handleTagsChange(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="align-left col-sm-7">
                  <div className="form-check">
                    <input
                      id="public-radio"
                      type="radio"
                      className="form-check-input"
                      name="is-public"
                      value="true"
                      checked={this.props.isReplyingPublicly}
                      onClick={() => this.handleIsReplyingPubliclyChange(true)}
                    />
                    <label className="form-check-label" for="public-radio">
                      Reply Publicly
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      id="private-radio"
                      type="radio"
                      className="form-check-input"
                      name="is-public"
                      value="false"
                      checked={!this.props.isReplyingPublicly}
                      onClick={() => this.handleIsReplyingPubliclyChange(false)}
                    />
                    <label className="form-check-label" for="private-radio">
                      Reply Privately
                    </label>
                  </div>
                </div>
                <div className="col-sm-5">
                    <button
                        id="btn-cancel-reply"
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                            this.handleIsReplyingToPublicChange(false);
                        }}
                        >
                            Cancel
                        </button>
                      <button
                        id="btn-send-reply"
                        className={this.state.buttonClasses}
                        type="button"
                        onClick={(e) => {
                            var that = this;
                            var formData = new FormData();
                            formData.append("blob", that.props.recorder.blob);
                            formData.append("isPublic", that.props.isReplyingPublicly);
                            if (that.props.isReplyingPublicly) {
                                formData.append("tags", this.state.tags);
                            }
                            var xhr = new XMLHttpRequest();
                            xhr.addEventListener("load", function(event){
                                that.handleNeedsRefreshChange();
                                that.indicateSuccess();
                            });
                            xhr.addEventListener("error", function(event){
                                that.indicateFailure();
                            });
                            xhr.open("POST", "/reply/" + that.props.messageID);
                            xhr.send(formData);
                        }}
                        disabled={!this.props.isLoaded}
                      >
                        {this.state.buttonText}
                      </button>
                  <br />
                </div>
              </div>
              <hr />
              <span id="original-message-span">Original Message:</span>
              <audio src={"/audio/" + this.props.messageID} controls></audio>
            </div>
        );
    }
}

class PrivateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Send",
            buttonClasses: "btn btn-lg btn-primary btn-block"
        };
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.indicateSuccess = this.indicateSuccess.bind(this);
        this.indicateFailure = this.indicateFailure.bind(this);
        this.resetPrivateTab = this.resetPrivateTab.bind(this);
        this.handleRecipientChange = this.handleRecipientChange.bind(this);
    }

    handleRecipientChange(event) {
        this.props.onRecipientChange(event.target.value);
    }

    indicateSuccess() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-success"});
        this.setState({buttonText: "Message Sent"});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    indicateFailure() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-danger"});
        this.setState({buttonText: "Send Failed :("});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    resetPrivateTab() {
        this.setState({buttonClasses: "btn btn-lg btn-primary btn-block"});
        this.setState({buttonText: "Send"});
        this.setState({recipient: ""});
        document.getElementById("recipient").value = "";
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

  render() {
    return (
      <div
        className="tab-pane fade show active"
        id="private"
        role="tabpanel"
        aria-labelledby="private-tab"
      >
        <div className="status-instructions">
          Send a private message to the address below.
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12">
            <div className="form-group">
              <label for="recipient" className="sr-only">
                To:
              </label>
              <input
                type="email"
                id="recipient"
                className="form-control"
                name="recipient"
                placeholder="email@address.com"
                value={this.props.recipient}
                onChange={this.handleRecipientChange}
                required={this.props.isLoaded}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-sm-offset-4">
            <button
              id="btn-send-recording"
              className={this.state.buttonClasses}
              type="button"
              onClick={() => {
                  if(this.props.isLoaded) {
                      var that = this;
                      var formData = new FormData();
                      formData.append("blob", that.props.recorder.getBlob());
                      formData.append("recipient", that.props.recipient);
                      formData.append("isPublic", false);
                      var xhr = new XMLHttpRequest();
                      xhr.addEventListener("load", function(event){
                          that.handleNeedsRefreshChange();
                          that.indicateSuccess();
                      });
                      xhr.addEventListener("error", function(event){
                          that.indicateFailure();
                      });
                      xhr.open("POST", "/messages");
                      xhr.send(formData);
                  } else {
                      alert('No message has been recorded.')
                  }
              }}
              disabled={this.props.recipient.indexOf("@") === -1 || !this.props.isLoaded}
            >
              {this.state.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class PublicTab extends Component {
    constructor(props) {
        super(props);
        this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            tags: "",
            buttonText: "Publish",
            buttonClasses: "btn btn-lg btn-primary btn-block"
        };
        this.indicateSuccess = this.indicateSuccess.bind(this);
        this.indicateFailure = this.indicateFailure.bind(this);
        this.resetPrivateTab = this.resetPrivateTab.bind(this);
    }

    indicateSuccess() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-success"});
        this.setState({buttonText: "Message Published"});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    indicateFailure() {
        this.setState({buttonClasses: "btn btn-lg btn-outline-danger"});
        this.setState({buttonText: "Publish Failed :("});
        var that = this;
        setTimeout(that.resetPrivateTab, 2000);
    }

    resetPrivateTab() {
        this.setState({buttonClasses: "btn btn-lg btn-primary btn-block"});
        this.setState({buttonText: "Publish"});
        this.setState({tags: ""});
        document.getElementById("tags").value = "";
    }

    handleChange(event) {
        this.setState({tags: event.target.value})
    }

    handleNeedsRefreshChange() {
        this.props.onNeedsRefreshChange();
    }

  render() {
    return (
      <div
        className="tab-pane fade show active"
        id="public"
        role="tabpanel"
        aria-labelledby="public-tab"
      >
        <div className="status-instructions">
          Share this message publicly with the world.
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12">
            <div className="form-group">
              <label for="tags" className="sr-only">
                Tags:
              </label>
              <input
                type="text"
                id="tags"
                className="form-control"
                name="tags"
                placeholder="#tag #topic"
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-sm-offset-4">
            <button
              id="btn-publish-recording"
              className={this.state.buttonClasses}
              type="button"
              onClick={() => {
                  if(this.props.isLoaded) {
                      var that = this;
                      var formData = new FormData();
                      formData.append("blob", that.props.recorder.getBlob());
                      formData.append("tags", that.state.tags);
                      formData.append("isPublic", true);
                      var xhr = new XMLHttpRequest();
                      xhr.addEventListener("load", function(event){
                          that.handleNeedsRefreshChange();
                          that.indicateSuccess();
                      });
                      xhr.addEventListener("error", function(event){
                          that.indicateFailure();
                      });
                      xhr.open("POST", "/messages");
                      xhr.send(formData);
                  } else {
                      alert('No message has been recorded.')
                  }
              }}
              disabled={!this.props.isLoaded}
            >
              {this.state.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class StatusTabs extends Component {
      constructor(props) {
          super(props);
          this.toggle = this.toggle.bind(this);
          this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
          this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
          this.handleRecipientChange = this.handleRecipientChange.bind(this);
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

      toggle(tab) {
          this.handleStatusTabChange(tab);
      }

      componentDidMount() {

      }

  render() {
    return (
      <div>
         <Nav tabs>
           <NavItem>
             <NavLink
               className={classnames({ active: this.props.statusTab === 'private-tab' })}
               onClick={() => { this.toggle('private-tab'); }}
             >
               Private
             </NavLink>
           </NavItem>
           <NavItem>
             <NavLink
               className={classnames({ active: this.props.statusTab === 'public-tab' })}
               onClick={() => { this.toggle('public-tab'); }}
             >
               Public
             </NavLink>
           </NavItem>
         </Nav>
         <TabContent activeTab={this.props.statusTab}>
           <TabPane tabId="private-tab">
             <Row>
               <Col sm="12">
                   <PrivateTab
                       isLoaded={this.props.isLoaded}
                       recorder={this.props.recorder}
                       onNeedsRefreshChange={this.handleNeedsRefreshChange}
                       recipient={this.props.recipient}
                       onRecipientChange={this.handleRecipientChange}
                   />
               </Col>
             </Row>
           </TabPane>
           <TabPane tabId="public-tab">
             <Row>
               <Col sm="12">
                   <PublicTab
                       isLoaded={this.props.isLoaded}
                       recorder={this.props.recorder}
                       onNeedsRefreshChange={this.handleNeedsRefreshChange}
                   />
               </Col>
             </Row>
           </TabPane>
         </TabContent>
       </div>
    );
  }
}

class Inbox extends Component {
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

class MessageList extends Component {
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

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <span className="text-muted">&copy;Bespoke-Audio 2018</span>
        </div>
      </footer>
    );
  }
}

class Menu extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar
          color="faded"
          className="navbar-dark bg-dark fixed-top"
          expand="md"
        >
          <img src={logo} className="App-logo" alt="logo" />
          <NavbarBrand href="/">Bespoke-Audio</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <PrimaryNav />
            {this.props.isLoggedIn ? <LogoutForm /> : <LoginForm />}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

class LogoutForm extends Component {
  render() {
    return (
      <form className="form-inline">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/logout">
              Logout
            </a>
          </li>
        </ul>
      </form>
    );
  }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleEmailChange(email) {
        this.setState({email: email})
    }

    handlePasswordChange(password) {
        this.setState({password:password})
    }

  render() {
    return (
      <form className="form-inline my-2 my-lg-0" >
        <input
          className="form-control mr-sm-2"
          type="email"
          name="email"
          placeholder="Email"
          aria-label="Email"
          onChange={(e) => this.handleEmailChange(e.target.value)}
        />
        <input
          className="form-control mr-sm-2"
          type="password"
          name="password"
          placeholder="Password"
          aria-label="Password"
          onChange={(e) => this.handlePasswordChange(e.target.value)}
        />
        <button
            className="btn btn-primary"
            type="button"
            onClick={(e) => {
                var that = this;
                var formData = new FormData();
                formData.append("email", that.state.email);
                formData.append("password", that.state.password);
                var resetsXHR = new XMLHttpRequest();
                resetsXHR.addEventListener('load', function(event) {
                    if (event.target.status === 200) {
                        window.location.href = "/messages";
                    } else {
                        // TODO: alert user login failed
                    }
                });
                resetsXHR.addEventListener('error', function(event) {
                    // TODO: alert user login failed
                });
                resetsXHR.open('POST', '/login');
                resetsXHR.send(formData);
            }}>
          Login
        </button>
      </form>
    );
  }
}

class PrimaryNav extends Component {
  render() {
    return (
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink href="/messages">Messsages</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/about">About</NavLink>
        </NavItem>
      </Nav>
    );
  }
}

class SignupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowSignupForm: true,
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        }
        this.handleIsShowSignupFormChange = this.handleIsShowSignupFormChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleFirstNameChange (firstName) {
        this.setState({firstName: firstName});
    }

    handleLastNameChange (lastName) {
        this.setState({lastName: lastName});
    }

    handleEmailChange(email) {
        this.setState({email: email});
    }

    handlePasswordChange(password) {
        this.setState({password: password});
    }

    handleIsShowSignupFormChange(isShowSignupForm) {
        this.setState({isShowSignupForm: isShowSignupForm})
    }

  render() {
      var content;
      if (this.state.isShowSignupForm) {
          content = (
              <div class="inner cover">
              <h1 className="cover-heading">Welcome to Bespoke-Audio</h1>
              <h2 className="form-signup-heading">Please sign up</h2>
              <form className="form-signup" method="POST" action="/signups">
                  <div className="row">
                      <SignupFirstNameInput onFirstNameChange={this.handleFirstNameChange} />
                      <SignupLastNameInput onLastNameChange={this.handleLastNameChange} />
                  </div>
                  <SignupEmailInput onEmailChange={this.handleEmailChange} />
                  <SignupPasswordInput onPasswordChange={this.handlePasswordChange} />
                  <SubmitSignupButton
                      onIsShowSignupFormChange={this.handleIsShowSignupFormChange}
                      firstName={this.state.firstName}
                      lastName={this.state.lastName}
                      email={this.state.email}
                      password={this.state.password}
                  />
              </form>
              Forget your password? Request a <a href="/resets">reset</a>.<br />
          </div>
          );
      } else {
          content = (
              <div class="inner cover">
              <h1 class="cover-heading">Confirmation email sent.</h1>
              <form className="form-signup">
                  <p>Thank you for signing up with Bespoke-Audio. A confirmation email
                      has been sent to the email you provided. Please click on the
                      link in the email to confirm your email address.</p>
              </form>
              </div>
          );
      }
    return (
        <div>
        <main role="main" class="container">
            {content}
        </main>
        <Footer />
      </div>
    );
  }
}

class SignupFirstNameInput extends Component {
    constructor(props) {
        super(props);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    }

    handleFirstNameChange(event) {
        this.props.onFirstNameChange(event.target.value);
    }

    render() {
        return (
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label htmlFor="inputFirstName" className="sr-only">
                  First name
                </label>
                <input
                  type="text"
                  id="inputFirstName"
                  className="form-control"
                  name="first-name"
                  placeholder="First name"
                  onChange={(e) => this.handleFirstNameChange(e)}
                  required
                  autoFocus
                />
              </div>
            </div>
        )
    }
}

class SignupLastNameInput extends Component {
    constructor(props) {
        super(props);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
    }

    handleLastNameChange(event) {
        this.props.onLastNameChange(event.target.value);
    }

    render() {
        return (
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label htmlFor="inputLastName" className="sr-only">
                  Last name
                </label>
                <input
                  type="text"
                  id="inputLastName"
                  className="form-control"
                  name="last-name"
                  placeholder="Last name"
                  onChange={(e) => this.handleLastNameChange(e)}
                  required
                />
              </div>
            </div>
        )
    }
}

class SignupEmailInput extends Component {
    constructor(props) {
        super(props);
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    handleEmailChange(event) {
        this.props.onEmailChange(event.target.value);
    }

    render() {
        return (
            <div className="row">
              <div className="col-xs-12 col-sm-12">
                <div className="form-group">
                  <label htmlFor="inputEmail" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    name="email"
                    placeholder="Email address"
                    onChange={(e) => this.handleEmailChange(e)}
                    required
                  />
                </div>
              </div>
            </div>
        )
    }
}

class SignupPasswordInput extends Component {
    constructor(props) {
        super(props);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handlePasswordChange(event) {
        this.props.onPasswordChange(event.target.value);
    }

    render() {
        return (
            <div className="row">
              <div className="col-xs-12 col-sm-12">
                <div className="form-group">
                  <label htmlFor="inputPassword" className="sr-only">
                    Password
                  </label>
                  <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => this.handlePasswordChange(e)}
                    required
                  />
                </div>
              </div>
            </div>
        )
    }
}

class SubmitSignupButton extends Component {
    constructor(props) {
        super(props);
        this.handleIsShowSignupFormChange = this.handleIsShowSignupFormChange.bind(this);
    }

    handleIsShowSignupFormChange(isShowSignupForm) {
        this.props.onIsShowSignupFormChange(isShowSignupForm);
    }

    render() {
        return (
            <div className="row">
              <div className="col-xs-12 col-sm-4 col-sm-offset-4">
                <button
                  className="btn btn-lg btn-primary btn-block"
                  type="button"
                  onClick={(e) => {
                      var that = this;
                      var formData = new FormData();
                      formData.append("first-name", this.props.firstName);
                      formData.append("last-name", this.props.lastName);
                      formData.append("email", this.props.email);
                      formData.append("password", this.props.password);
                      var resetsXHR = new XMLHttpRequest();
                      resetsXHR.addEventListener('load', function(event) {
                          if (event.target.status === 201) {
                              that.handleIsShowSignupFormChange(false);
                          } else {
                              // TODO: alert user sign up failed
                          }
                      });
                      resetsXHR.addEventListener('error', function(event) {
                          // TODO: alert user sign up failed
                      });
                      resetsXHR.open('POST', '/signups');
                      resetsXHR.send(formData);
                  }}
                >
                  Sign up
                </button>
              </div>
            </div>
        )
    }
}

export default App;
