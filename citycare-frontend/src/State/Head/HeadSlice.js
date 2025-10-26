import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8083/api/head";

// Helper to get token
const getToken = () => localStorage.getItem("jwt");

// ---------------- ASYNC THUNKS ----------------

// HEAD INFO
export const fetchHead = createAsyncThunk(
  "head/fetchHead",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateHead = createAsyncThunk(
  "head/updateHead",
  async (data, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.put(`${API_BASE}/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "head/updatePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.put(
        `${API_BASE}/me/password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// OFFICERS CRUD
export const fetchOfficers = createAsyncThunk(
  "head/fetchOfficers",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE}/officers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createOfficer = createAsyncThunk(
  "head/createOfficer",
  async (officerData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.post(`${API_BASE}/create-officer`, officerData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteOfficer = createAsyncThunk(
  "head/deleteOfficer",
  async (officerId, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(`${API_BASE}/officers/${officerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return officerId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- SLICE ----------------
const headSlice = createSlice({
  name: "head",
  initialState: {
    headInfo: null,
    officers: [],
    loading: false,
    error: null,
    passwordMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // HEAD INFO
      .addCase(fetchHead.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchHead.fulfilled, (state, action) => { state.loading = false; state.headInfo = action.payload; })
      .addCase(fetchHead.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateHead.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateHead.fulfilled, (state, action) => { state.loading = false; state.headInfo = action.payload; })
      .addCase(updateHead.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null; state.passwordMessage = ""; })
      .addCase(updatePassword.fulfilled, (state, action) => { state.loading = false; state.passwordMessage = action.payload; })
      .addCase(updatePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // OFFICERS CRUD
      .addCase(fetchOfficers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOfficers.fulfilled, (state, action) => { state.loading = false; state.officers = action.payload; })
      .addCase(fetchOfficers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createOfficer.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOfficer.fulfilled, (state, action) => { state.loading = false; state.officers.push(action.payload); })
      .addCase(createOfficer.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteOfficer.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteOfficer.fulfilled, (state, action) => { state.loading = false; state.officers = state.officers.filter(o => o.id !== action.payload); })
      .addCase(deleteOfficer.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default headSlice.reducer;
