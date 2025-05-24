// js/islands/profileIsland.js

function createProfileIsland(root, islandManager) {
  const profileIsland = new Island('profileIsland', root);

  const layout = Column('profileLayout', root, {
    gap: '1.5rem',
    align: 'center'
  });

  layout.addWidget(new TextWidget('profileTitle', layout.root, '👤 Profile Info', {
    tag: 'h2',
    align: 'center'
  }));

  const profileData = {
    fullName: 'Ella Smith',
    email: 'ella.smith@example.com',
    phone: '555-123-4567',
    username: 'ellasmith',
    bio: 'Enthusiastic editor and traveler.',
    location: 'San Francisco, CA',
    website: 'https://ellasmith.me',
    twitter: '@ellawrites',
    company: 'EditPro Inc.',
    position: 'Senior Editor'
  };
  

  const profile = profileIsland.createReactiveObject(profileData);

  for (const key in profileData) {
    const row = Column(`row_${key}`, layout.root, {
      gap: '0.25rem',
      align: 'start'
    });

    const label = new TextWidget(`label_${key}`, row.root, key, {
      size: '0.9rem',
      weight: 'bold'
    });

    const input = new EditTextWidget(`input_${key}`, row.root, profile[key], {
      width: '300px'
    });

    // Sync input -> data
    input.onChange.subscribe(val => profile[key] = val);

    // Sync data -> input
    profile.onChange?.(key, val => input.setValue(val));

    row.addWidget(label);
    row.addWidget(input);
    layout.addWidget(row);
  }

  profileIsland.addWidget(layout);
  return profileIsland;
}
