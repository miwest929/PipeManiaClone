// event types
let COUNTDOWN_FINISHED_EVENT = "countdown_finished_event";
let TILE_DROPPED_EVENT = "tile_dropped_event";

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