// https://github.com/knadh/dragmove.js
// Kailash Nadh (c) 2020.
// MIT License.

let _loaded = false;
let _callbacks = {};
const _isTouch = window.ontouchstart !== undefined;

export const dragmove = function(target, handler, onStart, onEnd) {
  // Register a global event to capture mouse moves (once).
  if (!_loaded) {
    document.addEventListener(_isTouch ? "touchmove" : "mousemove", function(e) {
      let c = e;
      if (e.touches) {
        c = e.touches[0];
      }

      // On mouse move, dispatch the coords to all registered callbacks.
      Object.entries(_callbacks).forEach( ( [key, func] ) => {
        func(c.clientX, c.clientY);
      })
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
  };

  return function(handler) {
    console.log(_callbacks)
    handler.removeEventListener("mousedown", handleMouseDown);
    delete _callbacks[handler.id]
    console.log(_callbacks)
  }
}