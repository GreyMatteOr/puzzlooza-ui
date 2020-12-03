import React, { Component } from 'react';
import './Puzzle.css';
import rainbow from '../../rainbow.jpg';
import Group from '../Group/Group.js';

class Puzzle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingPicture: true,
      loadingRoom: true,
      groups: {}
    }
    this.groupCombiners = {};
    this.groupRefs = {};
  }

  createGroups = (xSplits, ySplits, puzzleImg) => {
    let {width, height} = puzzleImg;
    let dx = Math.floor( width / xSplits );
    let dy = Math.floor( height / ySplits );
    let xLeftover = width % dx
    let yLeftover = height % dy
    let xOffset, yOffset, groups = {};
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
        this.groupRefs[`${x}-${y}`] = ref;
        groups[`${x}-${y}`] = (
          <Group
            client={this.props.client}
            coordinates={`${x},${y}`}
            delete={this.delete}
            dx={dx}
            dy={dy}
            funcElevator={this.saveGroupCombiner}
            image={puzzleImg}
            groupRef={ref}
            key={`${x},${y}`}
            x= { (x * dx) + xOffset }
            y= { (y * dy) + yOffset }
          />
        )
      }
    }
    this.setState( {groups} );
  }

  delete = (groupID) => {
    let newGroups = { ...this.state.groups}
    delete newGroups[groupID]
    delete this.groupRefs[groupID]
    this.setState( {groups: newGroups} )
  }

  doneLoadingPic = (e) => {
    this.createGroups(9, 6, e.target);
    this.setState( {loadingPicture: false} );
    this.props.client.on('roomData', this.arrangeGroups);
    this.props.client.on('dataRequest', this.sendData);
    this.props.client.on('newRoom', () => {
      this.setState( {loadingRoom: false} )
    })
    this.props.client.on('combine', this.combineGroups);
    this.props.client.on('move', this.moveGroup);
  }

  arrangeGroups = (groups) => {
    groups.forEach( group => {
      let node = this.groupRefs[group.groupID].current
      node.dataset.rotation = group.rotation;
      node.style.transform = `rotate(${node.dataset.rotation * -90}deg)`
      node.style.top = group.top;
      node.style.left = group.left;

      let identity = group.groupID.split('-').join(',');
      group.tiles.forEach( tileID => {
        if (tileID === identity) return;
        let tileParentID = tileID.split(',').join('-');
        this.combineGroups(group.groupID, tileParentID, identity);
      });
    });

    this.setState( {loadingRoom: false} )
  }

  combineGroups = (group1ID, group2ID, joinTileID) => {
    let combiner = this.groupCombiners[group1ID];
    let joinFrom = this.groupRefs[group2ID];
    if (joinFrom) combiner(document.getElementById( joinTileID ), joinFrom.current, false);
  }

  getRoomData = () => {
    this.props.client.emit('getRoomData')
    return <h1>Loading Room Data </h1>
  }

  moveGroup = (groupID, newX, newY) => {
    let group = this.groupRefs[groupID];
    group.current.style.left = newX;
    group.current.style.top = newY;
  }

  sendData = (requester) => {
    let roomData = Object.entries(this.groupRefs).map( ([groupID, group]) => {
      let tiles = [...group.current.children].map( tile => tile.id )
      return {
        groupID,
        tiles,
        rotation: group.current.dataset.rotation,
        top: group.current.style.top,
        left: group.current.style.left
      }
    });
    this.props.client.emit('returnRoomData', requester, roomData)
  }

  render() {
    if (this.state.loadingPicture) {
      let puzzleImg = <img src={rainbow} onLoad={this.doneLoadingPic} />
      return (
        <>
          <h1>Loading Puzzle Tiles</h1>
          {puzzleImg}
        </>
      )
    }

    if (this.state.loadingRoom) {
      {this.getRoomData()}
    }

    return (
      <>
        {Object.values( this.state.groups )}
      </>
    )
  }

  saveGroupCombiner = (groupID, combiner) => {
    this.groupCombiners[groupID] = combiner;
  }
}

export default Puzzle;
