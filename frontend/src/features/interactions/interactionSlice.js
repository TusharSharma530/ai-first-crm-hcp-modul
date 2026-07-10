import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchAll',
  async () => {
    const response = await axios.get(`${API_URL}/interactions/`);
    return response.data;
  }
);

export const createInteraction = createAsyncThunk(
  'interactions/create',
  async (interactionData) => {
    const response = await axios.post(`${API_URL}/interactions/`, interactionData);
    return response.data;
  }
);

export const deleteInteraction = createAsyncThunk(
  'interactions/delete',
  async (id) => {
    await axios.delete(`${API_URL}/interactions/${id}`);
    return id;
  }
);

const interactionSlice = createSlice({
  name: 'interactions',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export default interactionSlice.reducer;
