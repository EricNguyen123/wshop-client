/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';
import {
  IBannerState,
  ICreateBannerResponse,
  IDeleteResponse,
  IGetDetailBannerResponse,
  IGetListBannersResponse,
  IUpdateBannerResponse,
} from '@/types/common';
import { query } from '@/constant/common';

const initialState: IBannerState = {
  detail: undefined,
  banners: undefined,
  status: 'idle',
};

export const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    getListBannersSuccess: (state, action: PayloadAction<IGetListBannersResponse>) => {
      state.banners = action.payload.data;
      state.status = 'idle';
    },

    createBannerSuccess: (state, action: PayloadAction<ICreateBannerResponse>) => {
      const newBanner = action.payload.data;
      const currentData = state.banners?.data ?? [];
      const currentTotal = state.banners?.total ?? query.total;
      const currentLimit = state.banners?.limit ?? query.limit;

      const updatedTotal = currentTotal + 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.banners = {
        ...state.banners,
        data: [newBanner, ...currentData],
        total: updatedTotal,
        page: state.banners?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.status = 'idle';
    },

    updateBannerSuccess: (state, action: PayloadAction<IUpdateBannerResponse>) => {
      state.detail =
        state.detail?.id === action.payload.data.id ? action.payload.data : state.detail;
      state.banners = {
        ...state.banners,
        data: (state.banners?.data ?? []).map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        }),
        total: state.banners?.total ?? query.total,
        page: state.banners?.page ?? query.page,
        limit: state.banners?.limit ?? query.limit,
        totalPages: state.banners?.totalPages ?? query.totalPages,
      };
      state.status = 'idle';
    },

    deleteBannerSuccess: (state, action: PayloadAction<IDeleteResponse>) => {
      const currentTotal = state.banners?.total ?? query.total;
      const currentLimit = state.banners?.limit ?? query.limit;

      const updatedTotal = currentTotal - 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.banners = {
        ...state.banners,
        data: (state.banners?.data ?? []).filter((item) => item.id !== action.payload.id),
        total: updatedTotal,
        page: state.banners?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.detail = undefined;
      state.status = 'idle';
    },

    getDetailBannerSuccess: (state, action: PayloadAction<IGetDetailBannerResponse>) => {
      state.detail = action.payload.data;
      state.status = 'idle';
    },

    setStatus: (state, action: PayloadAction<TStatusSlice>) => {
      state.status = action.payload;
    },
  },
});

export const {
  setStatus,
  getListBannersSuccess,
  createBannerSuccess,
  updateBannerSuccess,
  deleteBannerSuccess,
  getDetailBannerSuccess,
} = bannerSlice.actions;

export const selectDetailBanner = (state: RootState) => state.banner.detail;
export const selectStatus = (state: RootState) => state.banner.status;
export const selectBanners = (state: RootState) => state.banner.banners;

export default bannerSlice.reducer;
