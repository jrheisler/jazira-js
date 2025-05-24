class NavBarWidget extends Widget {
    constructor(id, parent, options = []) {
      super(id, parent);
      this.navStream = new Stream(options[0]?.value || '');
      this.buttons = [];
  
      const row = Row(id + '_row', this.root, {
        gap: '0.5rem',
        align: 'center',
        justify: 'start'
      });
  
      options.forEach(opt => {
        const btn = new NavButtonWidget(opt.id, row.root, opt.label, opt.value, this.navStream);
        row.addWidget(btn);
        this.buttons.push(btn);
      });
  
      this.addClass('nav-bar');
      this.styleElement({
        marginBottom: '1rem'
      });
    }
  
    onChange(handler) {
      this.observe(this.navStream, handler);
    }
  
    getValue() {
      return this.navStream.get();
    }
  
    setValue(val) {
      this.navStream.set(val);
    }
  }
  


  class NavButtonWidget extends StatefulWidget {
    constructor(id, parent, label, value, navStream) {
      super(id, parent);
      this.value = value;
      this.navStream = navStream;
  
      this.setState({ active: false });
  
      // Create the actual <button>
      this.button = document.createElement('button');
      this.button.textContent = label;
      this.root.appendChild(this.button);
  
      // Click behavior: updates the stream
      this.button.addEventListener('click', () => {
        this.navStream.set(this.value);
      });
  
      // Subscribe to selection stream
      this.observe(this.navStream, (val) => {
        this.setState({ active: val === this.value });
      });
  
      // Subscribe to state changes
      this.onStateChange(() => this.render());
  
      // Also re-style when theme changes
      this.observe(theme.themeChanged, () => this.applyTheme());
      
      // Initial render
      this.applyTheme();
    }
  
    applyTheme() {
      const state = this.state.get();
      if (!this.button) return;
  
      theme.styleElement(this.button, {
        padding: '0.4rem 1rem',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontFamily: theme.fonts.base,
        color: theme.colors.foreground,
        backgroundColor: state.active
          ? theme.colors.accent
          : theme.colors.secondary
      });
    }
  
    render(state = this.state.get()) {
      if (!this.button) return;
      this.button.style.backgroundColor = state.active
        ? theme.colors.accent
        : theme.colors.secondary;
    }
  }
  
