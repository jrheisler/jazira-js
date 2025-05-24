// Jazira-JS: LayoutWidget (extends Widget)

class LayoutWidget extends Widget {
  constructor(id, parentElement, options = {}) {
    super(id, parentElement);
    this.options = options;
    this.children = [];
    this.palette = options.palette || null;

    const {
      direction = 'row',
      gap = '1rem',
      align = 'stretch',
      justify = 'start',
      padding = null,
      wrap = true // ✅ new sugar option
    } = options;

    const styles = {
      display: 'flex',
      flexDirection: direction,
      gap: gap,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap' // ✅ auto-wrap if needed
    };

    if (padding) styles.padding = padding;

    this.styleElement(styles, this.palette);
  }

  addWidget(widget) {
    this.children.push(widget);
    this.root.appendChild(widget.root);
  }
}

// Sugar helpers
const Row = (id, parent, options = {}) =>
  new LayoutWidget(id, parent, { direction: 'row', ...options });

const Column = (id, parent, options = {}) =>
  new LayoutWidget(id, parent, { direction: 'column', ...options });
