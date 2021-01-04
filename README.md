# puzzlooza

**[puzzlooza](https://greymatteor.github.io/puzzlooza-ui/)** is an online app where users from all over the internet might solve a puzzle together. An on-going (?) web-sockets project done in a short time!

### How to start playing
Merely navigate to [puzzlooza site](https://greymatteor.github.io/puzzlooza-ui/), wait for the server to boot, and begin playing with users anywhere! If the site has been inactive for too long, the server goes to sleep. When this happens, it may take up to 20 seconds to boot again.

To get started on a new puzzle, quickly click-and-release the 'pile' of tiles to randomly push the pieces everywhere!

![puzzlooza_start](https://user-images.githubusercontent.com/65369751/103509051-1a74ab00-4e17-11eb-9947-a18e63f77f34.gif)

If a puzzle is already on-going, the puzzle will load automatically.

### Features:
 - **Click-and-drag puzzle interface**! Moving pieces correctly snap together in groups when moves close to one another in the right way. Incorrect pieces push each other around
 - **Rotation**! Press the 'z' or 'x' keys to rotate a piece or group left or right 90°. All grouping still works in a visually intuitive way
 - **Play with your friends**! Using [Socket.io](https://socket.io), see what other users are going and solve the puzzle with them!

### Still to come:
 - **On-page how-to-play**
 - **Random starting position and orientation**
 - **Custom images and dimensions**
 - **Room-ination**
 - **Chat**
 - **Visual celebration on a completed puzzle!** ( and a reset button :X )
 - **Connect animations**

### Known Bugs:
 - Some collisions cause giants jumps
 - When pieces are forced partially off-screen, dragging on them doesn't move them until they would be completely returned on screen
 - Some groups block grabbing a visible tile
 - When a puzzle is solved, everyone has to leave the site, or else the puzzle will never reset
 
### Wanna contribute?

- Check-out our roadmap:
 <img width="1362" alt="Puzzlooza_roadmap" src="https://user-images.githubusercontent.com/65369751/103509422-f6659980-4e17-11eb-883b-0e18df591792.png">
- Checkout the [Project Milestones](https://github.com/GreyMatteOr/puzzlooza-host/milestones)
 

### Tech:
 - **[dragmove.js](https://github.com/knadh/dragmove.js)**
 - **[Socket.io](https://socket.io)**
 - **[React](https://reactjs.org)**
 - **[Express](http://expressjs.com)**


 [Link to the Client Repo](https://github.com/GreyMatteOr/puzzlooza-host/)
