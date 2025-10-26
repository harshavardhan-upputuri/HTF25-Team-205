import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const getAuthHeader = () => {
  const token = localStorage.getItem("jwt");
  
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch profile
export const fetchCitizenProfile = createAsyncThunk(
  "citizen/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/citizen/profile", { headers: getAuthHeader() });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

// Update profile (send JSON body)
export const updateCitizenProfile = createAsyncThunk(
  "citizen/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/api/citizen/profile", profileData, { headers: getAuthHeader() });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

// Update password
export const updateCitizenPassword = createAsyncThunk(
  "citizen/updatePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/api/citizen/profile/password`,
        null,
        { headers: getAuthHeader(), params: { oldPassword, newPassword } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data || "Failed to update password");
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updatePasswordSuccessMessage: null,
};

const CitizenSlice = createSlice({
  name: "citizen",
  initialState,
  reducers: {
    clearCitizenError: (state) => { state.error = null; },
    clearPasswordSuccessMessage: (state) => { state.updatePasswordSuccessMessage = null; },
    clearCitizenProfile: (state) => { state.profile = null; state.loading = false; state.error = null; state.updatePasswordSuccessMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitizenProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCitizenProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchCitizenProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.profile = null; })

      .addCase(updateCitizenProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCitizenProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(updateCitizenProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateCitizenPassword.pending, (state) => { state.loading = true; state.error = null; state.updatePasswordSuccessMessage = null; })
      .addCase(updateCitizenPassword.fulfilled, (state, action) => { state.loading = false; state.updatePasswordSuccessMessage = action.payload; })
      .addCase(updateCitizenPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.updatePasswordSuccessMessage = null; });
  },
});

export const { clearCitizenError, clearPasswordSuccessMessage, clearCitizenProfile } = CitizenSlice.actions;
export default CitizenSlice.reducer;
