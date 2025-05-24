class Island {
  constructor(name, rootElement, initialState = {}) {
    this._name = name;
    this.rootElement = rootElement;
    this.widgets = [];
    this.subscriptions = [];
    this.streams = {};
    this.isActive = false;

    // Internal backing store for reactive state
    const internal = { ...initialState };
    const subscribers = {};

    const handler = {
      get: (target, key) => {
        if (key in this) return this[key]; // Allow method access (like .initialize)
        return internal[key];
      },
      set: (target, key, value) => {
        if (internal[key] === value) return true;
        internal[key] = value;
        if (Array.isArray(subscribers[key])) {
          subscribers[key].forEach(fn => fn(value));
        }
        return true;
      },
      has: (target, key) => key in internal || key in this
    };

    const proxy = new Proxy(this, handler);

    // Save refs for internal use
    this._stateData = internal;
    this._stateSubs = subscribers;

    return proxy; // 👈 return the Proxy instead of the instance!
  }

  onChange(key, handler) {
    if (!this._stateSubs[key]) {
      this._stateSubs[key] = [];
    }
    this._stateSubs[key].push(handler);
  }

  // 💬 Optional sugar helpers (can be omitted if you're assigning directly)
  get(key) {
    return this._stateData[key];
  }

  set(key, value) {
    this[key] = value;
  }

  // Existing methods remain:
  addWidget(widget) {
    this.widgets.push(widget);
    if (typeof widget.attach === 'function') {
      widget.attach(this);
    }
  }

  createStream(key, initialValue, debounceDelay = 0) {
    const stream = new Stream(initialValue, debounceDelay);
    this.streams[key] = stream;
    return stream;
  }

  getStream(key) {
    return this.streams[key];
  }

  observe(stream, handler, context = this) {
    const callback = value => handler.call(context, value);
    const unsubscribe = stream.subscribe(callback);
    this.subscriptions.push(unsubscribe);
  }

  initialize() {
    this.isActive = true;
    this.widgets.forEach(widget => {
      if (typeof widget.init === 'function') widget.init();
    });
  }

  activate() {
    this.isActive = true;
    this.widgets.forEach(widget => {
      if (typeof widget.onActivate === 'function') widget.onActivate();
    });
  }

  deactivate() {
    this.isActive = false;
    this.widgets.forEach(widget => {
      if (typeof widget.onDeactivate === 'function') widget.onDeactivate();
    });
  }

  destroy() {
    this.subscriptions.forEach(unsub => unsub());
    this.widgets.forEach(widget => {
      if (typeof widget.destroy === 'function') widget.destroy();
    });
    this.subscriptions = [];
    this.streams = {};
    this.widgets = [];
    this.isActive = false;
  }

  createReactiveObject(json = {}) {
    const streams = {}; // one stream per property
  
    const proxy = new Proxy(json, {
      get(target, prop) {
        return streams[prop]?.get?.() ?? target[prop];
      },
      set(target, prop, value) {
        if (!streams[prop]) {
          streams[prop] = new Stream(value);
        } else {
          streams[prop].set(value);
        }
        target[prop] = value;
        return true;
      }
    });
  
    proxy.onChange = (key, handler) => {
      if (!streams[key]) {
        streams[key] = new Stream(json[key]);
      }
      return streams[key].subscribe(handler);
    };
  
    return proxy;
  }
  


}
