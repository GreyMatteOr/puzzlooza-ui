// https://github.com/knadh/dragmove.js
// Kailash Nadh (c) 2020.
// Modified by Matthew Lane 2020.
// MIT License.

let _loaded = false;
let _mouseLoc = [0,0]
let _callbacks = {};
let _rotationCB = {};
const _isTouch = window.ontouchstart !== undefined;

export const dragmove = function(target, handler, ioClient, onStart, onEnd) {
  // Register a global event to capture mouse moves (once).
  if (!_loaded) {
    document.addEventListener(_isTouch ? "touchmove" : "mousemove", function(e) {
      let c = e;
      if (e.touches) {
        c = e.touches[0];
      }

      // On mouse move, save the last coordinates
      _mouseLoc = [c.clientX, c.clientY]

      ioClient.on('rotate', rotate);
      // On mouse move, dispatch the coords to all registered callbacks.
      Object.entries(_callbacks).forEach( ( [key, func] ) => {
        func(c.clientX, c.clientY);
      })
    });

    document.addEventListener("keydown", function(e) {
      if (e.code === "KeyZ") rotate( document.elementFromPoint( ..._mouseLoc ).id, 1, ioClient );
      if (e.code === "KeyX") rotate( document.elementFromPoint( ..._mouseLoc ).id, -1, ioClient );
    });
  }

  _loaded = true;
  let isMoving = false, hasStarted = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;

  // On the first click and hold, record the offset of the pointer in relation
  // to the point of click inside the element.
  function handleMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    if (target.dataset.dragEnabled === "false") {
      return;
    }

    let c = e;
    if (e.touches) {
      c = e.touches[0];
    }

    isMoving = true;
    startX = target.offsetLeft - c.clientX;
    startY = target.offsetTop - c.clientY;
  }

  handler.addEventListener(_isTouch ? "touchstart" : "mousedown", handleMouseDown);

  // On leaving click, stop moving.
  target.addEventListener(_isTouch ? "touchend" : "mouseup", function() {
    isMoving = false;
    hasStarted = false;

    if (onEnd) {
      onEnd(target, handler, parseInt(target.style.left), parseInt(target.style.top));
    }
  });

  // Register mouse-move callback to move the element.
  _callbacks[handler.id] = function move(x, y) {
    if (!isMoving) {
      return;
    }

    if (!hasStarted) {
      hasStarted = true;
      if (onStart) {
        onStart(target, lastX, lastY);
      }
    }

    lastX = x + startX;
    lastY = y + startY;

    // If boundary checking is on, don't let the element cross the viewport.
    if (target.dataset.dragBoundary === "true") {
      if (lastX < 1 || lastX >= window.innerWidth - target.offsetWidth) {
        return;
      }
      if (lastY < 1 || lastY >= window.innerHeight - target.offsetHeight) {
        return;
      }
    }

    target.style.left = lastX + "px";
    target.style.top = lastY + "px";
    ioClient.emit('move', target.id ,lastX + "px", lastY + "px")
  };

  return function unregister(handler) {
    handler.removeEventListener("mousedown", handleMouseDown);
    delete _callbacks[handler.id]
  }
}

function rotate(tileID, rotation, ioClient) {
  let tile = document.getElementById(tileID)
  if (tile && tile.classList.contains('tile')) {
    if (ioClient) ioClient.emit( 'rotate', tileID, rotation )
    let element = tile.parentNode;
    element.dataset.rotation = parseInt( element.dataset.rotation ) + rotation
    element.style.transform = `rotate(${element.dataset.rotation * -90}deg)`
  }
}
