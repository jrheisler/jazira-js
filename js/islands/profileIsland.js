function createProfileIsland(root, islandManager) {
  const profileIsland = new Island('profileIsland', root);

  const layout = Column('profileLayout', root, {
    gap: '1.5rem',
    align: 'center'
  });

  const title = new TextWidget('profileTitle', layout.root, '👤 Profile Editor', {
    tag: 'h2',
    align: 'center'
  });

  layout.addWidget(title);

  layout.addWidget(
    createEditRecordPanel('profileEditor', layout.root, islandManager, {
      sourceIsland: 'home',
      stream: 'selectedUser',
      title: '📝 Profile Details'
    })
  );
  

  profileIsland.addWidget(layout);
  return profileIsland;
}
