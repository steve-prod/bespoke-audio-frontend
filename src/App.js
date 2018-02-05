import React, { Component } from 'react';
import './App.css';
// Begin custom components
import About from './components/About.js';
import AccountConfirmedScreen from './components/AccountConfirmedScreen.js';
import Menu from './components/Menu.js';
import Message from './components/Message.js';
import Messages from './components/Messages.js';
import ResetScreen from './components/ResetScreen.js';
import SignupForm from './components/SignupForm.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoggedIn: false,
        mainScreen: null
    }
  }

  componentDidMount() {
      var that = this;
      var statusXHR = new XMLHttpRequest();
      statusXHR.addEventListener('load', function(event) {
          if(event.target.status === 200) {
              that.setState({isLoggedIn:true})
          } else {
              that.setState({isLoggedIn:false})
          }
      });
      statusXHR.addEventListener('error', function(event) {
        that.setState({isLoggedIn:false})
      });
      statusXHR.open('GET', '/status');
      statusXHR.send();
  }

  render() {
    var menu = <Menu isLoggedIn={this.state.isLoggedIn} />;
    var mainScreen = null;
    // setup frontend routing
    var pathname = window.location.pathname.split("/")[1].replace(/[\W]/g, "");
    switch (pathname) {
        case "":
            mainScreen = <SignupForm />;
            break;
        case "messages":
            if (window.location.pathname.split("/").length > 2) {
                mainScreen = <Message />;
            } else {
                mainScreen = <Messages />;
            }
            break;
        case "signups":
            mainScreen = <AccountConfirmedScreen />;
            break;
        case "resets":
            mainScreen = <ResetScreen />
            break;
        case "about":
            mainScreen = <About />;
            break;
        default:
            window.location.href = "/"
            break;
    }

    return (
      <div className="App">
        {menu}
        {mainScreen}
      </div>
    );
  }
}

export default App;
