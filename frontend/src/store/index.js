import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from '../features/interactions/interactionSlice';
import chatReducer from '../features/chat/chatSlice';
import complaintsReducer from '../features/helpdesk/complaintsSlice';

export const store = configureStore({
  reducer: {
    interactions: interactionReducer,
    chat: chatReducer,
    complaints: complaintsReducer,
  },
});

export default store;
