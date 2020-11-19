import React, { Component } from 'react';
import './Tile.css';

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.canvas = React.createRef();
  }

  drawTile( canvas ) {
    let ctx = canvas.getContext('2d');
    let {dx, dy, image, x, y} = this.props;
    ctx.drawImage(image, x, y, dx, dy, 0, 0, 300, 150);
  }

  componentDidMount() {
    this.drawTile(this.canvas.current)
  }

  render() {
    return <canvas
      ref={this.canvas}
      style={{
        width: "100px",
        height: "100px",
        borderColor: "black",
        borderStyle: "double"
      }}>
    </canvas>
  }

}

export default Tile;
