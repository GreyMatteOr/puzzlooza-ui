import { dragmove } from "@knadh/dragmove";
import React, { Component } from "react";
import "./Tile.css";

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvas = React.createRef();
    this.grouping = React.createRef();
  }

  drawTile(canvas) {
    let ctx = canvas.getContext("2d");
    let { dx, dy, image, x, y } = this.props;
    ctx.drawImage(image, x, y, dx, dy, 0, 0, 300, 150);
  }

  componentDidMount() {
    this.drawTile(this.canvas.current);
    dragmove(
      this.grouping.current,
      this.canvas.current,
      () => (this.grouping.current.style.zIndex = 1),
      this.checkOverlap
    );
  }

  checkOverlap = (grouping, x, y) => {
    if (grouping.classList.contains("App")) return;
    this.checkBottom(grouping.style, x, y);
    this.checkLeft(grouping.style, x, y);
    this.checkRight(grouping.style, x, y);
    this.checkTop(grouping.style, x, y);
    this.grouping.current.style.zIndex = 0;
  };
  joinX(tile) {
    return true
  }
  joinY(tile) {
    tile.parentElement.appendChild(this.canvas.current)
    return true
  }
  checkMatch = (tile, side) => {
    if(!tile.dataset){
      return
    }
    const sideToCheck = {
      Bottom: "top",
      Left: "right",
      Right: "left",
      Top: "bottom",
    };
    if (tile.dataset[sideToCheck[side]] === this.canvas.current.id) {
      console.log(`${side} match`);
      if (side === "bottom" || side === "top") return this.joinX(tile);
      return this.joinY(tile);
    }
  };

  checkBottom = ({ height, width }, x, y) => {
    height = parseInt(height);
    width = parseInt(width);
    let bL = document.elementsFromPoint(x, y + height + 1);
    let bLCanvas = bL.find(element => element.className === "canvas-grouping")
    this.checkMatch(bL[0], "Bottom")
    let bR = document.elementsFromPoint(x + width, y + height + 1);
    let bRCanvas = bR.find(element => element.className === "canvas-grouping" )
    this.checkMatch(bR[0], "Bottom")
    console.log(bR, bRCanvas, bLCanvas)
    if (bLCanvas || bRCanvas){
    this.moveTile(bL, parseInt(bLCanvas.style.left), y + height + 2);
    if (bL.id !== bR.id)
      this.moveTile(bR, parseInt(bRCanvas.style.left), y + height + 2);
    }
  };

  checkLeft = ({ height, width }, x, y) => {
    height = +height.split("px")[0];
    width = +width.split("px")[0];
    let bL = document.elementsFromPoint(x - 1, y + height);
    let bLCanvas = bL.find(element => element === "canvas")
    this.checkMatch(bL, "Left")
    let tL = document.elementsFromPoint(x - 1, y);
    let tLCanvas = tL.find(element => element === "canvas")
    this.checkMatch(tL, "Left")
    if(tLCanvas){
    this.moveTile(bL, x - width - 2, parseInt(bL.parentElement.style.top));
    if (bL.id !== tL.id)
      this.moveTile(tL, x - width - 2, parseInt(tL.parentElement.style.top));
    }
  };

  checkRight = ({ height, width }, x, y) => {
    height = +height.split("px")[0];
    width = +width.split("px")[0];
    let bR = document.elementsFromPoint(x + width + 1, y + height);
    let bRCanvas = bR.find(element => element === "canvas")
    this.checkMatch(bR, "Right")
    let tR = document.elementsFromPoint(x + width + 1, y);
    let tRCanvas = tR.find(element => element === "canvas")
    this.checkMatch(tR, "Right")
    if(bRCanvas){
    this.moveTile(bR, x + width + 2, parseInt(bR.parentElement.style.top));
    if (bR.id !== tR.id)
      this.moveTile(tR, x + width + 2, parseInt(tR.parentElement.style.top));
    }
  };

  checkTop = ({ height, width }, x, y) => {
    height = +height.split("px")[0];
    width = +width.split("px")[0];
    let tL = document.elementsFromPoint(x, y - 1);
    let tLCanvas = tL.find(element => element === "canvas")
    this.checkMatch(tL, "Top")
    let tR = document.elementsFromPoint(x + width, y - 1);
    let tRCanvas = tR.find(element => element === "canvas")
    this.checkMatch(tR, "Top")
    if (tRCanvas){
    this.moveTile(tL, parseInt(tL.parentElement.style.x), y - height - 2);
    if (tL.id !== tR.id)
      this.moveTile(tR, parseInt(tR.parentElement.style.left), y - height - 2);
    }
    
  };

  moveTile(tile, newX, newY) {
    tile.parentElement.style.top = newY + "px";
    tile.parentElement.style.left = newX + "px";
    window.setTimeout(
      () => this.checkOverlap(tile.parentElement, newX, newY),
      0
    );
  }

  render() {
    const [x, y] = this.props.coordinates.split(",").map((x) => parseInt(x));
    return (
      <div
        className="canvas-grouping"
        id={this.props.coordinates.split(",").join("-")}
        ref={this.grouping}
        data-grouped={false}
        style={{
          height: "100px",
          width: "100px",
          position: "fixed",
          zIndex: 0,
        }}
      >
        <canvas
          ref={this.canvas}
          id={this.props.coordinates}
          data-Bottom={`${x},${y + 1}`}
          data-Left={`${x - 1},${y}`}
          data-Right={`${x + 1},${y}`}
          data-Top={`${x},${y - 1}`}
          style={{
            height: "100%",
            width: "100%",
          }}
        ></canvas>
      </div>
    );
  }
}

export default Tile;
