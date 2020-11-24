import { dragmove } from "@knadh/dragmove";
import React, { Component } from "react";
import "./Tile.css";

class Tile extends Component {
  constructor(props) {
    super(props);
    this.coordinates = this.props.coordinates.split(",").map( (num) => parseInt(num) );
    this.canvas = React.createRef();
    this.grouping = React.createRef();
    let [x, y] = this.coordinates;

    let baseTile = (
      <canvas
        className="tile"
        data-bottom={`${x},${y + 1}`}
        data-left={`${x - 1},${y}`}
        data-right={`${x + 1},${y}`}
        data-top={`${x},${y - 1}`}
        id={this.props.coordinates}
        ref={this.canvas}
        style={{
          gridColumn: '1',
          gridRow: '1'
        }}>
      </canvas>
    )
    this.state = {
      dimensionX: 1,
      dimensionY: 1,
      tiles: [[baseTile]]
    };
  }

  componentDidMount() {
    this.drawTile(this.canvas.current);
    dragmove(
      this.grouping.current,
      this.canvas.current,
      () => this.grouping.current.style.zIndex = 1,
      (tile, x, y) => {
        this.checkMatch(tile.offsetHeight, tile.offsetWidth, x, y);
        this.grouping.current.style.zIndex = 0;
      }
    );
  }

  checkMatch = ( height, width, x, y ) => {
    const sides = ['bottom', 'left', 'right', 'top'];
    const refPoints = {
      'bBL':  [ (x + (0.2 * width)), (y + (height + 1)) ],
      'bBR':  [ (x + (0.8 * width)), (y + (height + 1)) ],
      'center': [ (x + ((1/2) * width)), (y + ((1/2) * height)) ],
      'lBL':  [ (x - 1), (y + (0.8 * height)) ],
      'lTL':  [ (x - 1), (y + (0.2 * height)) ],
      'rBR':  [ (x + width + 1), (y + (0.8 * height)) ],
      'rTR':  [ (x + width + 1), (y + (0.2 * height)) ],
      'tTL':  [ (x + (0.2 * width)), (y - 1) ],
      'tTR':  [ (x + (0.8 * width)), (y - 1) ],
    };
    const sideCheckData = {
      bottom: { match: "top", newXY: [ null,(y+height+3) ], refNames: ['bBL', 'bBR'] },
      left: { match: "right", newXY: [ (x-width-3), null ], refNames: ['lBL', 'lTL'] },
      right: { match: "left", newXY: [ (x+width+3), null ], refNames: ['rBR', 'rTR'] },
      top: { match: "bottom", newXY: [ null,(y-height-3) ], refNames: ['tTL', 'tTR'] }
    };
    const tilesOnCenter = document.elementsFromPoint( ...refPoints['center'] );

    sides.forEach( side => {
      let { refNames } = sideCheckData[side];
      let { newXY } =  sideCheckData[side];
      let ref1 = refPoints[ refNames[0] ];
      let ref2 = refPoints[ refNames[1] ];
      let tilesOnRef1 = document.elementsFromPoint( ...ref1 );
      let tilesOnRef2 = document.elementsFromPoint( ...ref2 );

      tilesOnRef1 = tilesOnRef1.filter( (tile1, i1) => {
        let i2 = tilesOnRef2.indexOf( tile1 );
        if ( i2 >= 0 ) {
          if (tilesOnCenter.includes( tile1 )) { this.shove(tile1, ...newXY) }
          else { this.join(tile1, sideCheckData[side].match) }

          tilesOnRef2.splice(i2, 1);
          return false;
        }

        return true;
      });

      let leftOvers = tilesOnRef1.concat( tilesOnRef2 );
      leftOvers.forEach( tile => this.shove(tile, ...newXY) );
    });
  }

  checkOverlap = ( height, width, x, y, noMove) => {
    const center =   [ (x + ((1/2) * width)), (y + ((1/2) * height)) ];
    const shoveSpots = [
      [ x, (y+height+3) ],
      [ (x-width-3), y ],
      [ (x+width+3), y ],
      [ x, (y-height-3) ]
    ];
    const tilesOnCenter = document.elementsFromPoint( ...center )
    tilesOnCenter.forEach( tile => {
      if ( tile.id !== noMove ) {
        let random = Math.floor( Math.random() * shoveSpots.length )
        let newXY = shoveSpots[ random ]
        this.shove( tile, ...newXY );
      }
    });
  }

  drawTile(canvas) {
    let ctx = canvas.getContext("2d");
    let { dx, dy, image, x, y } = this.props;
    ctx.drawImage(image, x, y, dx, dy, 0, 0, 300, 150);
  }

  join( tile, direction) {
    console.log(tile)
    this.props.delete(tile.id)
  }

  shove(tile, newX, newY) {
    if ( tile.classList.contains('tile') ) {
      let grouping = tile.parentNode
      let maxX = window.innerWidth - tile.offsetWidth;
      let maxY = window.innerHeight - tile.offsetHeight;
      let oldX = parseInt(grouping.style.left) || 1;
      let oldY = parseInt(grouping.style.top) || 1;
      newX = ( newX === null ? oldX : Math.min( Math.max(newX, 1), maxX) );
      newY = ( newY === null ? oldY : Math.min( Math.max(newY, 1), maxY) );
      grouping.style.top = newY + "px";
      grouping.style.left = newX + "px";
      // grouping.dataset.willMove = 'true';
      window.setTimeout(
        () => this.checkOverlap(grouping.offsetHeight, grouping.offsetWidth, newX, newY, tile.id),
        0
      );
    }
  }

  tileGrid( {tiles} ) {
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[0].length; x++) {

      }
    }
  }

  render() {
    let [x, y] = this.coordinates;
    return (
      <div
        className="canvas-grouping"
        data-drag-boundary='true'
        data-will-move='false'
        data-grouped={false}
        id={this.props.coordinates.split(",").join("-")}
        ref={this.grouping}
        style={{
          display: "grid",
          gridTemplateColumns: `${this.state.dimensionX}`,
          gridTemplateRows: `${this.state.dimensionY}`
        }}
      >
        {this.state.tiles}
      </div>
    );
  }
}

export default Tile;
