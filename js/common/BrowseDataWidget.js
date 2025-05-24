class BrowseDataWidget extends Widget {
    constructor(id, parentElement, records = [], island) {
      super(id, parentElement);
      this.records = records;
      this.island = island;
      this.selectedStream = island.createStream('selectedRecord', records[0] || null);
      this.hoveredId = null;
  
      // 🌐 Layout: Side-by-side flex container
      this.container = document.createElement('div');
      this.container.style.display = 'flex';
      this.container.style.flexDirection = 'row';
      this.container.style.gap = '1rem';
      this.root.appendChild(this.container);
  
      // 📋 Table side
      this.table = document.createElement('table');
      this.table.style.borderCollapse = 'collapse';
      this.table.style.width = '100%';
      this.table.style.flex = '1';
  
      theme.styleElement(this.table, {
        border: `1px solid ${theme.colors.accent}`,
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: `0 0 4px ${theme.colors.accent}22`,
      });
  
      this.container.appendChild(this.table);
  
      // 🧩 Inline Dialog on the side
      this.dialog = new DialogIsland(`${id}_dialog`, this.container, null, {
        modal: false,
        position: 'right'
      });
  
      this.columns = this._deriveColumns(records);
      this._renderHeader();
      this._renderRows();
  
      this.observe(theme.themeChanged, () => {
        this._renderHeader();
        this._renderRows();
      });
    }
  
    _deriveColumns(records) {
      const keys = new Set();
      records.forEach(record => {
        Object.keys(record).forEach(k => {
          if (typeof record[k] !== 'function' && k !== 'onChange') {
            keys.add(k);
          }
        });
      });
      return Array.from(keys);
    }
  
    _renderHeader() {
      this.table.innerHTML = '';
      const thead = document.createElement('thead');
      const row = document.createElement('tr');
  
      this.columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        th.style.padding = '0.5rem';
        th.style.backgroundColor = theme.colors.secondary;
        th.style.color = theme.colors.foreground;
        th.style.textAlign = 'left';
        th.style.borderBottom = `1px solid ${theme.colors.accent}`;
        row.appendChild(th);
      });
  
      thead.appendChild(row);
      this.table.appendChild(thead);
    }
  
    _renderRows() {
      const tbody = document.createElement('tbody');
  
      this.records.forEach((record, rowIndex) => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.style.transition = 'background 0.2s';
  
        const updateRowStyle = () => {
          const selected = this.selectedStream.get() === record;
          row.style.backgroundColor = selected
            ? theme.colors.accent
            : rowIndex % 2 === 0
              ? theme.colors.background
              : `${theme.colors.background}22`;
          row.style.color = theme.colors.foreground;
        };
  
        this.observe(this.selectedStream, updateRowStyle);
        updateRowStyle();
  
        row.addEventListener('click', () => {
          this.selectedStream.set(record);
  
          const editorRoot = document.createElement('div');
          const editorIsland = new Island(`${this.id}_editorIsland`, editorRoot);
  
          const layout = Column(`${this.id}_editorLayout`, editorRoot, {
            gap: '1rem',
            align: 'center'
          });
  
          layout.addWidget(new TextWidget(`${this.id}_title`, layout.root, '📝 Edit Record', {
            tag: 'h3',
            align: 'center'
          }));
  
          layout.addWidget(new EditDataWidget(`${this.id}_editor`, layout.root, record));
          editorIsland.addWidget(layout);
          editorIsland.initialize();
  
          this.dialog.setIsland(editorIsland);
          this.dialog.show();
        });
  
        row.addEventListener('mouseover', () => {
          row.style.backgroundColor = `${theme.colors.accent}33`;
        });
  
        row.addEventListener('mouseout', updateRowStyle);
  
        this.columns.forEach(col => {
          const cell = document.createElement('td');
          cell.textContent = record[col] ?? '';
          cell.style.padding = '0.5rem';
          cell.style.borderBottom = `1px solid ${theme.colors.secondary}`;
          row.appendChild(cell);
  
          record.onChange?.(col, val => {
            cell.textContent = val;
          });
        });
  
        tbody.appendChild(row);
      });
  
      this.table.appendChild(tbody);
    }
  
    getSelectedStream() {
      return this.selectedStream;
    }
  }
  