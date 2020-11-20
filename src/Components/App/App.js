import './App.css';
import ioc from 'socket.io-client';
import Puzzle from '../Puzzle/Puzzle.js';
import React, { Component } from 'react';

let client;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    client = ioc.connect( "localhost:3001");
    console.log('Attempting to connect...')
    client.on( 'connect', (state) => {
      console.log('Connected to server.');
    });
  }

  render() {
    return (
      <div className="App">
        <Puzzle />
      </div>
    );
  }
}

export default App;
