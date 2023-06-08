import { createSlice } from '@reduxjs/toolkit';
import { createSchedule, updateSchedule, deleteSchedule, getSchedules, getRecentMatches, getSchedule, getSchedulesByClub } from './asyncActions';
import { ISchedulesInitialState } from './types';


const initialState: ISchedulesInitialState = {
  status: 'idle',
  data: {
    main: {
      schedules: [],
      schedulesCount: 0
    },
    schedule: null,
    latestMatches: []
  },
  filters: null,
  error: null
};


const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSchedule: (state) => {
      state.data.schedule = null;
    },
    clearFilters: (state) => {
      state.filters = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSchedule.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.main.schedules.push(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      .addCase(getSchedules.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.main = action.payload;
      })
      .addCase(getSchedules.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      .addCase(getSchedulesByClub.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getSchedulesByClub.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.main = action.payload;
      })
      .addCase(getSchedulesByClub.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      .addCase(getSchedule.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.schedule = action.payload;
      })
      .addCase(getSchedule.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      .addCase(getRecentMatches.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getRecentMatches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.latestMatches = action.payload;
      })
      .addCase(getRecentMatches.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      .addCase(updateSchedule.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.main.schedules = state.data.main.schedules.map(schedule => schedule._id === action.payload._id ? action.payload : schedule);
      })
      .addCase(updateSchedule.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      .addCase(deleteSchedule.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.main = action.payload;
      })
      .addCase(deleteSchedule.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
  }
});

export const { setFilters, clearSchedule, clearFilters, clearError } = schedulesSlice.actions;

export default schedulesSlice.reducer;