// Enhanced Stream class with merging, cancellation, and batch updates
class Stream {
  constructor(initialValue = null, debounceDelay = 0) {
    this.value = initialValue;
    this.subscribers = [];
    this.complete = false;
    this.error = null;
    this.debounceDelay = debounceDelay;
    this.debounceTimeout = null;

    this._isBatching = false;
    this._batchQueue = [];
  }

  subscribe(callback) {
    if (this.complete) {
      callback(this.value);
    } else {
      this.subscribers.push(callback);
      callback(this.value);
    }
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  set(newValue) {
    if (this.complete) return;
    this.value = newValue;

    if (this._isBatching) {
      this._batchQueue.push(newValue);
      return;
    }

    if (this.debounceDelay > 0) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => this.notify(), this.debounceDelay);
    } else {
      this.notify();
    }
  }

  get() {
    return this.value;
  }

  notify() {
    if (this.error) {
      this.subscribers.forEach(callback => callback(this.error));
    } else {
      this.subscribers.forEach(callback => callback(this.value));
    }
  }

  subscribeOnce(callback) {
    const unsubscribe = this.subscribe(value => {
      callback(value);
      unsubscribe();
    });
  }

  completeStream() {
    this.complete = true;
    this.notify();
  }

  emitError(error) {
    this.error = error;
    this.notify();
  }

  beginBatch() {
    this._isBatching = true;
    this._batchQueue = [];
  }

  endBatch() {
    this._isBatching = false;
    if (this._batchQueue.length > 0) {
      this.notify(); // Only emit once with the latest value
      this._batchQueue = [];
    }
  }

  map(transformFn) {
    const newStream = new Stream(transformFn(this.value), this.debounceDelay);
    this.subscribe(value => newStream.set(transformFn(value)));
    return newStream;
  }

  filter(filterFn) {
    const newStream = new Stream(this.value, this.debounceDelay);
    this.subscribe(value => {
      if (filterFn(value)) {
        newStream.set(value);
      }
    });
    return newStream;
  }

  static merge(...streams) {
    const mergedStream = new Stream();
    streams.forEach(stream => {
      stream.subscribe(value => mergedStream.set(value));
    });
    return mergedStream;
  }
}

// Widget observer sugar wrapper
function observeStream(stream, widget, handler) {
  const callback = (value) => handler.call(widget, value);
  const unsubscribe = stream.subscribe(callback);

  if (!widget._subscriptions) widget._subscriptions = [];
  widget._subscriptions.push(unsubscribe);
}

// Widget cleanup helper
function cleanupWidget(widget) {
  if (widget._subscriptions) {
    widget._subscriptions.forEach(unsub => unsub());
    widget._subscriptions = [];
  }
} // Call this when widget is removed or disposed
