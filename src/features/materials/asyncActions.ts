import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../app/api/api';
import { MaterialModel } from '../../app/models/components';


export const createMaterial = createAsyncThunk(
  'materials/createMaterial',
  async (materialData: MaterialModel, thunkAPI) => {
    try {
      const { data } = await api.createMaterial(materialData);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);