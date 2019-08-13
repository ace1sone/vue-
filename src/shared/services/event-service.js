import EventEmitter from 'eventemitter3';

const globalEvents = new EventEmitter();

export function on(name, listener, context) {
  globalEvents.on(name, listener, context);
  return globalEvents;
}

export function once(name, listener, context) {
  globalEvents.once(name, listener, context);
  return globalEvents;
}

export function remove(name, listener, context) {
  globalEvents.removeListener(name, listener, context);
  return globalEvents;
}

export function emit(name, params) {
  globalEvents.emit(name, params);
  return globalEvents;
}