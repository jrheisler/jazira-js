class DialogIsland extends Island {
    constructor(id, parentElement, island = null, options = {}) {
      super(id, parentElement);
  
      this.options = {
        modal: options.modal ?? false,
        position: options.position ?? 'right'
      };
  
      this.overlay = document.createElement('div');
      this.overlay.style.position = this.options.modal ? 'fixed' : 'absolute';
      this.overlay.style.zIndex = 999;
      this.overlay.style.display = 'none';
  
      const colors = theme.colors;

        Object.assign(this.overlay.style, {
        position: this.options.modal ? 'fixed' : 'absolute',
        top: '0',
        right: '0',
        width: '400px',
        height: '100%',
        zIndex: '999',
        display: 'none',        
        backgroundColor: this.options.modal ? `${colors.background}CC` : 'transparent' // Semi-transparent themed background
        });

      
  
      this.contentRoot = document.createElement('div');
      Object.assign(this.contentRoot.style, {
        position: 'absolute',
        top: '0',
        bottom: '0',
        width: '400px',
        height: '100%',
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        padding: '1rem',
        boxShadow: '0 0 10px #00000055',
        overflowY: 'auto',
        transition: 'all 0.3s ease',
        minHeight: '200px',
        minWidth: '300px',
        
      });
  
      this._setPosition(this.options.position);
      this.overlay.appendChild(this.contentRoot);
      parentElement.appendChild(this.overlay);
  
      this._initButtons();
  
      if (island) {
        this.setIsland(island);
      }
    }
  
    _initButtons() {
 
      this.doneBtn = document.createElement('button');
      this.doneBtn.textContent = '✔️ Done';
      Object.assign(this.doneBtn.style, {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        zIndex: 1000,
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        fontSize: '1rem',
        color: theme.colors.foreground
      });
      this.doneBtn.title = 'Close dialog';
      this.doneBtn.addEventListener('click', () => this.hide());
  
      this.contentRoot.appendChild(this.doneBtn);
    }
  
    _setPosition(pos) {
        this.contentRoot.style.top = '0';
        this.contentRoot.style.bottom = '0';
        this.contentRoot.style.transform = '';
        this.contentRoot.style.left = '';
        this.contentRoot.style.right = '';
      
        this.overlay.style.left = '';
        this.overlay.style.right = '';
        this.overlay.style.top = '0';
        this.overlay.style.bottom = '0';
      
        if (pos === 'right') {
          this.overlay.style.right = '0';
          this.overlay.style.left = 'auto';
          this.contentRoot.style.right = '0';
          this.contentRoot.style.left = 'auto';
        } else if (pos === 'left') {
          this.overlay.style.left = '0';
          this.overlay.style.right = 'auto';
          this.contentRoot.style.left = '0';
          this.contentRoot.style.right = 'auto';
        } else if (pos === 'center') {
          this.overlay.style.left = '0';
          this.overlay.style.right = '0';
          this.overlay.style.top = '0';
          this.overlay.style.bottom = '0';
      
          this.contentRoot.style.left = '50%';
          this.contentRoot.style.top = '50%';
          this.contentRoot.style.transform = 'translate(-50%, -50%)';
          this.contentRoot.style.width = 'max-content';
          this.contentRoot.style.maxHeight = '90vh';
        }
      }
      
    setIsland(island) {
      console.log('[DialogIsland] setIsland() called:', island);
  
      this.nestedIsland?.destroy?.();
      this.nestedIsland = island;
  
      // Clean content except buttons
      [...this.contentRoot.children].forEach(el => {
        if (el !== this.doneBtn) {
          this.contentRoot.removeChild(el);
        }
      });
  
      if (island?.rootElement) {
        console.log('[DialogIsland] Appending island.rootElement:', island.rootElement);
        this.contentRoot.appendChild(island.rootElement);
      } else {
        console.warn('[DialogIsland] island.rootElement is missing or invalid.');
        const debugBox = document.createElement('div');
        debugBox.textContent = '⚠️ No content loaded into dialog.';
        debugBox.style.color = 'red';
        debugBox.style.paddingTop = '2rem';
        this.contentRoot.appendChild(debugBox);
      }
    }
  
    show() {
      console.log('[DialogIsland] show()');
      this.overlay.style.display = 'block';
    }
  
    hide() {
      console.log('[DialogIsland] hide()');
      this.overlay.style.display = 'none';
    }
  
    close() {
      console.log('[DialogIsland] close()');
      this.hide();
      this.nestedIsland?.destroy?.();
      this.nestedIsland = null;
  
      [...this.contentRoot.children].forEach(el => {
        if (el !== this.doneBtn) {
          this.contentRoot.removeChild(el);
        }
      });
    }
  }
  