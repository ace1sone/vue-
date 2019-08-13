export const getStorageItem = key => {
  const item = window.localStorage.getItem(key);
  if (typeof item !== 'string') {
    return JSON.parse(item);
  }
  return item;
};

export const setStorageItem = (key, item) => {
  if (typeof item !== 'string') {
    window.localStorage.setItem(key, JSON.stringify(item));
    return;
  }
  window.localStorage.setItem(key, item);
};

export const removeStorageItems = (...keys) => {
  keys.forEach(key => {
    window.localStorage.removeItem(key);
  });
};

export const clearStorage = () => window.localStorage.clear();
