import { dragmove } from "../../dragmove";
import React, { Component } from "react";
import "./Tile.css";

class Tile extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.grouping = this.props.groupRef;
    this.tiles = [];
  }

  componentDidMount() {
    this.tiles.push([this.canvas.current]);
    this.drawTile(this.canvas.current);
    this.unregister = dragmove(
      this.grouping.current,
      this.canvas.current,
      this.props.client,
      () => this.grouping.current.style.zIndex = 2,
      (grouping, tile, x, y) => {
        if (isNaN(x)) x = 1;
        if (isNaN(y)) y = 1;
        this.grouping.current.style.zIndex = 0;
        this.checkMatch( tile, x, y );
      }
    );
  }

  checkMatch = ( tile, groupX, groupY) => {
    let height = tile.offsetHeight;
    let width = tile.offsetWidth;
    let x = groupX + ( (parseInt(tile.style.gridColumn) - 1) * width );
    let y = groupY + ( (parseInt(tile.style.gridRow) - 1) * height );
    const sideCheckData = {
      bottom: { shoveXY: [ null,(y+height+3) ], refNames: ['bBL', 'bBR'] },
      left: { shoveXY: [ (x-width-3), null ], refNames: ['lBL', 'lTL'] },
      right: { shoveXY: [ (x+width+3), null ], refNames: ['rBR', 'rTR'] },
      top: { shoveXY: [ null,(y-height-3) ], refNames: ['tTL', 'tTR'] }
    };
    const sides = ['bottom', 'left', 'right', 'top'];
    const refPoints = {
      'bBL':  [ (x + (0.2 * width)), (y + (height + 3)) ],
      'bBR':  [ (x + (0.8 * width)), (y + (height + 3)) ],
      'center': [ (x + ((1/2) * width)), (y + ((1/2) * height)) ],
      'lBL':  [ (x - 3), (y + (0.8 * height)) ],
      'lTL':  [ (x - 3), (y + (0.2 * height)) ],
      'rBR':  [ (x + width + 1), (y + (0.8 * height)) ],
      'rTR':  [ (x + width + 1), (y + (0.2 * height)) ],
      'tTL':  [ (x + (0.2 * width)), (y - 1) ],
      'tTR':  [ (x + (0.8 * width)), (y - 1) ],
    };
    const tilesOnCenter = document.elementsFromPoint( ...refPoints['center'] );

    sides.forEach( side => {
      let { shoveXY, refNames } = sideCheckData[side];
      let ref1 = refPoints[ refNames[0] ];
      let ref2 = refPoints[ refNames[1] ];
      let tilesOnRef1 = document.elementsFromPoint( ...ref1 );
      let tilesOnRef2 = document.elementsFromPoint( ...ref2 );

      tilesOnRef1 = tilesOnRef1.filter( (tile1, i1) => {
        let i2 = tilesOnRef2.indexOf( tile1 );

        if ( i2 >= 0 ) {
          if (tilesOnCenter.includes( tile1 )) {
            this.shove(tile1, ...shoveXY)
          }
          else if (
            tile1.classList.contains('tile') &&
            this.grouping.current.id !== tile1.parentNode.id &&
            tile.dataset[side] === tile1.id
           ) {
            this.join(tile, tile1.parentNode)
          }
          tilesOnRef2.splice(i2, 1);
          return false;
        }

        return true;
      });

      let leftOvers = tilesOnRef1.concat( tilesOnRef2 );
      leftOvers.forEach( tile => this.shove(tile, ...shoveXY) );
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
        let shoveXY = shoveSpots[ random ]
        this.shove( tile, ...shoveXY );
      }
    });
  }

  drawTile(canvas) {
    let ctx = canvas.getContext("2d");
    let { dx, dy, image, x, y } = this.props;
    ctx.drawImage(image, x, y, dx, dy, 0, 0, 300, 150);
  }

  join( moveTile, joinGroup) {
    let referenceCol = parseInt( moveTile.style.gridColumn );
    let referenceRow = parseInt( moveTile.style.gridRow );
    let startX = parseInt( moveTile.parentNode.style.left );
    let startY = parseInt( moveTile.parentNode.style.top );
    let [x, y] = moveTile.id.split(",").map( (num) => parseInt(num) );

    [...joinGroup.children].forEach( tile => {
      let [xPrime, yPrime] = tile.id.split(",").map( (num) => parseInt(num) );
      let [relativePosX, relativePosY] = [xPrime - x, yPrime - y];
      let newCol = relativePosX + referenceCol;
      let newRow = relativePosY + referenceRow;

      while (newCol < 1) {
        this.tiles.forEach( row => row.unshift( null ) )
        newCol++;
        referenceCol++;
      }
      while (newRow < 1) {
        let emptyRow = new Array(this.tiles[0].length).fill(null);
        this.tiles.unshift(emptyRow);
        newRow++;
        referenceRow++;
      }
      while (newCol > this.tiles[0].length) {
        this.tiles.forEach( row => row.push( null ) )
      }
      while (newRow > this.tiles.length) {
        let emptyRow = new Array(this.tiles[0].length).fill(null);
        this.tiles.push(emptyRow);
      }
      this.tiles[newRow - 1][newCol - 1] = tile;
      this.grouping.current.append( joinGroup.removeChild(tile) )
      this.unregister(tile);
      dragmove(
        this.grouping.current,
        tile,
        () => this.grouping.current.style.zIndex = 1,
        (grouping, htile, x, y) => {
          this.checkMatch( htile, x, y );
          this.grouping.current.style.zIndex = 0;
        }
      )
    })

    this.canvas.current.style.gridColumn = referenceCol;
    this.canvas.current.style.gridRow = referenceRow;
    this.updateGrid( moveTile, this.tiles, startX, startY);
    this.props.delete(joinGroup.id)
  }

  shove(tile, newX, newY) {
    if ( tile.classList.contains('tile') && this.grouping.current.id !== tile.parentNode.id ) {
      let grouping = tile.parentNode
      let maxX = window.innerWidth - grouping.offsetWidth;
      let maxY = window.innerHeight - grouping.offsetHeight;
      let oldX = parseInt(grouping.style.left) || 1;
      let oldY = parseInt(grouping.style.top) || 1;
      newX = ( newX === null ? oldX : Math.min( Math.max(newX, 1), maxX) );
      newY = ( newY === null ? oldY : Math.min( Math.max(newY, 1), maxY) );
      grouping.style.top = newY + "px";
      grouping.style.left = newX + "px";
      window.setTimeout(
        () => this.checkOverlap(grouping.offsetHeight, grouping.offsetWidth, newX, newY, tile.id),
        0
      );
    }
  }

  updateGrid( baseTile, tiles, startX, startY ) {
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[0].length; col++) {
        let tile = tiles[row][col];
        if (tile !== null) {
          tile.style.gridColumn = col + 1;
          tile.style.gridRow = row + 1;
        }
      }
    }
    let { style } = this.grouping.current;
    style.gridTemplateColumns = tiles[0].length;
    style.gridTemplateRows = tiles.length;
    style.height = (tiles.length * 100) + "px";
    style.left = startX - ( (parseInt(baseTile.style.gridColumn) - 1) * 100 ) + 'px';
    style.top = startY - ( (parseInt(baseTile.style.gridRow) - 1) * 100 ) + 'px';
    style.width = (tiles[0].length * 100) + "px";
  }

  render() {
    let [x, y] = this.props.coordinates.split(",").map( (num) => parseInt(num) );
    return (
      <div
        className="canvas-grouping"
        data-drag-boundary='true'
        id={`${x}-${y}`}
        ref={this.grouping}
        style={{
          display: "grid",
          gridTemplateColumns: "1",
          gridTemplateRows: "1"
        }}>
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
      </div>
    );
  }
}

export default Tile;
