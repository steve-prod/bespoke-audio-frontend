import React, { Component } from 'react';

export default class SubmitSignupButton extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    handleSubmitForm() {
        this.props.onSubmitForm();
    }

    render() {
        return (
            <div className="row">
              <div className="col-xs-12 col-sm-4 col-sm-offset-4">
                <button
                  className="btn btn-lg btn-primary btn-block"
                  type="button"
                  onClick={() => this.handleSubmitForm()}
                >
                  Sign up
                </button>
              </div>
            </div>
        )
    }
}
