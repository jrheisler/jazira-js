// Jazira-JS: Widget Base Class with Sugar + Theme Reactivity

class Widget {
    constructor(id, parentElement) {
      this.id = id;
      this.parentElement = parentElement;
      this.root = document.createElement('div');
      this.root.classList.add('widget');
      this._subscriptions = [];
      this._styleOverrides = {};
      this.palette = null;
      this.state = {}; // Optional local state cache
      parentElement.appendChild(this.root);
  
      // Auto-react to theme changes
      this.observe(theme.themeChanged, () => {
        theme.styleElement(this.root, this._styleOverrides, this.palette);
      });
    }
  
    // Sugar: auto-observe a stream and track for cleanup
    observe(stream, handler) {
      const callback = (value) => handler.call(this, value);
      const unsubscribe = stream.subscribe(callback);
      this._subscriptions.push(unsubscribe);
    }
  
    // Sugar: update widget's root content
    setHTML(html) {
      this.root.innerHTML = html;
    }
  
    // Sugar: add a class to the root
    addClass(cls) {
      this.root.classList.add(cls);
    }
  
    // Sugar: remove a class from the root
    removeClass(cls) {
      this.root.classList.remove(cls);
    }
  
    // Sugar: toggle visibility
    show() {
      this.root.style.display = '';
    }
  
    hide() {
      this.root.style.display = 'none';
    }
  
    // Apply themed styles and remember them
    styleElement(overrides = {}, palette = null) {
      this._styleOverrides = overrides;
      this.palette = palette;
      theme.styleElement(this.root, overrides, palette);
    }
  
    // Attach widget to an island (optional)
    attach(island) {
      this.island = island;
    }
  
    // Optional initialization hook
    init() {}
  
    // Lifecycle hook when the island becomes active
    onActivate() {}
  
    // Lifecycle hook when the island deactivates
    onDeactivate() {}
  
    // Cleanup subscriptions and remove from DOM
    destroy() {
      this._subscriptions.forEach(unsub => unsub());
      this._subscriptions = [];
      if (this.root && this.root.parentNode) {
        this.root.parentNode.removeChild(this.root);
      }
    }
  }
  