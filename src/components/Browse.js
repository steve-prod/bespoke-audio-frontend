import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import PublicMessagesList from './PublicMessagesList.js';

export default class Browse extends Component {
    constructor(props) {
        super(props);
        this.handleMessageIDChange = this.handleMessageIDChange.bind(this);
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
        this.handleIsReplyingToPublicChange = this.handleIsReplyingToPublicChange.bind(this);
        this.handleIsReplyingPubliclyChange = this.handleIsReplyingPubliclyChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePublicChange = this.handlePublicChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            timeout: null,
            dropdownOpen: false,
            searchTag: "",
            tags: []
        }
    }

    handlePublicChange(messages) {
        this.props.onPublicChange(messages);
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

    handleInputChange(e) {
        // wait for user to stop typing
        this.setState({searchTag: e.target.value});
        if (e.target.value !== "") {
            var that = this;
            clearTimeout(this.state.timeout);
            this.setState({timeout: setTimeout(() => {
                that.getTags()
            },500)})
        } else {
            this.setState({dropdownOpen: false});
            this.handlePublicChange();
        }
    }

    getTags() {
        // get list of tags that begin with this.state.searchTag
        var that = this;
        var queryString = encodeURI(that.state.searchTag);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(event){
            if (event.target.responseText !== "null") {
                var response = JSON.parse(event.target.responseText);
                if (response.length > 0) {
                    that.setState({tags: response});
                    that.setState({dropdownOpen: true});
                }
            }
        });
        xhr.addEventListener("error", function(event){
            // TODO: alert user
        });
        xhr.open("GET", "/tags?" + queryString);
        xhr.send();
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    handleGetSearchMessages(tag) {
        var that = this;
        var publicXHR = new XMLHttpRequest();
        publicXHR.addEventListener('load', function(event) {
            that.setState({isShowTags: false})
            if(event.target.responseText === "[]") {
                that.setState({public:[]});
            } else {
                var messages = JSON.parse(event.target.responseText);
                messages.forEach(function(v, i) {
                    v.tags = atob(v.tags);
                    v.tags = v.tags.slice(2, v.tags.length - 2).split(',');
                });
                that.handlePublicChange(messages);
            }
        });
        publicXHR.addEventListener('error', function(event) {
            // TODO: alert user
        });
        publicXHR.open('GET', '/public?tag=' + tag);
        publicXHR.send();
    }

    render() {
        var that = this;
        const displayTags = this.state.tags.map(function(tag) {
          return <div className="tags-menu-item" onClick={(e) => {
              that.toggle();
              that.setState({searchTag: tag});
              that.handleGetSearchMessages(tag);
          }}>{tag}</div>;
      });

        return (
            <div>
                <h1 className="text-center">Public Messages</h1>
                <input
                    id="searchTag"
                    type="text"
                    className="form-control"
                    placeholder="Search by tag"
                    aria-label="SearchInput"
                    aria-describedby="search-input"
                    onChange={(e) => this.handleInputChange(e)}
                    value={this.state.searchTag}
                />
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle
                      tag="span"
                      onClick={this.toggle}
                      data-toggle="dropdown"
                      aria-expanded={this.state.dropdownOpen}
                    >
                    </DropdownToggle>
                    <DropdownMenu right={false} className="tag-dropdown">
                      {displayTags}
                    </DropdownMenu>
                </Dropdown>
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
