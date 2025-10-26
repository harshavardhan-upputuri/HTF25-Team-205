import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const getAuthHeader = () => {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch Technician Profile
export const fetchTechnicianProfile = createAsyncThunk(
  "technician/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/technicians", { headers: getAuthHeader() });
      console.log(data)
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

// Update Technician Profile
export const updateTechnicianProfile = createAsyncThunk(
  "technician/updateProfile",
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/auth/technicians/${id}`, profileData, { headers: getAuthHeader() });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

// Update Technician Password
export const updateTechnicianPassword = createAsyncThunk(
  "technician/updatePassword",
  async ({ id, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/auth/technicians/${id}/password`,
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

const TechnicianSlice = createSlice({
  name: "technician",
  initialState,
  reducers: {
    clearTechnicianError: (state) => { state.error = null; },
    clearPasswordSuccessMessage: (state) => { state.updatePasswordSuccessMessage = null; },
    clearTechnicianProfile: (state) => { state.profile = null; state.loading = false; state.error = null; state.updatePasswordSuccessMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchTechnicianProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTechnicianProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchTechnicianProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.profile = null; })

      // Update Profile
      .addCase(updateTechnicianProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateTechnicianProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(updateTechnicianProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Update Password
      .addCase(updateTechnicianPassword.pending, (state) => { state.loading = true; state.error = null; state.updatePasswordSuccessMessage = null; })
      .addCase(updateTechnicianPassword.fulfilled, (state, action) => { state.loading = false; state.updatePasswordSuccessMessage = action.payload; })
      .addCase(updateTechnicianPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.updatePasswordSuccessMessage = null; });
  },
});

export const { clearTechnicianError, clearPasswordSuccessMessage, clearTechnicianProfile } = TechnicianSlice.actions;
export default TechnicianSlice.reducer;
