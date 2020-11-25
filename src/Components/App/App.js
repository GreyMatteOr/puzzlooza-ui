import './App.css';
import ioc from 'socket.io-client';
import Puzzle from '../Puzzle/Puzzle.js';
import React, { Component } from 'react';

let client;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {connected: false};
  }

  componentDidMount = () => {
    client = ioc.connect( "localhost:3001");
    console.log('Attempting to connect...')
    client.on( 'connect', (state) => {
      console.log('Connected to server.');
      this.setState( {connected: true} )
    });
  }

  render() {
    if (!this.state.connected) return <h1>Connecting to server...</h1>
    return (
      <div className="App">
        <Puzzle client={client}/>
      </div>
    );
  }
}

export default App;
