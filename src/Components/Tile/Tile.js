import React, { Component } from 'react';
import './Tile.css';


class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: null,
      y: null
    }
    this.canvas = React.createRef();
  }

  drawTile( canvas ) {
    console.log(canvas)
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    // ctx.drawImage(this.puzzleImg, +x, +y, +dx, +dy);
    ctx.fillRect(0,0,100,100)
  }

  componentDidMount() {
    this.drawTile(this.canvas.current)
  }

  render() {
    return <canvas ref={this.canvas}></canvas>
  }

}

export default Tile;
