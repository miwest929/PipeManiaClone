// event types
let COUNTDOWN_FINISHED_EVENT = "countdown_finished_event";
let TILE_DROPPED_EVENT = "tile_dropped_event";
let ROTATE_NEXT_TILE_CLOCKWISE_EVENT = "rotate_next_tile_clockwise";
let ROTATE_NEXT_TILE_COUNTERCLOCKWISE_EVENT = "rotate_next_tile_counterclockwise";
let FAST_FORWARD_OOZE_EVENT = "fast_forward_ooze_event";

class EventNotification {
  private observers:any;

  constructor() {
    // key is the eventType and the value is an array of event callbacks
    this.observers = {};
  }

  public attach(eventType: string, callback): void {
    if (eventType in callback) {
      this.observers[eventType].push(callback);
    } else {
      this.observers[eventType] = [callback];
    }
  }

  public notify(eventType: string, eventData): void {
    if (!(eventType in this.observers)) {
      return;
    }

    for (let i = 0; i < this.observers[eventType].length; i++) {
      this.observers[eventType][i](eventData);
    }
  }
}