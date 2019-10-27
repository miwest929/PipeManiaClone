// event types
var COUNTDOWN_FINISHED_EVENT = "countdown_finished_event";
var TILE_DROPPED_EVENT = "tile_dropped_event";
var ROTATE_NEXT_TILE_CLOCKWISE = "rotate_next_tile_clockwise";
var ROTATE_NEXT_TILE_COUNTERCLOCKWISE = "rotate_next_tile_counterclockwise";
var EventNotification = /** @class */ (function () {
    function EventNotification() {
        // key is the eventType and the value is an array of event callbacks
        this.observers = {};
    }
    EventNotification.prototype.attach = function (eventType, callback) {
        if (eventType in callback) {
            this.observers[eventType].push(callback);
        }
        else {
            this.observers[eventType] = [callback];
        }
    };
    EventNotification.prototype.notify = function (eventType, eventData) {
        if (!(eventType in this.observers)) {
            return;
        }
        for (var i = 0; i < this.observers[eventType].length; i++) {
            this.observers[eventType][i](eventData);
        }
    };
    return EventNotification;
}());
