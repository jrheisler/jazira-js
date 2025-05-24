// Jazira-JS: TextWidget (Ultra-Sugar Mode)

class TextWidget extends Widget {
    constructor(id, parentElement, content = '', options = {}) {
      super(id, parentElement);
      this.options = options;
      this.set(content, options);
    }
  
    set(content, opts = {}) {
      const {
        tag = 'p',
        size = '1rem',
        weight = 'normal',
        color = null,
        align = 'left',
        italic = false,
        underline = false,
        margin = null,
        palette = null,
        uppercase = false,
        lowercase = false,
        capitalize = false,
        monospace = false
      } = { ...this.options, ...opts };
  
      const styles = {
        fontSize: size,
        fontWeight: weight,
        textAlign: align,
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
        textTransform: uppercase ? 'uppercase' : lowercase ? 'lowercase' : capitalize ? 'capitalize' : 'none',
        fontFamily: monospace ? theme.fonts.monospace : theme.fonts.base
      };
  
      if (color) styles.color = color;
      if (margin) styles.margin = margin;
  
      // Wrap in tag and set HTML
      const html = `<${tag}>${content}</${tag}>`;
      this.setHTML(html);
      theme.styleElement(this.root, styles, palette);
    }
  
    setText(text) {
      this.set(text);
    }
  
    setStyle(overrides = {}, palette = null) {
      theme.styleElement(this.root, overrides, palette);
    }
  }
  