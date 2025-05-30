/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  IApplyProductsFromCategoryReq,
  ICreateCategoryReq,
  IDeleteCategoryReq,
  IGetDetailCategoryReq,
  IGetListCategoriesReq,
  IRemoveProductsFromCategoryReq,
  IUpdateCategoryReq,
} from '@/types/common';
import { AppDispatch, RootState } from '../../store';
import {
  createCategorySuccess,
  getDetailCategorySuccess,
  getListCategoriesSuccess,
  setStatus,
} from './slice';
import {
  applyProductsToCategoryApi,
  createCategoryApi,
  deleteCategoryApi,
  getDetailCategoryApi,
  getListCategoriesApi,
  removeProductsFromCategoryApi,
  updateCategoryApi,
} from './api';
import { query } from '@/constant/common';

export const getListCategoriesAsync =
  (payload: { data: IGetListCategoriesReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await getListCategoriesApi({ data: data.value });
      if (response.status === 200) {
        dispatch(getListCategoriesSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const createCategoryAsync =
  (payload: { data: ICreateCategoryReq }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await createCategoryApi({ data: data.value });
      if (response.status === 200) {
        dispatch(createCategorySuccess(response));
        data.setToastSuccess(response.code);

        const state = getState();
        const detail = state.category.detail;

        if (detail?.id) {
          dispatch(
            getDetailCategoryAsync({
              data: {
                value: { categoryId: detail.id },
                setToastSuccess: () => {},
                setToastError: () => {},
              },
            })
          );
        }
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const updateCategoryAsync =
  (payload: { data: IUpdateCategoryReq; categoryId: string }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { data, categoryId } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await updateCategoryApi({ data: data.value, categoryId });
      if (response.status === 200) {
        dispatch(
          getListCategoriesAsync({
            data: {
              value: { page: query.page, limit: query.limit },
              setToastSuccess: () => {},
              setToastError: () => {},
            },
          })
        );
        data.setToastSuccess(response.code);

        const state = getState();
        const detail = state.category.detail;

        if (detail?.id) {
          dispatch(
            getDetailCategoryAsync({
              data: {
                value: { categoryId: detail.id },
                setToastSuccess: () => {},
                setToastError: () => {},
              },
            })
          );
        }
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const deleteCategoryAsync =
  (payload: { data: IDeleteCategoryReq }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await deleteCategoryApi({ categoryId: data.value.categoryId });
      if (response.status === 200) {
        dispatch(
          getListCategoriesAsync({
            data: {
              value: { page: query.page, limit: query.limit },
              setToastSuccess: () => {},
              setToastError: () => {},
            },
          })
        );
        data.setToastSuccess(response.code);

        const state = getState();
        const detail = state.category.detail;

        if (detail?.id) {
          dispatch(
            getDetailCategoryAsync({
              data: {
                value: { categoryId: detail.id },
                setToastSuccess: () => {},
                setToastError: () => {},
              },
            })
          );
        }
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const getDetailCategoryAsync =
  (payload: { data: IGetDetailCategoryReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;

    dispatch(setStatus('loading'));
    try {
      const response = await getDetailCategoryApi({ categoryId: data.value.categoryId });

      if (response && response.status === 200) {
        dispatch(getDetailCategorySuccess(response));

        if (data.setToastSuccess && response.code) {
          data.setToastSuccess(response.code);
        }
      } else {
        dispatch(setStatus('failed'));
        if (data.setToastError) {
          data.setToastError();
        }
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));

      if (error && data.setToastError) {
        const errorCode = error.response?.data?.code || error.status;
        data.setToastError(errorCode);
      }
    }
  };

export const removeProductsFromCategory =
  (payload: { data: IRemoveProductsFromCategoryReq }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await removeProductsFromCategoryApi({
        categoryId: data.value.categoryId,
        data: { productIds: data.value.productIds },
      });
      if (response.status === 200) {
        const state = getState();
        const detail = state.category.detail;

        if (detail?.id) {
          dispatch(
            getDetailCategoryAsync({
              data: {
                value: { categoryId: detail.id },
                setToastSuccess: () => {},
                setToastError: () => {},
              },
            })
          );
        }
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const applyProductsFromCategory =
  (payload: { data: IApplyProductsFromCategoryReq }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await applyProductsToCategoryApi({
        categoryId: data.value.categoryId,
        data: { productIds: data.value.productIds },
      });
      if (response.status === 200) {
        const state = getState();
        const detail = state.category.detail;

        if (detail?.id) {
          dispatch(
            getDetailCategoryAsync({
              data: {
                value: { categoryId: detail.id },
                setToastSuccess: () => {},
                setToastError: () => {},
              },
            })
          );
        }
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };
