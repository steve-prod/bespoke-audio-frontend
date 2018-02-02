import React, { Component } from 'react';
import classnames from 'classnames';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import Inbox from './Inbox.js';
import Recorder from './Recorder.js';
import Browse from './Browse.js';

export default class MessageTabs extends Component {
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
        this.handlePublicChange = this.handlePublicChange.bind(this);
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
                var messages = JSON.parse(event.target.responseText);
                that.setState({messages: messages});
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
                var messages = JSON.parse(event.target.responseText);
                messages.forEach(function(v, i) {
                    v.tags = atob(v.tags);
                    v.tags = v.tags.slice(2, v.tags.length - 2).split(',');
                });
                that.setState({public: messages});
            }
        });
        publicXHR.addEventListener('error', function(event) {
          that.setState({public:[]})
        });
        publicXHR.open('GET', '/public');
        publicXHR.send();
    }

    handlePublicChange(messages) {
        if (Array.isArray(messages)) {
            this.setState({public: messages});
        } else {
            this.refreshMessages();
        }
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
                     onPublicChange={this.handlePublicChange}
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
