import React, { Component } from 'react';

export default class SignupPasswordInput extends Component {
    constructor(props) {
        super(props);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handlePasswordChange(event) {
        this.props.onPasswordChange(event.target.value);
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.props.onSubmitForm();
        }
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
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    required
                  />
                </div>
              </div>
            </div>
        )
    }
}
