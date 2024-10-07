
export const getLocalStorageItems = (key) => {
  if (typeof window !== 'undefined') {
    const savedItems = localStorage.getItem(key);
    return savedItems ? JSON.parse(savedItems) : [];
  }
  return [];
};

export const setLocalStorageItems = (key, items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(items));
  }
};
