import { configureStore } from '@reduxjs/toolkit';
import localData from './LocalSlice/localSlice';
import loggedInUserReducer from './LoggedInUserSlice/loggedInUserSlice';
import discoverReducer from './DiscoverSlice/discoverSlice';

export const store = configureStore({
  reducer: {
    local: localData,
    loggedInUser: loggedInUserReducer,
    discover: discoverReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
