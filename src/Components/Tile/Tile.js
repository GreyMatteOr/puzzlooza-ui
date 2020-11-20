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
    this.checkBottom(grouping.style, x, y);
    this.checkLeft(grouping.style, x, y);
    this.checkRight(grouping.style, x, y);
    this.checkTop(grouping.style, x, y);
    this.grouping.current.style.zIndex = 0;
  };
  checkMatch = (tile, side) => {
    const sideToCheck ={
      Bottom: "top",
      Left: "right",
      Right: "left",
      Top: "bottom"
    }
    if (tile.dataset[sideToCheck[side]] === this.canvas.current.id){
      console.log(`${side} match`)
    }
  };

  checkBottom = ({ height, width }, x, y) => {
    height = parseInt(height);
    width = parseInt(width);
    let bL = document.elementFromPoint(x, y + height + 1);
    this.checkMatch(bL, "Bottom")
    let bR = document.elementFromPoint(x + width, y + height + 1);
    this.checkMatch(bR, "Bottom")
    this.moveTile(bL, parseInt(bL.parentElement.style.left), y + height + 2);
    if (bL.id !== bR.id)
      this.moveTile(bR, parseInt(bR.parentElement.style.left), y + height + 2);
  };

  checkLeft = ({ height, width }, x, y) => {
    height = +height.split("px")[0];
    width = +width.split("px")[0];
    let bL = document.elementFromPoint(x - 1, y + height);
    this.checkMatch(bL, "Left")
    let tL = document.elementFromPoint(x - 1, y);
    this.checkMatch(tL, "Left")
    this.moveTile(bL, x - width - 2, parseInt(bL.parentElement.style.top));
    if (bL.id !== tL.id)
      this.moveTile(tL, x - width - 2, parseInt(tL.parentElement.style.top));
  };

  checkRight = ({ height, width }, x, y) => {
    height = +height.split("px")[0];
    width = +width.split("px")[0];
    let bR = document.elementFromPoint(x + width + 1, y + height);
    this.checkMatch(bR, "Right")
    let tR = document.elementFromPoint(x + width + 1, y);
    this.checkMatch(tR, "Right")
    this.moveTile(bR, x + width + 2, parseInt(bR.parentElement.style.top));
    if (bR.id !== tR.id)
      this.moveTile(tR, x + width + 2, parseInt(tR.parentElement.style.top));
  };

  checkTop = ({ height, width }, x, y) => {
    height = +height.split("px")[0];
    width = +width.split("px")[0];
    let tL = document.elementFromPoint(x, y - 1);
    let tR = document.elementFromPoint(x + width, y - 1);
    //this.checkMatch(tL, tR)
    this.moveTile(tL, parseInt(tL.parentElement.style.x), y - height - 2,  "Top");
    if (tL.id !== tR.id)
      this.moveTile(tR, parseInt(tR.parentElement.style.left), y - height - 2, "Top");
  };

  moveTile(tile, newX, newY, side) {
    if (tile.classList.contains("App")) return;
    this.checkMatch(tile, side)
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
