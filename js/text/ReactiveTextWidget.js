// Jazira-JS: ReactiveTextWidget (Extends StatefulWidget with Stream Support)

class ReactiveTextWidget extends StatefulWidget {
  constructor(id, parentElement, initial = '', options = {}) {
    super(id, parentElement);
    this.options = options;
    this.palette = options.palette || null;
    this.setState({ content: initial });
    this.onStateChange(this.render);
  }

  render(state = this.state.get()) {
    const {
      size = '1rem',
      weight = 'normal',
      color = null,
      align = 'left',
      italic = false,
      underline = false,
      margin = null,
      uppercase = false,
      lowercase = false,
      capitalize = false,
      monospace = false
    } = this.options || {};

    const styles = {
      fontSize: size,
      fontWeight: weight,
      textAlign: align,
      fontStyle: italic ? 'italic' : 'normal',
      textDecoration: underline ? 'underline' : 'none',
      textTransform: uppercase
        ? 'uppercase'
        : lowercase
        ? 'lowercase'
        : capitalize
        ? 'capitalize'
        : 'none',
      fontFamily: monospace ? theme.fonts.monospace : theme.fonts.base,
      backgroundColor: theme.colors.primary // ensure background updates
    };

    if (color) styles.color = color;
    if (margin) styles.margin = margin;

    this.root.textContent = state.content; // sets root text content
    this.styleElement(styles, this.palette); // applies and tracks style
  }

  updateText(newText) {
    this.setState({ content: newText });
  }

  setStyle(overrides = {}, palette = null) {
    this.styleElement(overrides, palette);
  }
}
