import React, { Component } from 'react';
import SignupFirstNameInput from './SignupFirstNameInput.js';
import SignupLastNameInput from './SignupLastNameInput.js';
import SignupEmailInput from './SignupEmailInput.js';
import SignupPasswordInput from './SignupPasswordInput.js';
import SubmitSignupButton from './SubmitSignupButton.js';
import Footer from './Footer.js';


export default class SignupForm extends Component {
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
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
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

    handleSubmitForm() {
        var that = this;
        var formData = new FormData();
        formData.append("first-name", this.state.firstName);
        formData.append("last-name", this.state.lastName);
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
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
                  <SignupPasswordInput
                      onPasswordChange={this.handlePasswordChange}
                      onSubmitForm={this.handleSubmitForm}
                  />
                  <SubmitSignupButton
                      firstName={this.state.firstName}
                      lastName={this.state.lastName}
                      email={this.state.email}
                      password={this.state.password}
                      onSubmitForm={this.handleSubmitForm}
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
