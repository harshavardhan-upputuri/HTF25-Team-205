import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api"; // Import our new api wrapper

// --- Async Thunks ---

/**
 * Thunk to send an OTP for login or signup.
 * Matches: POST /auth/send-otp
 */
export const sendLoginSignupOtp = createAsyncThunk(
  "auth/sendLoginSignupOtp",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/send-otp", { email, role });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error sending OTP");
    }
  }
);



/**
 * Thunk to log in with EITHER password or OTP.
 * Matches: POST /auth/login
 */
export const login = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    // loginData can be { email, password } or { email, otp }
    try {
      const { data } = await api.post("/auth/login", loginData);
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("role", data.role);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

/**
 * Thunk to sign up a new Citizen.
 * Matches: POST /auth/signup
 */
export const signup = createAsyncThunk(
  "auth/signup",
  async (signupData, { rejectWithValue }) => {
    // signupData: { name, email, password, phone, otp }
    try {
      const { data } = await api.post("/auth/signup", signupData);
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("role", data.role);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

/**
 * Thunk to fetch the logged-in user's profile.
 * Assumes a generic /api/users/profile endpoint like your example.
 */
// export const fetchUserProfile = createAsyncThunk(
//   "auth/fetchUserProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       // This endpoint is an assumption based on your example.
//       // You might need to create this on your backend.
//       const { data } = await api.get("/api/users/profile");
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to fetch profile");
//     }
//   }
// );

/**
 * Thunk to update the logged-in user's profile.
 * Assumes a generic /api/users/profile endpoint like your example.
 */
// export const updateUserProfile = createAsyncThunk(
//   "auth/updateUserProfile",
//   async (userData, { rejectWithValue }) => {
//     try {
//       // This endpoint is an assumption based on your example.
//       const { data } = await api.put("/api/users/profile", userData);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to update profile");
//     }
//   }
// );

/**
 * Thunk to log out. This is a client-side action.
 */
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.clear();
  return null; // No payload needed
});


// --- Slice Definition ---

const initialState = {
  jwt: localStorage.getItem('jwt') || null,
  role: localStorage.getItem('role') || null,
  isLoggedIn: !!localStorage.getItem('jwt'), // This answers "how do I know I'm logged in"
  user: null,
  loading: false,
  error: null,
  otpSent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Standard reducer to clear errors
    clearError: (state) => {
      state.error = null;
    },
    // Reducer to reset OTP state if user goes back
    resetOtpState: (state) => {
      state.otpSent = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendLoginSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginSignupOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendLoginSignupOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.otpSent = false; // Reset OTP state
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.otpSent = false; // Reset OTP state
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Profile
    //   .addCase(fetchUserProfile.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchUserProfile.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload;
    //     state.isLoggedIn = true; // Ensure logged in state is true
    //   })
    //   .addCase(fetchUserProfile.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //     // If fetching profile fails, token is bad, so log out
    //     state.isLoggedIn = false;
    //     state.jwt = null;
    //     state.role = null;
    //   })

    //   // Update User Profile
    //   .addCase(updateUserProfile.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(updateUserProfile.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload; // Update user state with new profile
    //   })
    //   .addCase(updateUserProfile.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.jwt = null;
        state.role = null;
        state.isLoggedIn = false;
        state.user = null;
        state.otpSent = false;
        state.error = null;
      });
  },
});

export const { clearError, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
