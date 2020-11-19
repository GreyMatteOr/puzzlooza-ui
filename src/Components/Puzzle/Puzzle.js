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

  createTiles() {
    let dx = 100, dy = 100, tiles = [];
    for (let x = 0; x < this.state.puzzleImg.width; x += dx) {
      for (let y = 0; y < this.state.puzzleImg.height; y += dy) {
        let tile = (
          <Tile
            dx={dx}
            dy={dy}
            image={this.state.puzzleImg}
            key={`${x},${y}`}
            x={x}
            y={y}
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
        {this.createTiles()}
      </>
    )
  }

}

export default Puzzle;
