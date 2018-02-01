import React, { Component } from 'react';

export default class SignupEmailInput extends Component {
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
