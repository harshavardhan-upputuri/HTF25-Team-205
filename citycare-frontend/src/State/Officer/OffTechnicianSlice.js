import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8083/api/officer";

// Fetch all technicians created by logged-in officer
export const fetchTechnicians = createAsyncThunk(
  "technician/fetchTechnicians",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/technicians`, {
        headers: { Authorization: `Bearer ${token}`},
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create a new technician
export const createTechnician = createAsyncThunk(
  "technician/createTechnician",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/create-technician`, data, {
        headers:{ Authorization: `Bearer ${token}`},
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Delete technician
export const deleteTechnician = createAsyncThunk(
  "technician/deleteTechnician",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/technicians/${id}`, {
        headers: { Authorization: `Bearer ${token}`},
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const offtechnicianSlice = createSlice({
  name: "technician",
  initialState: {
    technicians: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechnicians.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTechnicians.fulfilled, (state, action) => {
        state.loading = false;
        state.technicians = action.payload;
        state.error = null;
      })
      .addCase(fetchTechnicians.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTechnician.fulfilled, (state, action) => {
        state.technicians.push(action.payload);
      })
      .addCase(deleteTechnician.fulfilled, (state, action) => {
        state.technicians = state.technicians.filter(
          (tech) => tech.id !== action.payload
        );
      });
  },
});

export default offtechnicianSlice.reducer;
