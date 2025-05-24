class HorizontalRuleWidget extends Widget {
    constructor(id, parentElement, height = '1px') {
      super(id, parentElement);
  
      this.line = document.createElement('div');
      this.root.style.width = '100%'; // ✅ Ensure container stretches
      this.root.style.padding = '0';  // ✅ Remove internal spacing
      this.root.style.margin = '1rem 0';
  
      this.root.appendChild(this.line);
  
      this.render(height);
  
      // 🔁 React to theme changes
      if (!theme.themeChanged) {
        theme.themeChanged = new Stream(theme.activePaletteKey);
      }
  
      this.observe(theme.themeChanged, () => this.render(height));
    }
  
    render(height) {
      theme.styleElement(this.line, {
        width: '100%',
        height: height,
        backgroundColor: theme.colors.accent,
        border: 'none',
        opacity: '0.25',
        margin: '0',
        padding: '0',
        display: 'block',
        boxSizing: 'border-box'
      });
    }
  }
    