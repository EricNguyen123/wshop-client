/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';
import {
  ICreateSizeTypeResponse,
  IDeleteResponse,
  IGetListSizeTypesResponse,
  ISizeTypeState,
  IUpdateSizeTypeResponse,
} from '@/types/common';
import { query } from '@/constant/common';

const initialState: ISizeTypeState = {
  detail: undefined,
  sizeTypes: undefined,
  status: 'idle',
};

export const sizeTypeSlice = createSlice({
  name: 'sizeType',
  initialState,
  reducers: {
    getListSizeTypesSuccess: (state, action: PayloadAction<IGetListSizeTypesResponse>) => {
      state.sizeTypes = action.payload.data;
      state.status = 'idle';
    },

    createSizeTypeSuccess: (state, action: PayloadAction<ICreateSizeTypeResponse>) => {
      const newColorType = action.payload.data;
      const currentData = state.sizeTypes?.data ?? [];
      const currentTotal = state.sizeTypes?.total ?? query.total;
      const currentLimit = state.sizeTypes?.limit ?? query.limit;

      const updatedTotal = currentTotal + 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.sizeTypes = {
        ...state.sizeTypes,
        data: [newColorType, ...currentData].slice(0, currentLimit),
        total: updatedTotal,
        page: state.sizeTypes?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.status = 'idle';
    },

    updateSizeTypeSuccess: (state, action: PayloadAction<IUpdateSizeTypeResponse>) => {
      state.detail =
        state.detail?.id === action.payload.data.id ? action.payload.data : state.detail;
      state.sizeTypes = {
        ...state.sizeTypes,
        data: (state.sizeTypes?.data ?? []).map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        }),
        total: state.sizeTypes?.total ?? query.total,
        page: state.sizeTypes?.page ?? query.page,
        limit: state.sizeTypes?.limit ?? query.limit,
        totalPages: state.sizeTypes?.totalPages ?? query.totalPages,
      };
      state.status = 'idle';
    },

    deleteSizeTypeSuccess: (state, action: PayloadAction<IDeleteResponse>) => {
      const currentTotal = state.sizeTypes?.total ?? query.total;
      const currentLimit = state.sizeTypes?.limit ?? query.limit;

      const updatedTotal = currentTotal - 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.sizeTypes = {
        ...state.sizeTypes,
        data: (state.sizeTypes?.data ?? []).filter((item) => item.id !== action.payload.id),
        total: updatedTotal,
        page: state.sizeTypes?.page ?? query.page,
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
  getListSizeTypesSuccess,
  createSizeTypeSuccess,
  updateSizeTypeSuccess,
  deleteSizeTypeSuccess,
} = sizeTypeSlice.actions;

export const selectDetailSizeType = (state: RootState) => state.sizeType.detail;
export const selectStatus = (state: RootState) => state.sizeType.status;
export const selectSizeTypes = (state: RootState) => state.sizeType.sizeTypes;

export default sizeTypeSlice.reducer;
