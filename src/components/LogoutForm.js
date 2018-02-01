import React, { Component } from 'react';

export default class LogoutForm extends Component {
  render() {
    return (
      <form className="form-inline">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/logout">
              Logout
            </a>
          </li>
        </ul>
      </form>
    );
  }
}
