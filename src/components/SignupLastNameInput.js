import React, { Component } from 'react';

export default class SignupLastNameInput extends Component {
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
