const navItemCursor = document.getElementById("nav-item-cursor");
const navItemAddPoint = document.getElementById("nav-item-add-point");
const navItemDeletePoint = document.getElementById("nav-item-delete-point");
const navItemMoveCurve = document.getElementById("nav-item-move-curve");

/**
 * @param {Element} ni
 */
function activateNavItem(ni) {
  activeNavItem.firstElementChild.classList.remove("active");
  ni.firstElementChild.classList.add("active");
  activeNavItem = ni;
}

let activeNavItem = navItemCursor;
document.querySelectorAll(".nav-item").forEach((ni) =>
  ni.addEventListener("click", () => {
    activateNavItem(ni);
  }),
);

/** @typedef {{active: boolean, callbacks: Array<{callback: (ev: MouseEvent) => void, type: keyof HTMLElementEventMap}>}} Listener */

/** @type {{cursorListener: Listener, addPointListener: Listener, deletePointListener: Listener, moveCurveListener: Listener}} */
const listeners = {
  cursorListener: {
    active: true,
    callbacks: [{ callback: cursorListenerCallback, type: "mousemove" }],
  },
  addPointListener: {
    active: false,
    callbacks: [{ callback: addPointListenerCallback, type: "click" }],
  },
  deletePointListener: {
    active: false,
    callbacks: [
      { callback: deletePointHoverCallback, type: "mousemove" },
      { callback: deletePointClickCallback, type: "click" },
    ],
  },
  moveCurveListener: {
    active: false,
    callbacks: [{ callback: moveCurveCallback, type: "mousemove" }],
  },
};

/**
 * @param {Listener} listener
 */
function activateListener(listener) {
  clearHighlights();
  canvasCursorReset();
  selectedElement = null;
  selectedCurve = null;
  if (!listener.active) {
    Object.values(listeners).forEach((l) => {
      if (l !== listener) {
        l.callbacks.forEach((c) => {
          canvas.removeEventListener(c.type, c.callback);
        });
        l.active = false;
      }
    });
    listener.callbacks.forEach((c) => {
      canvas.addEventListener(c.type, c.callback);
    });
    listener.active = true;
  }
}

canvas.addEventListener("mousemove", cursorListenerCallback);
navItemCursor.addEventListener("click", () => {
  activateListener(listeners.cursorListener);
});

navItemAddPoint.addEventListener("click", () => {
  activateListener(listeners.addPointListener);
});

navItemDeletePoint.addEventListener("click", () => {
  activateListener(listeners.deletePointListener);
});

navItemMoveCurve.addEventListener("click", () => {
  activateListener(listeners.moveCurveListener);
});

const ElementType = Object.freeze({ POINT: 0, HANDLE: 1 });
/** @type {{ pointWithTangent: PointWithTangent, point: Point, type: Number, idx: Number }?} */
let selectedElement = null;

/**
 * @param {MouseEvent} ev
 */
function cursorListenerCallback(ev) {
  if (!selectedElement) {
    for (const p of curve.points) {
      if (p.handle.inPoint(ev.offsetX, ev.offsetY)) {
        p.handle.highlight();
        selectedElement = {
          pointWithTangent: p,
          point: p.handle,
          type: ElementType.HANDLE,
        };
        canvasCursorGrab();
      } else if (p.point.inPoint(ev.offsetX, ev.offsetY)) {
        p.point.highlight();
        selectedElement = {
          pointWithTangent: p,
          point: p.point,
          type: ElementType.POINT,
        };
        canvasCursorGrab();
      }
    }
  } else {
    if (ev.buttons % 2 === 1) {
      selectedElement.point.unhighlight();
      if (selectedElement.type === ElementType.HANDLE) {
        selectedElement.pointWithTangent.moveHandleTo(ev.offsetX, ev.offsetY);
      } else if (selectedElement.type === ElementType.POINT) {
        selectedElement.pointWithTangent.movePointTo(ev.offsetX, ev.offsetY);
      }
      selectedElement.point.highlight();
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      curve.draw();
      canvasCursorGrabbing();
    } else {
      if (selectedElement.point.inPoint(ev.offsetX, ev.offsetY)) {
        canvasCursorGrab();
      } else {
        selectedElement.point.unhighlight();
        selectedElement = null;
        canvasCursorReset();
      }
    }
  }
}

const pointRadius = 3;
const pointColor = "red";
const handleColor = "#7c76e8";

/**
 * @param {MouseEvent} ev
 */
function addPointListenerCallback(ev) {
  const p = new PointWithTangent(
    ev.offsetX,
    ev.offsetY,
    ev.offsetX - 80,
    ev.offsetY,
    pointRadius,
    pointColor,
    handleColor,
    ctx,
    highlightCtx,
  );
  curve.addPoint(p);
  curve.draw();
}

/**
 * @param {MouseEvent} ev
 */
function deletePointHoverCallback(ev) {
  if (!selectedElement) {
    curve.points.forEach((p, idx) => {
      if (p.point.inPoint(ev.offsetX, ev.offsetY)) {
        p.point.highlight();
        selectedElement = {
          pointWithTangent: p,
          point: p.point,
          type: ElementType.POINT,
          idx,
        };
        canvasCursorDelete();
      }
    });
  } else {
    if (ev.buttons % 2 === 1) {
      selectedElement.point.unhighlight();
      curve.deletePoint(selectedElement.idx);
      selectedElement = null;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      curve.draw();
      canvasCursorReset();
    } else if (!selectedElement.point.inPoint(ev.offsetX, ev.offsetY)) {
      selectedElement.point.unhighlight();
      selectedElement = null;
      canvasCursorReset();
    }
  }
}

/**
 * @param {MouseEvent} ev
 */
function deletePointClickCallback(ev) {
  if (selectedElement) {
    selectedElement.point.unhighlight();
    curve.deletePoint(selectedElement.idx);
    selectedElement = null;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    curve.draw();
    canvasCursorReset();
  }
}

/** @type {HermiteCurve?} */
let selectedCurve = null;

/**
 * @param {MouseEvent} ev
 */
function moveCurveCallback(ev) {
  if (!selectedCurve) {
    if (curve.inBounds(ev.offsetX, ev.offsetY)) {
      // curve.drawBoundingBox();
      curve.highlight();
      selectedCurve = curve;
      canvasCursorGrab();
    }
  } else {
    if (ev.buttons % 2 === 1) {
      clearHighlights();
      selectedCurve.moveBy(ev.movementX, ev.movementY);
      // curve.drawBoundingBox();
      curve.highlight();
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      curve.draw();
      canvasCursorGrabbing();
    } else {
      if (selectedCurve.inBounds(ev.offsetX, ev.offsetY)) {
        canvasCursorGrab();
      } else {
        clearHighlights();
        selectedCurve = null;
        canvasCursorReset();
      }
    }
  }
}
