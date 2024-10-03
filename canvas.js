/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas-main-layer");
const ctx = canvas.getContext("2d");
const bgColor = "#3a3a3b";

/** @type {HTMLCanvasElement} */
const highlightCanvas = document.getElementById("canvas-highlight-layer");
const highlightCtx = highlightCanvas.getContext("2d");

const curve = new HermiteCurve(0.01, "green", 2, ctx, highlightCtx);

window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  /** @type {HTMLDivElement} */
  const container = document.querySelector(".canvas-container");
  canvas.width = container.clientWidth - 20;
  canvas.height = window.innerHeight - 20;
  highlightCanvas.width = container.clientWidth - 20;
  highlightCanvas.height = window.innerHeight - 20;

  /**
   * Your drawings need to be inside this function otherwise they will be reset when
   * you resize the browser window and the canvas goes will be cleared.
   */
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  curve.draw();
}

resizeCanvas();

function canvasCursorGrab() {
  canvas.style.cursor = "grab";
}

function canvasCursorGrabbing() {
  canvas.style.cursor = "grabbing";
}

function canvasCursorDelete() {
  canvas.style.cursor = "url('resources/delete-icon.svg') 15 15, crosshair";
}

function canvasCursorReset() {
  canvas.style.cursor = null;
}

function clearHighlights() {
  highlightCtx.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height);
}
