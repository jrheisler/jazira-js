class EditDataWidget extends Widget {
  constructor(id, parentElement, reactiveObject) {
    super(id, parentElement);
    this.reactiveObject = reactiveObject;

    // Container that holds all form fields
    this.column = Column(id + '_form', this.root, {
      gap: '0.75rem',
      align: 'start' // left-align field groups within form
    });

    // Style the outer form box
    this.styleElement({
      padding: '1rem',
      border: `1px solid ${theme.colors.accent}`,
      borderRadius: '8px',
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground,
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      fontSize: '0.9rem'
    });

    // Reapply theme on change
    this.observe(theme.themeChanged, () => {
      this.styleElement({
        padding: '1rem',
        border: `1px solid ${theme.colors.accent}`,
        borderRadius: '8px',
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        width: '100%',
        maxWidth: '360px',
        margin: '0 auto',
        fontSize: '0.9rem'
      });
    });

    // Loop through all keys in the reactive object
    for (const key in reactiveObject) {
      if (key === 'onChange') continue; // skip internal props

      // Group for label + input
      const group = Column(`${id}_${key}_group`, this.column.root, {
        gap: '0.2rem',
        align: 'start' // 👈 ensures label & input are left aligned
      });

      const label = new TextWidget(`${id}_${key}_label`, group.root, key, {
        size: '0.8rem',
        weight: 'normal'
      });

      const input = new EditTextWidget(`${id}_${key}_input`, group.root, reactiveObject[key], {
        width: '100%',
        size: '0.85rem',
        padding: '0.3rem 0.5rem'
      });

      // Two-way binding
      input.onChange.subscribe(val => {
        reactiveObject[key] = val;
      });

      reactiveObject.onChange?.(key, val => {
        input.setValue(val);
      });

      group.addWidget(label);
      group.addWidget(input);
      this.column.addWidget(group);
    }

    this.root.appendChild(this.column.root);
  }
}


function createEditorIsland(record, title = '📝 Edit Record') {
  const editorRoot = document.createElement('div');
  const editorIsland = new Island('editorIsland', editorRoot);
  const layout = Column('editorLayout', editorRoot, {
    gap: '1rem',
    align: 'center'
  });

  layout.addWidget(new TextWidget('editorTitle', layout.root, title, {
    tag: 'h3',
    align: 'center'
  }));
  layout.addWidget(new EditDataWidget('editorFields', layout.root, record));

  editorIsland.addWidget(layout);
  editorIsland.initialize();
  return editorIsland;
}

