document.addEventListener('DOMContentLoaded', () => {
    theme.applyGlobalStyles();
  
    const islandManager = new IslandManager();
  


    const homeRoot = document.getElementById('homeRoot');
    const profileRoot = document.getElementById('profileRoot');
    const headerRoot = document.getElementById('headerBar');
    
    const { island: homeIsland, reactiveText } = createHomeIsland(homeRoot, islandManager);
    islandManager.register('home', homeIsland);  // ✅ Must happen BEFORE profile
    
    const profileIsland = createProfileIsland(profileRoot, islandManager);
    islandManager.register('profile', profileIsland);
    
  
    const header = new HeaderWidget('header', headerRoot);
   
    header.onChange(name => showIsland(name));
  
    homeIsland.initialize();
    profileIsland.initialize();
    showIsland('home');
  
    function showIsland(name) {
      document.querySelectorAll('.island-root').forEach(el => el.style.display = 'none');
      document.getElementById(`${name}Root`).style.display = 'block';
      islandManager.activate(name);
    }
  

  });
    