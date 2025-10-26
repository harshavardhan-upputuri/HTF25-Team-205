import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8083/api/officer";

// Fetch logged-in officer profile
export const fetchOfficerProfile = createAsyncThunk(
  "officer/fetchProfile",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers:{ Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update officer profile
export const updateOfficerProfile = createAsyncThunk(
  "officer/updateProfile",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update password
export const updateOfficerPassword = createAsyncThunk(
  "officer/updatePassword",
  async ({ token, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/me/password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const officerSlice = createSlice({
  name: "officer",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    passwordMessage: null,
  },
  reducers: {
    clearPasswordMessage: (state) => {
      state.passwordMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfficerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOfficerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchOfficerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOfficerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateOfficerPassword.fulfilled, (state, action) => {
        state.passwordMessage = action.payload;
      });
  },
});

export const { clearPasswordMessage } = officerSlice.actions;
export default officerSlice.reducer;
