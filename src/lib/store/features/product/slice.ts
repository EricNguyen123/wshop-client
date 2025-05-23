/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TStatusSlice } from '@/types';
import { RootState } from '@/lib/store/store';
import {
  ICreateProductResponse,
  IDeleteResponse,
  IGetDetailProductResponse,
  IGetListProductsResponse,
  IProductState,
  IUpdateProductResponse,
} from '@/types/common';
import { query } from '@/constant/common';

const initialState: IProductState = {
  detail: undefined,
  products: undefined,
  status: 'idle',
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    getListProductsSuccess: (state, action: PayloadAction<IGetListProductsResponse>) => {
      state.products = action.payload.data;
      state.status = 'idle';
    },

    createProductSuccess: (state, action: PayloadAction<ICreateProductResponse>) => {
      const newBanner = {
        ...action.payload.data.product,
        medias: action.payload.data.medias,
      };
      const currentData = state.products?.data ?? [];
      const currentTotal = state.products?.total ?? query.total;
      const currentLimit = state.products?.limit ?? query.limit;

      const updatedTotal = currentTotal + 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.products = {
        ...state.products,
        data: [newBanner, ...currentData],
        total: updatedTotal,
        page: state.products?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.status = 'idle';
    },

    updateProductSuccess: (state, action: PayloadAction<IUpdateProductResponse>) => {
      state.detail =
        state.detail?.id === action.payload.data.id ? action.payload.data : state.detail;
      state.products = {
        ...state.products,
        data: (state.products?.data ?? []).map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        }),
        total: state.products?.total ?? query.total,
        page: state.products?.page ?? query.page,
        limit: state.products?.limit ?? query.limit,
        totalPages: state.products?.totalPages ?? query.totalPages,
      };
      state.status = 'idle';
    },

    deleteProductSuccess: (state, action: PayloadAction<IDeleteResponse>) => {
      const currentTotal = state.products?.total ?? query.total;
      const currentLimit = state.products?.limit ?? query.limit;

      const updatedTotal = currentTotal - 1;
      const updatedTotalPages = Math.ceil(updatedTotal / currentLimit);

      state.products = {
        ...state.products,
        data: (state.products?.data ?? []).filter((item) => item.id !== action.payload.id),
        total: updatedTotal,
        page: state.products?.page ?? query.page,
        limit: currentLimit,
        totalPages: updatedTotalPages,
      };
      state.detail = undefined;
      state.status = 'idle';
    },

    getDetailProductSuccess: (state, action: PayloadAction<IGetDetailProductResponse>) => {
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
  getListProductsSuccess,
  createProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
  getDetailProductSuccess,
} = productSlice.actions;

export const selectDetailProduct = (state: RootState) => state.product.detail;
export const selectStatus = (state: RootState) => state.product.status;
export const selectProducts = (state: RootState) => state.product.products;

export default productSlice.reducer;
