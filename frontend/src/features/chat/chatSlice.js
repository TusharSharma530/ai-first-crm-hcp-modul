import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, sessionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/chat/`, {
        message,
        session_id: sessionId,
      }, { timeout: 30000 });
      return response.data;
    } catch (error) {
      let errorMsg = 'Something went wrong. Please try again.';
      if (error.code === 'ECONNABORTED') {
        errorMsg = 'Request timed out. Please try again.';
      } else if (!error.response) {
        errorMsg = 'Cannot connect to server. Please check if backend is running.';
      } else if (error.response?.status === 429) {
        errorMsg = '⏳ Too many requests. Please wait a minute and try again.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      return rejectWithValue(errorMsg);
    }
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
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
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
        state.error = action.payload || 'Something went wrong';
        state.messages.push({
          role: 'assistant',
          content: action.payload || 'Sorry, something went wrong. Please try again.',
          isError: true,
        });
      });
  },
});

export const { addUserMessage, clearChat, clearError } = chatSlice.actions;
export default chatSlice.reducer;
