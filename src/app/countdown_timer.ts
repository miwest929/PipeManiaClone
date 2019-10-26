const TICK_SPEED: number = 100;
const TICK_INCREMENT: number = 0.8;

type CountdownFinishedFn = () => void;

class CountdownTimer implements Component {
    public timerProgress: number;
    public timerId: number;
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.resetTimer();
    }

    public startCountdown() {
        if (!this.timerId) {
            this.resetTimer();
            this.timerId = setInterval(() => {
                if (this.timerProgress < 100.0) {
                this.timerProgress += TICK_INCREMENT;
                } else {
                    eventNotifier.notify(COUNTDOWN_FINISHED_EVENT, {});
                    clearInterval(this.timerId);
                }
            }, TICK_SPEED);
        }
    }

    private resetTimer() {
        this.timerProgress = 0.0;
        this.timerId = null;
    }

    mouseMove(x:number, y:number) {
    }
  
    mouseClick(x:number, y:number) {
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.strokeStyle = "rgb(100,100,100)";
        ctx.lineWidth = 3;
    
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.stroke();
        
        ctx.fillStyle = "rgb(153, 255, 179)";
        ctx.fillRect(x, y, this.width, this.height * (this.timerProgress / 100));
    }
}