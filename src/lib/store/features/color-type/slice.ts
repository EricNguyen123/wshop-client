/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';
import {
  IColorTypeState,
  ICreateColorTypeResponse,
  IDeleteResponse,
  IGetListColorTypesResponse,
  IUpdateColorTypeResponse,
} from '@/types/common';
import { query } from '@/constant/common';

const initialState: IColorTypeState = {
  detail: undefined,
  colorTypes: undefined,
  status: 'idle',
};

export const colorTypeSlice = createSlice({
  name: 'colorType',
  initialState,
  reducers: {
    getListColorTypesSuccess: (state, action: PayloadAction<IGetListColorTypesResponse>) => {
      state.colorTypes = action.payload.data;
      state.status = 'idle';
    },

    createColorTypeSuccess: (state, action: PayloadAction<ICreateColorTypeResponse>) => {
      const newColorType = action.payload.data;
      const currentData = state.colorTypes?.data ?? [];
      const currentTotal = state.colorTypes?.total ?? query.total;
      const currentLimit = state.colorTypes?.limit ?? query.limit;

      const updatedTotal = currentTotal + 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.colorTypes = {
        ...state.colorTypes,
        data: [newColorType, ...currentData].slice(0, currentLimit),
        total: updatedTotal,
        page: state.colorTypes?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.status = 'idle';
    },

    updateColorTypeSuccess: (state, action: PayloadAction<IUpdateColorTypeResponse>) => {
      state.detail =
        state.detail?.id === action.payload.data.id ? action.payload.data : state.detail;
      state.colorTypes = {
        ...state.colorTypes,
        data: (state.colorTypes?.data ?? []).map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        }),
        total: state.colorTypes?.total ?? query.total,
        page: state.colorTypes?.page ?? query.page,
        limit: state.colorTypes?.limit ?? query.limit,
        totalPages: state.colorTypes?.totalPages ?? query.totalPages,
      };
      state.status = 'idle';
    },

    deleteColorTypeSuccess: (state, action: PayloadAction<IDeleteResponse>) => {
      const currentTotal = state.colorTypes?.total ?? query.total;
      const currentLimit = state.colorTypes?.limit ?? query.limit;

      const updatedTotal = currentTotal - 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.colorTypes = {
        ...state.colorTypes,
        data: (state.colorTypes?.data ?? []).filter((item) => item.id !== action.payload.id),
        total: updatedTotal,
        page: state.colorTypes?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.detail = undefined;
      state.status = 'idle';
    },

    setStatus: (state, action: PayloadAction<TStatusSlice>) => {
      state.status = action.payload;
    },
  },
});

export const {
  setStatus,
  getListColorTypesSuccess,
  createColorTypeSuccess,
  updateColorTypeSuccess,
  deleteColorTypeSuccess,
} = colorTypeSlice.actions;

export const selectDetailColorType = (state: RootState) => state.colorType.detail;
export const selectStatus = (state: RootState) => state.colorType.status;
export const selectColorTypes = (state: RootState) => state.colorType.colorTypes;

export default colorTypeSlice.reducer;
