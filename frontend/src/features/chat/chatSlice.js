import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, sessionId }) => {
    const response = await axios.post(`${API_URL}/chat/`, {
      message,
      session_id: sessionId,
    });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    sessionId: null,
    status: 'idle',
    error: null,
    toolUsed: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
      state.sessionId = null;
      state.toolUsed = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sessionId = action.payload.session_id;
        state.toolUsed = action.payload.tool_used;
        state.messages.push({
          role: 'assistant',
          content: action.payload.response,
          toolUsed: action.payload.tool_used,
          extractedData: action.payload.extracted_data,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
