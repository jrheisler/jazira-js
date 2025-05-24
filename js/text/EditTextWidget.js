class EditTextWidget extends StatefulWidget {
    constructor(id, parentElement, initial = '', options = {}) {
      super(id, parentElement);
      this.options = options;
      this.palette = options.palette || null;
  
      this.onChange = new Stream(initial);
      this.setState({ value: initial });
  
      // 🔧 Input Element
      this.inputEl = document.createElement('input');
      this.inputEl.type = 'text';
      this.inputEl.placeholder = options.placeholder || '';
      this.inputEl.classList.add('jazira-input');
  
      // 👂 Handle user input only
      this.inputEl.addEventListener('input', (e) => {
        const newValue = e.target.value;
        this.setState({ value: newValue });
        this.onChange.set(newValue); // 🔁 Only here!
      });
  
      this.root.appendChild(this.inputEl);
  
      // 🎨 Update on state or theme change
      this.onStateChange(() => this.render());
      this.observe(theme.themeChanged, () => this.render());
    }
  
    render(state = this.state.get()) {
      if (!this.inputEl) return;
  
      const {
        size = '1rem',
        width = '100%',
        color = null,
        monospace = false
      } = this.options || {};
  
      const styles = {
        fontSize: size,
        width: width,
        fontFamily: monospace ? theme.fonts.monospace : theme.fonts.base,
        backgroundColor: theme.colors.primary,
        color: color || theme.colors.foreground,
        border: 'none',
        borderRadius: '4px'
      };
  
      // 🔁 Avoid unnecessary overwrite
      if (this.inputEl.value !== state.value) {
        this.inputEl.value = state.value;
      }
  
      this.styleElement(styles, this.palette);
    }
  
    getValue() {
      return this.state.get().value;
    }
  
    setValue(val) {
      // ✅ Prevent unnecessary re-renders / loops
      if (this.state.get().value === val) return;
      this.setState({ value: val }); // onChange NOT triggered here
    }
  }
  