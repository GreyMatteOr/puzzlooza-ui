import React, { Component } from 'react';
import './Puzzle.css';
import rainbow from '../../rainbow.jpg';
import Tile from '../Tile/Tile.js';

class Puzzle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingPicture: true,
      puzzleImg: null
    }
  }

  createTiles(xSplits, ySplits) {
    let {width, height} = this.state.puzzleImg;
    let dx = Math.floor( width / xSplits );
    let dy = Math.floor( height / ySplits );
    let xLeftover = width % dx
    let yLeftover = height % dy
    let xOffset, yOffset, tiles = [];
    for (let y = 0; y < ySplits; y++) {
      for (let x = 0; x < xSplits; x++) {
        if (xLeftover) {
          xOffset = x;
          xLeftover--;
        }
        if (yLeftover) {
          yOffset = y;
          yLeftover--;
        }
        let tile = (
          <Tile
            dx={dx}
            dy={dy}
            image={this.state.puzzleImg}
            key={`${x},${y}`}
            id={`${x},${y}`}
            x= { (x * dx) + xOffset }
            y= { (y * dy) + yOffset }
          />
        )

        tiles.push(tile);
      }
    }
    return tiles;
  }

  doneLoadingPic = (e) => {
    this.setState(
      {
        loadingPicture: false,
        puzzleImg: e.target
      }
    )
  }

  render() {
    if (this.state.loadingPicture) {
      let puzzleImg = <img src={rainbow} onLoad={this.doneLoadingPic} />
      return (
        <>
          <h1>Loading</h1>
          {puzzleImg}
        </>
      )
    }

    return (
      <>
        {this.createTiles(9, 6)}
      </>
    )
  }

}

export default Puzzle;
