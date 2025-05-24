// Jazira-JS: StatefulWidget Class (Extends Widget with Reactive State & Theme)

class StatefulWidget extends Widget {
  constructor(id, parentElement) {
    super(id, parentElement);
    this.state = new Stream({});

    // Re-render on theme change
    this.observe(theme.themeChanged, () => {
      this.render(this.state.get());
    });
  }

  // Subscribe to internal state changes
  onStateChange(handler) {
    this.observe(this.state, handler);
  }

  // Set new state by merging with current state
  setState(newState) {
    const current = this.state.get();
    this.state.set({ ...current, ...newState });
  }

  // Optionally override in subclasses
  render(state = this.state.get()) {
    this.setHTML('<em>Default render(): override this method</em>');
  }
}
