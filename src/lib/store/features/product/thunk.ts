/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICreateProductReq,
  IDeleteProductReq,
  IGetDetailProductReq,
  IGetListProductsReq,
  IUpdateProductReq,
} from '@/types/common';
import { AppDispatch } from '../../store';
import {
  createProductSuccess,
  deleteProductSuccess,
  getDetailProductSuccess,
  getListProductsSuccess,
  setStatus,
  updateProductSuccess,
} from './slice';
import {
  createProductApi,
  deleteProductApi,
  getDetailProductApi,
  getListProductsApi,
  updateProductApi,
} from './api';

export const getListProductsAsync =
  (payload: { data: IGetListProductsReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await getListProductsApi({ data: data.value });
      if (response.status === 200) {
        dispatch(getListProductsSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const createProductAsync =
  (payload: { data: ICreateProductReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const formData = new FormData();
      if (Array.isArray(data.value.files)) {
        data.value.files.forEach((file: File) => {
          formData.append('files', file);
        });
      }
      formData.append('name', data.value.name ?? '');
      formData.append('description', data.value.description ?? '');
      formData.append('price', data.value.price?.toString() ?? '');
      formData.append('quantity', data.value.quantity?.toString() ?? '');
      formData.append('quantityAlert', data.value.quantityAlert?.toString() ?? '');
      formData.append('orderUnit', data.value.orderUnit?.toString() ?? '');
      formData.append('code', data.value.code ?? '');
      formData.append('status', data.value.status?.toString() ?? '');
      formData.append('multiplicationRate', data.value.multiplicationRate?.toString() ?? '');
      formData.append('discount', data.value.discount?.toString() ?? '');

      const response = await createProductApi({ data: formData });
      if (response.status === 200) {
        dispatch(createProductSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const updateProductAsync =
  (payload: { data: IUpdateProductReq; productId: string }) => async (dispatch: AppDispatch) => {
    const { data, productId } = payload;
    dispatch(setStatus('loading'));
    try {
      const formData = new FormData();
      if (Array.isArray(data.value.files)) {
        data.value.files.forEach((file: File) => {
          formData.append('files', file);
        });
      }
      formData.append('name', data.value.name ?? '');
      formData.append('description', data.value.description ?? '');
      formData.append('price', data.value.price?.toString() ?? '');
      formData.append('quantity', data.value.quantity?.toString() ?? '');
      formData.append('quantityAlert', data.value.quantityAlert?.toString() ?? '');
      formData.append('orderUnit', data.value.orderUnit?.toString() ?? '');
      formData.append('code', data.value.code ?? '');
      formData.append('status', data.value.status?.toString() ?? '');
      formData.append('multiplicationRate', data.value.multiplicationRate?.toString() ?? '');
      formData.append('discount', data.value.discount?.toString() ?? '');
      if (Array.isArray(data.value.mediaIds)) {
        data.value.mediaIds.forEach((id: string) => {
          formData.append('mediaIds', id);
        });
      }

      const response = await updateProductApi({ data: formData, productId });
      if (response.status === 200) {
        dispatch(updateProductSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const deleteProductAsync =
  (payload: { data: IDeleteProductReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await deleteProductApi({ productId: data.value.productId });
      if (response.status === 200) {
        dispatch(deleteProductSuccess({ id: data.value.productId }));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const getDetailProductAsync =
  (payload: { data: IGetDetailProductReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;

    dispatch(setStatus('loading'));
    try {
      const response = await getDetailProductApi({ productId: data.value.productId });

      if (response && response.status === 200) {
        dispatch(getDetailProductSuccess(response));

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
