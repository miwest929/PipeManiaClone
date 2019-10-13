canvas.onclick = function (event) {
    manager.mouseClick(event.offsetX, event.offsetY);
};
canvas.onmousemove = function (event) {
    manager.mouseMove(event.offsetX, event.offsetY);
};
