// Jazira-JS: Theme Class with Palettes + Reactive Change Notification

class Theme {
    constructor() {
      this.palettes = {
        aurora: {
          background: '#1B1D36',
          foreground: '#FFFFFF',
          primary: '#8E44AD',
          secondary: '#5B2C6F',
          accent: '#F39C12',
          danger: '#E74C3C'
        },
        desert: {
          background: '#2F2A1E',
          foreground: '#FFECCC',
          primary: '#D4A055',
          secondary: '#A9743F',
          accent: '#F2C777',
          danger: '#A65334'
        },
        horizon: {
          background: '#BEE3F8',
          foreground: '#1A202C',
          primary: '#3D5A80',
          secondary: '#98C1D9',
          accent: '#EE6C4D',
          danger: '#E63946'
        },
        twilight: {
            background: '#0D1B2A',
            foreground: '#E0E1DD',
            primary: '#1B263B',
            secondary: '#415A77',
            accent: '#778DA9',
            danger: '#E5383B'
          },
          
          forest: {
            background: '#1E2D24',
            foreground: '#F0FFF0',
            primary: '#2E8B57',
            secondary: '#3CB371',
            accent: '#B4E197',
            danger: '#FF6B6B'
          },
          
          sunset: {
            background: '#2F0E3C',
            foreground: '#FDEBD0',
            primary: '#FF6F61',
            secondary: '#D7263D',
            accent: '#F4A261',
            danger: '#9B1D20'
          },
          
          ocean: {
            background: '#001F3F',
            foreground: '#F0F8FF',
            primary: '#0074D9',
            secondary: '#7FDBFF',
            accent: '#39CCCC',
            danger: '#FF4136'
          },
          
          pastel: {
            background: '#FFF1F0',
            foreground: '#3A3A3A',
            primary: '#A5D8FF',
            secondary: '#D0BFFF',
            accent: '#FFC6FF',
            danger: '#FF8787'
          }          
      };
  
      // 🌐 Load from localStorage or fallback
      this.activePaletteKey = localStorage.getItem('jazira-theme') || 'aurora';

      this.themeChanged = new Stream(this.activePaletteKey); // 🔁 notify listeners
  
      this.spacing = {
        padding: '10px',
        margin: '8px'
      };
  
      this.fonts = {
        base: 'system-ui, sans-serif',
        monospace: 'monospace'
      };
    }
  
    get colors() {
      return this.palettes[this.activePaletteKey];
    }
  
    switchPalette(name) {
      if (this.palettes[name]) {
        this.activePaletteKey = name;
        // 💾 Save to localStorage
        localStorage.setItem('jazira-theme', name);
        this.applyGlobalStyles();
        this.themeChanged.set(name); // 🔔 trigger update
      }
    }
  
    applyGlobalStyles() {
      const c = this.colors;
      const existingStyle = document.getElementById('jazira-theme-style');
      if (existingStyle) existingStyle.remove();
  
      const style = document.createElement('style');
      style.id = 'jazira-theme-style';
      style.innerHTML = `
        body {
          background-color: ${c.background};
          color: ${c.foreground};
          font-family: ${this.fonts.base};
          margin: 0;
          padding: 0;
        }
        .widget {
          padding: ${this.spacing.padding};
          margin: ${this.spacing.margin};
          border-radius: 4px;
          background-color: ${c.primary};
          color: ${c.foreground};
        }
        .button {
          background-color: ${c.secondary};
          color: ${c.foreground};
          border: none;
          padding: ${this.spacing.padding};
          margin: ${this.spacing.margin};
          border-radius: 4px;
          cursor: pointer;
          font-family: ${this.fonts.base};
        }
        .hidden {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  
    styleElement(el, options = {}, paletteKey = null) {
      const c = this.palettes[paletteKey || this.activePaletteKey];
      const compact = options.compact ?? true;

      Object.assign(el.style, {
        padding: compact ? '1px 2px' : this.spacing.padding,
        margin: compact ? '2px' : this.spacing.margin,
        color: c.foreground,
        backgroundColor: c.primary,
        fontFamily: this.fonts.base,
        borderRadius: '4px',
        ...options
      });
    }
  }
  
  // Singleton instance
  const theme = new Theme();
  theme.applyGlobalStyles();
  
// ✅ In HorizontalRuleWidget.js or theme.js (non-module style)
window.hr = (parent, thickness = '2px') => new HorizontalRuleWidget('', parent, thickness);
