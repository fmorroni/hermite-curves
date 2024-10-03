document.addEventListener("keypress", (ev) => {
  switch (ev.code) {
    case "KeyC":
      activateNavItem(navItemCursor)
      activateListener(listeners.cursorListener);
      break;
    case "KeyA":
      activateNavItem(navItemAddPoint)
      activateListener(listeners.addPointListener);
      break;
    case "KeyD":
      activateNavItem(navItemDeletePoint)
      activateListener(listeners.deletePointListener);
      break;
    case "Space":
      activateNavItem(navItemMoveCurve)
      activateListener(listeners.moveCurveListener);
      break;

    default:
      break;
  }
});
