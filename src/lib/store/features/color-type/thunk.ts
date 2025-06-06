/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICreateColorTypeReq,
  IDeleteColorTypeReq,
  IGetListColorTypesReq,
  IUpdateColorTypeReq,
} from '@/types/common';
import { AppDispatch } from '../../store';
import {
  createColorTypeApi,
  deleteColorTypeApi,
  getListColorTypesApi,
  updateColorTypeApi,
} from './api';
import {
  createColorTypeSuccess,
  deleteColorTypeSuccess,
  getListColorTypesSuccess,
  setStatus,
  updateColorTypeSuccess,
} from './slice';

export const getListColorTypesAsync =
  (payload: { data: IGetListColorTypesReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await getListColorTypesApi({ data: data.value });
      if (response.status === 200) {
        dispatch(getListColorTypesSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const createColorTypeAsync =
  (payload: { data: ICreateColorTypeReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await createColorTypeApi({ data: data.value });
      if (response.status === 200) {
        dispatch(createColorTypeSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const updateColorTypeAsync =
  (payload: { data: IUpdateColorTypeReq; colorTypeId: string }) =>
  async (dispatch: AppDispatch) => {
    const { data, colorTypeId } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await updateColorTypeApi({ data: data.value, colorTypeId });
      if (response.status === 200) {
        dispatch(updateColorTypeSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const deleteColorTypeAsync =
  (payload: { data: IDeleteColorTypeReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await deleteColorTypeApi({ colorTypeId: data.value.colorTypeId });
      if (response.status === 200) {
        dispatch(deleteColorTypeSuccess({ id: data.value.colorTypeId }));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };
