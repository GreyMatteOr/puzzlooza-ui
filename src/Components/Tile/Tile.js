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

  checkOverlap = ( canvas, x, y ) => {
    this.checkBottom( canvas.style, x, y );
    this.checkLeft( canvas.style, x, y );
    this.checkRight( canvas.style, x, y );
    this.checkTop( canvas.style, x, y );
    this.canvas.current.style.zIndex = 0;
  }


  checkBottom = ( {height, width}, x, y ) => {
    height = parseInt(height);
    width = parseInt(width);
    let bL = document.elementFromPoint(x , y + height + 1);
    let bR = document.elementFromPoint(x + width , y + height + 1)
    this.moveTile(bL, parseInt(bL.style.left), y + height + 2);
    if (bL.id !== bR.id) this.moveTile(bR, parseInt(bR.style.left), y + height + 2);
  }

  checkLeft = ( {height, width}, x, y ) => {
    height = +(height.split('px')[0]);
    width = +(width.split('px')[0]);
    let bL = document.elementFromPoint(x - 1, y + height);
    let tL = document.elementFromPoint(x - 1 , y);
    this.moveTile(bL, x - width - 2, parseInt(bL.style.top));
    if (bL.id !== tL.id) this.moveTile(tL, x - width - 2, parseInt(tL.style.top));
  }

  checkRight = ( {height, width}, x, y ) => {
    height = +(height.split('px')[0]);
    width = +(width.split('px')[0]);
    console.log(x, width, 1)
    let bR = document.elementFromPoint(x + width + 1 , y + height)
    let tR = document.elementFromPoint(x + width + 1 , y)
    this.moveTile(bR, x + width + 2, parseInt(bR.style.top));
    console.log()
    if (bR.id !== tR.id) this.moveTile(tR, x + width + 2, parseInt(tR.style.top));

  }

  checkTop = ( {height, width}, x, y ) => {
    height = +(height.split('px')[0]);
    width = +(width.split('px')[0]);
    let tL = document.elementFromPoint(x, y - 1);
    let tR = document.elementFromPoint(x + width , y - 1)
    this.moveTile(tL, parseInt(tL.style.x), y - height - 2);
    if (tL.id !== tR.id) this.moveTile(tR, parseInt(tR.style.left), y - height - 2);
  }

  moveTile( tile, newX, newY ) {
    if (!tile.classList.contains('App')) {
      console.log('old', newX, newY)
      tile.style.top = newY + "px";
      tile.style.left = newX + "px";
      console.log(tile)
      window.setTimeout( () => this.checkOverlap(tile, newX, newY), 0);
    }
  }


  render() {
    return <canvas
      ref={this.canvas}
      id={this.props.id}
      style={{
        borderColor: "black",
        borderStyle: "none",
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
