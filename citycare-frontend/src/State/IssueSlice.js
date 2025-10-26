import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8083/api/issues";

// ------------------ Async Thunks ------------------

// Citizen
export const createIssue = createAsyncThunk(
  "issue/createIssue",
  async ({ token, issueData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/create `, issueData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMyIssues = createAsyncThunk(
  "issue/fetchMyIssues",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/my-issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteIssue = createAsyncThunk(
  "issue/deleteIssue",
  async ({ token, issueId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/${issueId}`, { headers: { Authorization: `Bearer ${token}` } });
      return issueId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Officer
export const fetchAllIssues = createAsyncThunk(
  "issue/fetchAllIssues",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/all`, { headers: { Authorization: `Bearer ${token}` } });
      console.log(res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const assignTechnicians = createAsyncThunk(
  "issue/assignTechnicians",
  async ({ token, issueId, techIds }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/${issueId}/assign-technicians`, techIds, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateStatus = createAsyncThunk(
  "issues/updateStatus",
  async ({ token, issueId, status }, { rejectWithValue }) => {
    try {
      // console.log(issueId,token,status)
      const res = await axios.patch(
        `${API}/${issueId}/update-status?status=${status}`,
        null, // empty body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data; // updated issue object
    } catch (err) {
      console.error("Update Status Error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const fetchAssignedIssues = createAsyncThunk(
  "issues/fetchAssigned",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/my-assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------ Slice ------------------
const issueSlice = createSlice({
  name: "issue",
  initialState: {
    issues: [],
    myIssues: [],
     assignedIssues: [],
    loading: false,
    error: null,
    successMessage: null,
    fetched: false,
  },
  reducers: {
    clearMessages: state => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      // Create Issue
      .addCase(createIssue.pending, state => { state.loading = true; state.error = null; })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.myIssues.push(action.payload);
        state.successMessage = "Issue created successfully";
      })
      .addCase(createIssue.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch My Issues
      .addCase(fetchMyIssues.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchMyIssues.fulfilled, (state, action) => { state.loading = false; state.fetched = true; state.myIssues = action.payload; })
      .addCase(fetchMyIssues.rejected, (state, action) => { state.loading = false; state.fetched = true; state.error = action.payload; })

      // Delete Issue
      .addCase(deleteIssue.pending, state => { state.loading = true; state.error = null; })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.myIssues = state.myIssues.filter(i => i.id !== action.payload);
        state.successMessage = "Issue deleted successfully";
      })
      .addCase(deleteIssue.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch All Issues (Officer)
      .addCase(fetchAllIssues.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchAllIssues.fulfilled, (state, action) => { state.loading = false; state.issues = action.payload; })
      .addCase(fetchAllIssues.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Assign Technicians
      .addCase(assignTechnicians.pending, state => { state.loading = true; state.error = null; })
      .addCase(assignTechnicians.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.map(i => i.id === action.payload.id ? action.payload : i);
        state.successMessage = "Technicians assigned successfully";
      })
      .addCase(assignTechnicians.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Update Status (Technician)
      .addCase(updateStatus.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
         state.assignedIssues = state.assignedIssues.map(i => i.id === action.payload.id ? action.payload : i);
        state.issues = state.issues.map(i => i.id === action.payload.id ? action.payload : i);
        state.myIssues = state.myIssues.map(i => i.id === action.payload.id ? action.payload : i);
        state.successMessage = "Status updated successfully";
      })
      .addCase(updateStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAssignedIssues.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedIssues = action.payload;
      })
      .addCase(fetchAssignedIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { clearMessages } = issueSlice.actions;
export default issueSlice.reducer;
