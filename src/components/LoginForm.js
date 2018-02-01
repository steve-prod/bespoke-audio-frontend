import React, { Component } from 'react';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    handleEmailChange(email) {
        this.setState({email: email})
    }

    handlePasswordChange(password) {
        this.setState({password:password})
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.handleSubmitForm();
        }
    }

    handleSubmitForm() {
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
          onKeyPress={(e) => this.handleKeyPress(e)}
        />
        <button
            className="btn btn-primary"
            type="button"
            onClick={(e) => this.handleSubmitForm}>
          Login
        </button>
      </form>
    );
  }
}
