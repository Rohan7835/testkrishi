import { applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import thunk from "redux-thunk";
import reducer from "./reducers/reducer";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);

// export default () => {
//     const persistedReducer = persistReducer(persistConfig, reducer)
//     const store = createStore(persistedReducer, applyMiddleware(thunk))
//     const persistor = persistStore(store)
//     return { store, persistor}
// }
