/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';
import {
  ICategoryRes,
  ICategoryState,
  ICreateCategoryResponse,
  IGetDetailCategoryResponse,
  IGetListCategoriesResponse,
} from '@/types/common';
import { query } from '@/constant/common';

const initialState: ICategoryState = {
  detail: undefined,
  categories: undefined,
  status: 'idle',
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    getListCategoriesSuccess: (state, action: PayloadAction<IGetListCategoriesResponse>) => {
      state.categories = action.payload.data;
      state.status = 'idle';
    },

    createCategorySuccess: (state, action: PayloadAction<ICreateCategoryResponse>) => {
      const newTreeRoot = action.payload.data;
      let currentData = state.categories?.data ?? [];

      const categoryIdsToRemove = collectAllCategoryIds(newTreeRoot);

      currentData = currentData.filter(
        (item) => typeof item.id === 'string' && !categoryIdsToRemove.includes(item.id)
      );

      const existedBefore = currentData.some((item) => item.id === newTreeRoot.id);
      const finalData = existedBefore
        ? currentData.map((item) => (item.id === newTreeRoot.id ? newTreeRoot : item))
        : [newTreeRoot, ...currentData];

      const currentLimit = state.categories?.limit ?? query.limit;
      const updatedTotal = finalData.length;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.categories = {
        ...state.categories,
        data: finalData.slice(0, currentLimit),
        total: updatedTotal,
        page:
          updatedTotalPages < (state.categories?.page ?? query.page)
            ? updatedTotalPages
            : state.categories?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.status = 'idle';
    },

    getDetailCategorySuccess: (state, action: PayloadAction<IGetDetailCategoryResponse>) => {
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
  getListCategoriesSuccess,
  createCategorySuccess,
  getDetailCategorySuccess,
} = categorySlice.actions;

export const selectDetailCategory = (state: RootState) => state.category.detail;
export const selectStatus = (state: RootState) => state.category.status;
export const selectCategories = (state: RootState) => state.category.categories;

export default categorySlice.reducer;

const collectAllCategoryIds = (category: ICategoryRes): string[] => {
  const childIds = category.subCategories?.flatMap(collectAllCategoryIds) ?? [];
  return [category.id, ...childIds].filter((id): id is string => typeof id === 'string');
};
