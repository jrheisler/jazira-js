// js/common/HeaderWidget.js

class HeaderWidget extends Widget {
    constructor(id, parent) {
      super(id, parent);
      this.navStream = new Stream('home');
  
      // 🧱 Create horizontal layout row
      const row = Row(id + '_row', this.root, {
        gap: '1rem',
        justify: 'space-between',
        align: 'center',
        palette: ''
      });
  
      // 🧭 Navigation buttons
      const navBar = new NavBarWidget(id + '_nav', row.root, [
        { id: 'navHome', label: '🏠 Home', value: 'home' },
        { id: 'navProfile', label: '👤 Profile', value: 'profile' }
      ]);
  
      navBar.onChange(val => this.navStream.set(val));
  
      // 🎨 Theme selector
      const themePicker = new ThemeSelectorWidget(id + '_theme', row.root);
  
      // ✅ Add nav + theme widgets to layout
      row.addWidget(navBar);
      row.addWidget(themePicker);

      // ✅ Add the layout row to this widget's root
      this.root.appendChild(row.root);
      
      this.styleElement({ compact: true });
      row.styleElement({ compact: true });

    }
  
    // 🔁 Pass through nav changes
    onChange(handler) {
      this.observe(this.navStream, handler);
    }
  }
  