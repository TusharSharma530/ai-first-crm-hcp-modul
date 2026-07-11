import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/api\/?$/, '');

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/interactions/`, { timeout: 10000 });
      return response.data;
    } catch (error) {
      let errorMsg = 'Failed to load interactions';
      if (!error.response) {
        errorMsg = 'Cannot connect to server';
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const createInteraction = createAsyncThunk(
  'interactions/create',
  async (interactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/interactions/`, interactionData, { timeout: 10000 });
      return response.data;
    } catch (error) {
      let errorMsg = 'Failed to create interaction';
      if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteInteraction = createAsyncThunk(
  'interactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/interactions/${id}`, { timeout: 10000 });
      return id;
    } catch (error) {
      let errorMsg = 'Failed to delete interaction';
      if (!error.response) {
        errorMsg = 'Cannot connect to server';
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateInteraction = createAsyncThunk(
  'interactions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/interactions/${id}`, data, { timeout: 10000 });
      return response.data;
    } catch (error) {
      let errorMsg = 'Failed to update interaction';
      if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      return rejectWithValue(errorMsg);
    }
  }
);

const interactionSlice = createSlice({
  name: 'interactions',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load interactions';
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create interaction';
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      .addCase(deleteInteraction.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete interaction';
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInteraction.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update interaction';
      });
  },
});

export const { clearError } = interactionSlice.actions;
export default interactionSlice.reducer;
