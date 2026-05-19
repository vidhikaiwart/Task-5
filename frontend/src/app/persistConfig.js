const createStorage = () => {
  return {
    getItem: (key) => {
      try {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
      } catch (error) {
        return Promise.resolve(null);
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (error) {
        return Promise.resolve();
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return Promise.resolve();
      } catch (error) {
        return Promise.resolve();
      }
    },
  };
};

const storage = createStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

export default persistConfig;