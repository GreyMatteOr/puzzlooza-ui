import { dragmove } from '@knadh/dragmove';
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
    dragmove(this.canvas.current, this.canvas.current, ()=>{}, this.checkLocation)
  }
  checkLocation(canvas, x, y){
    console.log(canvas.id)
  }

  render() {
    return <canvas
      ref={this.canvas}
      id={this.props.id}
      style={{
        width: "100px",
        height: "100px",
        borderColor: "black",
        borderStyle: "double",
        position: "fixed"
      }}>
    </canvas>
  }

}

export default Tile;
