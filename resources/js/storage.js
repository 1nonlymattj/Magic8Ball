window.HistoryStore = {

  add(entry) {
    const items = this.exportAll();
    items.unshift(entry);
    localStorage.setItem(window.STORAGE.key, JSON.stringify(items));
  },

  listNewest(limit) {
    return this.exportAll().slice(0, limit);
  },

  exportAll() {
    try {
      const raw = localStorage.getItem(window.STORAGE.key);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  },

  clear() {
    localStorage.removeItem(window.STORAGE.key);
  }
};