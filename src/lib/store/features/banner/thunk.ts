/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IDeleteBannerReq,
  IGetDetailBannerReq,
  IGetListBannersReq,
  IUpdateBannerReq,
  IUploadBannerReq,
} from '@/types/common';
import { AppDispatch } from '../../store';
import {
  createBannerSuccess,
  deleteBannerSuccess,
  getDetailBannerSuccess,
  getListBannersSuccess,
  setStatus,
  updateBannerSuccess,
} from './slice';
import {
  createBannerApi,
  deleteBannerApi,
  getDetailBannerApi,
  getListBannersApi,
  updateBannerApi,
} from './api';

export const getListBannersAsync =
  (payload: { data: IGetListBannersReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await getListBannersApi({ data: data.value });
      if (response.status === 200) {
        dispatch(getListBannersSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const createBannerAsync =
  (payload: { data: IUploadBannerReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const formData = new FormData();
      formData.append('file', data.value.file);
      formData.append('descriptions', data.value.descriptions);
      formData.append('startDate', data.value.startDate.toString());
      formData.append('endDate', data.value.endDate.toString());
      formData.append('numberOrder', data.value.numberOrder.toString());

      const response = await createBannerApi({ data: formData });
      if (response.status === 200) {
        dispatch(createBannerSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const updateBannerAsync =
  (payload: { data: IUpdateBannerReq; bannerId: string }) => async (dispatch: AppDispatch) => {
    const { data, bannerId } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await updateBannerApi({ data: data.value, bannerId });
      if (response.status === 200) {
        dispatch(updateBannerSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const deleteBannerAsync =
  (payload: { data: IDeleteBannerReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await deleteBannerApi({ bannerId: data.value.bannerId });
      if (response.status === 200) {
        dispatch(deleteBannerSuccess({ id: data.value.bannerId }));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const getDetailBannerAsync =
  (payload: { data: IGetDetailBannerReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;

    dispatch(setStatus('loading'));
    try {
      const response = await getDetailBannerApi({ bannerId: data.value.bannerId });

      if (response && response.status === 200) {
        dispatch(getDetailBannerSuccess(response));

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
