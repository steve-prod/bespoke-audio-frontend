import React, { Component } from 'react';

export default class SignupFirstNameInput extends Component {
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
