import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from '../features/interactions/interactionSlice';
import chatReducer from '../features/chat/chatSlice';
import complaintsReducer from '../features/helpdesk/complaintsSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interactions: interactionReducer,
    chat: chatReducer,
    complaints: complaintsReducer,
  },
});

export default store;
