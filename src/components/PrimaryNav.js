import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

export default class PrimaryNav extends Component {
  render() {
    return (
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink href="/messages">Messsages</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/about">About</NavLink>
        </NavItem>
      </Nav>
    );
  }
}
