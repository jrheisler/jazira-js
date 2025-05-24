class SelectorWidget extends StatefulWidget {
    constructor(id, parentElement, options = [], initial = null) {
      super(id, parentElement);
      this.options = options;
      this.selectStream = new Stream(initial || (options[0]?.value || ''));
      this.setState({ value: this.selectStream.get() });
  
      this.select = document.createElement('select');
      this.select.classList.add('jazira-dropdown');
  
      options.forEach(({ label, value }) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = label;
        this.select.appendChild(opt);
      });
  
      this.select.value = this.state.get().value;
  
      this.select.addEventListener('change', (e) => {
        const newValue = e.target.value;
        this.setState({ value: newValue });
        this.selectStream.set(newValue);
      });
  
      this.root.appendChild(this.select);
  
      this.styleElement({ display: 'inline-block' });
        // Subscribe to theme changes and re-style the select
        if (!theme.themeChanged) {
            theme.themeChanged = new Stream(theme.activePaletteKey);
        }
        
        this.observe(theme.themeChanged, () => {
            theme.styleElement(this.select, {
            padding: '0.25rem 0.5rem',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            lineHeight: '1.2',
            color: theme.colors.foreground,           // 🔁 force update color
            backgroundColor: theme.colors.background  // 🔁 force background too
            });
        });
  
      
  
      // ✅ Safe render binding
      this.onStateChange(() => this.render());
    }
  
    render() {
      const state = this.state.get();
      if (this.select && this.select.value !== state.value) {
        this.select.value = state.value;
      }
    }
  
    onChange(handler) {
      this.observe(this.selectStream, handler);
    }
  
    getValue() {
      return this.selectStream.get();
    }
  
    setValue(val) {
      this.setState({ value: val });
    }
  }
  
  

  class ThemeSelectorWidget extends Widget {
    constructor(id, parentElement) {
      super(id, parentElement);
  
      const themeOptions = Object.keys(theme.palettes).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key
      }));
  
      this.selector = new SelectorWidget(id + '_select', this.root, themeOptions, theme.activePaletteKey);
  
      // React to selection
      this.selector.onChange((val) => {
        theme.switchPalette(val);
        if (theme.themeChanged) {
          theme.themeChanged.set(val);
        }
      });
  
      this.root.insertBefore(document.createTextNode('Theme: '), this.selector.root);
      this.root.appendChild(this.selector.root);
  
      this.styleElement({
        outerHeight: '20px',
        padding: '0.5rem',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
      });
    }
  }
  