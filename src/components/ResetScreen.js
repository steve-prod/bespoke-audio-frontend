import React, { Component } from 'react';
import Footer from './Footer.js';

export default class ResetScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coverHeadingText: "Password Reset",
            formSigninHeadingText: "Enter email address of account you want to reset.",
            isShowRequestForm: true,
            isShowResetForm: true,
            email: "",
            resetID: window.location.pathname.split("/").length > 2 && window.location.pathname.split("/")[2].replace(/[<>!;&]/g, ""),
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
                                    className="form-control"
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
                                        resetsXHR.addEventListener("load", function(event) {
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
                                        resetsXHR.addEventListener("error", function(event) {
                                            that.setState({coverHeadingText: "There was an error creating password reset request."})
                                            that.setState({formSigninHeadingText: "Please try again later."})
                                            that.setState({isShowRequestForm: false})
                                        });
                                        resetsXHR.open("POST", "/resets");
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
                        <h1 className="cover-heading text-center">Password Reset</h1>
                        <h2 className="form-signin-heading text-center">Enter email address of account you want to reset.</h2>
                        {this.state.isShowResetForm &&
                        <form class="form-reset">
                            <label for="new-password" class="sr-only">New Password</label>
                            <input
                                type="password"
                                name="new-password"
                                className="form-control"
                                placeholder="New Password"
                                onChange={(e) => this.handlePasswordChange(e)}
                                required autofocus />
                            <label for="same-password" class="sr-only">Same Password Again</label>
                            <input
                                type="password"
                                name="same-password"
                                className="form-control"
                                placeholder="Same Password Again"
                                onChange={(e) => this.handleSamePasswordChange(e)}
                                required />
                            <button
                                className="btn btn-lg btn-primary btn-block"
                                type="button"
                                onClick={(event) => {
                                    var that = this;
                                    if (this.state.password === this.state.samePassword) {
                                        var formData = new FormData();
                                        formData.append("password", that.state.password);
                                        var resetsXHR = new XMLHttpRequest();
                                        resetsXHR.addEventListener("load", function(event) {
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
                                        resetsXHR.addEventListener("error", function(event) {
                                            that.setState({coverHeadingText: "There was an error creating password reset request."})
                                            that.setState({formSigninHeadingText: "Please try again later."})
                                            that.setState({isShowResetForm: false})
                                        });
                                        resetsXHR.open('POST', "/resets/" + that.state.resetID);
                                        resetsXHR.send(formData);
                                    } else {
                                        // TODO: notify user that passwords don't match
                                        alert("Passwords don't match");
                                    }

                                }}>Request Reset</button>
                        </form>}
                        {!this.state.isShowResetForm &&
                            <form className="form-signin" method="POST" action="/login">
                                <h2 className="form-signin-heading">Please log in</h2>
                                <label for="email" class="sr-only">Email address</label>
                                <input type="email" name="email" class="form-control" placeholder="Email address" required autofocus />
                                <label for="password" class="sr-only">Password</label>
                                <input type="password" name="password" class="form-control" placeholder="Password" required />
                                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                            </form>
                        }
                        </div>
                    </main>
            );
        }
            return <div>{properForm}</div>;
        }
};
