import React, { Component } from 'react';
import logo from '../logo.svg';
import {
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse
} from 'reactstrap';
import LoginForm from './LoginForm.js';
import LogoutForm from './LogoutForm.js'
import PrimaryNav from './PrimaryNav.js';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar
          color="faded"
          className="navbar-dark bg-dark fixed-top"
          expand="md"
        >
          <img src={logo} className="App-logo" alt="logo" />
          <NavbarBrand href="/">Bespoke-Audio</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <PrimaryNav />
            {this.props.isLoggedIn ? <LogoutForm /> : <LoginForm />}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
