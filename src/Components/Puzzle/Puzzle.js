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
    this.tileCombiners = {};
    this.tileRefs = {};
  }

  createTiles = (xSplits, ySplits, puzzleImg) => {
    let {width, height} = puzzleImg;
    let dx = Math.floor( width / xSplits );
    let dy = Math.floor( height / ySplits );
    let xLeftover = width % dx
    let yLeftover = height % dy
    let xOffset, yOffset, tiles = {};
    for (let y = 0; y < ySplits; y++) {
      for (let x = 0; x < xSplits; x++) {
        let ref = React.createRef();
        if (xLeftover) {
          xOffset = x;
          xLeftover--;
        }
        if (yLeftover) {
          yOffset = y;
          yLeftover--;
        }
        this.tileRefs[`${x}-${y}`] = ref;
        tiles[`${x}-${y}`] = (
          <Tile
            client={this.props.client}
            coordinates={`${x},${y}`}
            delete={this.delete}
            dx={dx}
            dy={dy}
            funcElevator={this.saveTileCombiner}
            image={puzzleImg}
            groupRef={ref}
            key={`${x},${y}`}
            x= { (x * dx) + xOffset }
            y= { (y * dy) + yOffset }
          />
        )
      }
    }
    this.setState( {tiles} );
  }

  delete = (groupID) => {
    let newTiles = { ...this.state.tiles}
    delete newTiles[groupID]
    this.setState( {tiles: newTiles} )
  }

  doneLoadingPic = (e) => {
    this.createTiles(9, 6, e.target);
    this.setState(
      {
        loadingPicture: false,
      }
    )
    this.props.client.on('combine', (group1ID, group2ID, joinTileID) => this.combineGroups(group1ID, group2ID, joinTileID));
    this.props.client.on('move', (groupID, newX, newY) => this.moveGroup(groupID, newX, newY));
  }

  combineGroups = (group1ID, group2ID, joinTileID) => {
    let combiner = this.tileCombiners[group1ID];
    let joinFrom = this.tileRefs[group2ID];
    combiner(document.getElementById( joinTileID ), joinFrom.current, false);
  }

  moveGroup = (groupID, newX, newY) => {
    let group = this.tileRefs[groupID];
    group.current.style.left = newX;
    group.current.style.top = newY;
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

  saveTileCombiner = (groupID, combiner) => {
    this.tileCombiners[groupID] = combiner;
  }
}

export default Puzzle;
