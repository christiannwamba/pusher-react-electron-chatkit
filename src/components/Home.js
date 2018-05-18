import React, { Component } from 'react';
import Layout from './Layout';
import Chatbox from './Chatbox';
import Sidebar from './Sidebar';
import UsernameForm from './Username';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsername: '',
      currentId: '',
      currentScreen: 'usernameInputScreen',
      message : null
    };
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this);
  }

  onUsernameSubmitted(username) {
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          currentId: data.id,
          currentUsername: data.name,
          currentScreen: 'chatScreen'
        });
      })
      .catch(error => {
        console.error('error', error)
        this.setState({
          message : "There seems to be an issue"
        });
      });
  }

  render() {
    if (this.state.currentScreen === 'usernameInputScreen') {
      return <UsernameForm handleSubmit={this.onUsernameSubmitted} message={this.state.message} />;
    }
    if (this.state.currentScreen === 'chatScreen') {
      return (
        <Layout
          currentId={this.state.currentId}
          Sidebar={Sidebar}
          Chatbox={Chatbox}
        />
      );
    }
  }
}

export default Home;
