function createHomeIsland(root, islandManager) {
  const homeIsland = new Island('homeIsland', root);

  const layout = Column('mainLayout', root, {
    gap: '1.5rem',
    align: 'center'
  });

  // 🧾 Static data
  const jsonData = [
    { id: 1, name: 'Jeff Heisler', role: 'Admin' },
    { id: 2, name: 'Ella Smith', role: 'Editor' },
    { id: 3, name: 'Mo Davies', role: 'Viewer' },
    { id: 4, name: 'Sam Sammamba', role: 'Admin' },
    { id: 5, name: 'Ava Ivanka', role: 'Editor' },
    { id: 6, name: 'Liam Neesan', role: 'Viewer' },
    { id: 7, name: 'Mia Mouse', role: 'Editor' },
    { id: 8, name: 'Noah Adam', role: 'Admin' },
    { id: 9, name: 'Zoe Kravitz', role: 'Viewer' },
    { id: 10, name: 'Leo Decaprio', role: 'Editor' }
  ];

  // 🔁 Reactive records
  const records = jsonData.map(data => homeIsland.createReactiveObject(data));
  homeIsland.records = records;

  // 🖥️ Browser widget handles its own dialog
  const browser = new BrowseDataWidget('browseUsers', layout.root, records, homeIsland);

  layout.addWidget(new TextWidget('title', layout.root, '📋 User List + Editor', {
    tag: 'h2',
    align: 'center'
  }));
  layout.addWidget(hr(layout.root));
  layout.addWidget(browser);

  homeIsland.addWidget(layout);
  return { island: homeIsland };
}
