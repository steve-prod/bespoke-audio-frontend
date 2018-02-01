import React, { Component } from 'react';

export default class AccountConfirmedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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
        resetsXHR.addEventListener("load", function(event) {
            if (event.target.status === 200) {
                window.location.href = "/messages";
            } else {
                // TODO: alert user login failed
            }
        });
        resetsXHR.addEventListener("error", function(event) {
            // TODO: alert user login failed
        });
        resetsXHR.open("POST", "/login");
        resetsXHR.send(formData);
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
                            onKeyPress={(e) => this.handleKeyPress(e)}
                            required />
                        <button class="btn btn-lg btn-primary btn-block"
                            type="button"
                            onClick={() => this.handleSubmitForm}
                            >Sign in</button>
                    </form>
                </div>
            </main>
        )
    }
}
