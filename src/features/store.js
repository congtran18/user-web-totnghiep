import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import wishlistReducer from "./wishlistSlice";
import { apiSlice } from "./productSlice";
import storageReducer from "./storageSlice"
import registerTutorReducer from "./registerTutorSlice"
import tutorCalendarReducer from "./tutorCalendarSlice"
import chatTutorReducer from "./chatTutorSlice"
import courseHistoryReducer from "./courseHistorySlice"
import reviewTutorReducer from "./reviewTutorSlice"
// import productReducer from "./productSlice";
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  blacklist: ['user', 'apiSlice', 'tutorCalendar', 'chatTutor', 'courseHistory', 'reviewTutor'],
  version: 1,
  storage,
}

const rootReducer = combineReducers({ user: userReducer, cart: cartReducer, [apiSlice.reducerPath]: apiSlice.reducer, wishlist: wishlistReducer, storage: storageReducer, registerTutor: registerTutorReducer, tutorCalendar: tutorCalendarReducer, chatTutor: chatTutorReducer, courseHistory: courseHistoryReducer, reviewTutor : reviewTutorReducer})
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }).concat(apiSlice.middleware)
});

export let persistor = persistStore(store)
