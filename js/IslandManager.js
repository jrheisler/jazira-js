class IslandManager {
    constructor() {
      this.islands = {};
      this.activeIsland = null;
    }
  
    // 🔗 Register an island
    register(name, island) {
      this.islands[name] = island;
    }
  
    // 🚀 Activate one island (deactivates current)
    activate(name) {
      if (this.activeIsland && this.activeIsland !== this.islands[name]) {
        this.activeIsland.deactivate();
      }
  
      const newIsland = this.islands[name];
      if (!newIsland) {
        console.warn(`Island '${name}' not found`);
        return;
      }
  
      if (!newIsland.isActive) {
        newIsland.initialize();
      }
  
      newIsland.activate();
      this.activeIsland = newIsland;
    }
  
    // 🌍 Get or create a shared stream
    getStream(name, initial = '') {
      if (!this._sharedStreams[name]) {
        this._sharedStreams[name] = new Stream(initial);
      }
      return this._sharedStreams[name];
    }
  
    // 📤 Emit a value to a named shared stream
    emitTo(name, value) {
      this.getStream(name).set(value);
    }
  
    // 🧼 Deactivate an island
    deactivate(name) {
      const island = this.islands[name];
      if (island && island.isActive) {
        island.deactivate();
      }
      if (this.activeIsland === island) {
        this.activeIsland = null;
      }
    }
  
    // 💣 Destroy a single island
    destroy(name) {
      const island = this.islands[name];
      if (island) {
        island.destroy();
        delete this.islands[name];
      }
    }
  
    // 💥 Destroy all islands
    destroyAll() {
      Object.values(this.islands).forEach(i => i.destroy());
      this.islands = {};
      this.activeIsland = null;
    }
  

    getSharedState(islandName, key) {
        const island = this.islands[islandName];
        if (!island) {
          console.warn(`Island '${islandName}' not found in getSharedState.`);
          return new Stream(null); // return dummy fallback to avoid crash
        }
        return island.getStream(key) || island.createStream(key, null);
      }
      
      

  }
  