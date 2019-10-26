var TICK_SPEED = 100;
var TICK_INCREMENT = 0.8;
var CountdownTimer = /** @class */ (function () {
    function CountdownTimer(width, height) {
        this.width = width;
        this.height = height;
        this.resetTimer();
    }
    CountdownTimer.prototype.startCountdown = function () {
        var _this = this;
        if (!this.timerId) {
            this.resetTimer();
            this.timerId = setInterval(function () {
                if (_this.timerProgress < 100.0) {
                    _this.timerProgress += TICK_INCREMENT;
                }
                else {
                    eventNotifier.notify(COUNTDOWN_FINISHED_EVENT, {});
                    clearInterval(_this.timerId);
                }
            }, TICK_SPEED);
        }
    };
    CountdownTimer.prototype.resetTimer = function () {
        this.timerProgress = 0.0;
        this.timerId = null;
    };
    CountdownTimer.prototype.mouseMove = function (x, y) {
    };
    CountdownTimer.prototype.mouseClick = function (x, y) {
    };
    CountdownTimer.prototype.render = function (ctx, x, y) {
        ctx.strokeStyle = "rgb(100,100,100)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.stroke();
        ctx.fillStyle = "rgb(153, 255, 179)";
        ctx.fillRect(x, y, this.width, this.height * (this.timerProgress / 100));
    };
    return CountdownTimer;
}());
