import React, { Component } from 'react';
import MessageTabs from './MessageTabs.js';
import Footer from './Footer.js';

export default class Messages extends Component {
  render() {
    return (
      <div>
        <main role="main" className="container">
          <div className="inner cover">
            <form className="form-layout">
              <MessageTabs />
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
