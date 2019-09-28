var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
function render(ctx) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function gameLoop() {
    render(ctx);
    window.requestAnimationFrame(gameLoop);
}
gameLoop();
