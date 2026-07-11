import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/complaints/');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch complaints');
    }
  }
);

export const addComplaintAsync = createAsyncThunk(
  'complaints/addComplaint',
  async (complaintData, { rejectWithValue }) => {
    try {
      const payload = {
        subject: complaintData.subject,
        description: complaintData.description || complaintData.steps || '',
        category: complaintData.category,
        priority: complaintData.priority,
        reporter_name: complaintData.name || '',
        reporter_email: complaintData.email || '',
      };
      const { data } = await api.post('/api/complaints/', payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add complaint');
    }
  }
);

export const updateComplaintStatusAsync = createAsyncThunk(
  'complaints/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/complaints/${id}`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update complaint');
    }
  }
);

export const deleteComplaintAsync = createAsyncThunk(
  'complaints/deleteComplaint',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/complaints/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete complaint');
    }
  }
);

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComplaintError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addComplaintAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addComplaintAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateComplaintStatusAsync.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateComplaintStatusAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteComplaintAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      })
      .addCase(deleteComplaintAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearComplaintError } = complaintsSlice.actions;
export default complaintsSlice.reducer;
