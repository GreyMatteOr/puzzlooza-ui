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
    dragmove(
      this.canvas.current,
      this.canvas.current,
      () => this.canvas.current.style.zIndex = 1,
      this.checkOverlap
    )
  }

  checkOverlap( canvas, x, y ) {
    this.checkBottom( canvas, x, y );
    this.checkLeft( canvas, x, y );
    this.checkRight( canvas, x, y );
    this.checkTop( canvas, x, y );
  }


  checkBottom( {height, width}, x, y ) {
    let bL = document.elementFromPoint(x , y + height + 1);
    let bR = document.elementFromPoint(x + width , y + height + 1)
    this.moveTile(bL);
    if (bL.id !== bR.id) this.moveTile(bR);
  }

  checkLeft( {height, width}, x, y ) {
    let bL = document.elementFromPoint(x - 1, y + height);
    let tL = document.elementFromPoint(x - 1 , y);
    this.moveTile(bL);
    this.moveTile(tL);
  }

  checkRight( {height, width}, x, y ) {
    let bR = document.elementFromPoint(x + width + 1 , y + height)
    let tR = document.elementFromPoint(x + width + 1 , y)
    this.moveTile(bL);
    this.moveTile(tR);
  }

  checkTop( {height, width}, x, y ) {
    let tL = document.elementFromPoint(x, y - 1);
    let tR = document.elementFromPoint(x + width , y - 1)
    this.moveTile(tL);
    this.moveTile(tR);
  }

  moveTile( tile, newX, newY ) {
    if (!tile.classList.contains('App')) {
      tile.style.top = newY;
      tile.style.left = newX;
      window.setTimeout( () => this.checkOverlap(tile), newX, newY, 0);
    }
  }


  render() {
    return <canvas
      ref={this.canvas}
      id={this.props.id}
      style={{
        borderColor: "black",
        borderStyle: "double",
        height: "100px",
        id: this.props.id,
        width: "100px",
        position: "fixed",
        zIndex: 0
      }}>
    </canvas>
  }

}

export default Tile;
