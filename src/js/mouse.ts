canvas.onclick = (event) => {
  manager.mouseClick(event.offsetX, event.offsetY);
}

canvas.onmousemove = (event) => {
    manager.mouseMove(event.offsetX, event.offsetY);
}