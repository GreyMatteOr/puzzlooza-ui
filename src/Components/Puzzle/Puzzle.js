import React, { Component } from 'react';
import './Puzzle.css';
import rainbow from '../../rainbow.jpg';
import Tile from '../Tile/Tile.js';

class Puzzle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingPicture: true,
      tiles: {}
    }
  }

  createTiles(xSplits, ySplits, puzzleImg) {
    let {width, height} = puzzleImg;
    let dx = Math.floor( width / xSplits );
    let dy = Math.floor( height / ySplits );
    let xLeftover = width % dx
    let yLeftover = height % dy
    let xOffset, yOffset, tiles = {};
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
        tiles[`${x}-${y}`] = (
          <Tile
            delete={this.delete}
            dx={dx}
            dy={dy}
            image={puzzleImg}
            key={`${x},${y}`}
            coordinates={`${x},${y}`}
            x= { (x * dx) + xOffset }
            y= { (y * dy) + yOffset }
          />
        )
      }
    }
    this.setState( {tiles} );
  }

  delete = (tile) => {
    console.log('DELETE')
    let newTiles = { ...this.state.tiles}
    delete newTiles[tile]
    this.setState( {tiles: newTiles} )
  }

  doneLoadingPic = (e) => {
    this.createTiles(9, 6, e.target);
    this.setState(
      {
        loadingPicture: false,
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
        {Object.values( this.state.tiles )}
      </>
    )
  }

}

export default Puzzle;
