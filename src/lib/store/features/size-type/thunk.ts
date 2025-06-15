/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICreateSizeTypeReq,
  IDeleteSizeTypeReq,
  IGetListReq,
  IGetListSizeTypesReq,
  IUpdateSizeTypeReq,
} from '@/types/common';
import { AppDispatch } from '../../store';
import {
  createSizeTypeSuccess,
  deleteSizeTypeSuccess,
  getListSizeTypesSuccess,
  setStatus,
  updateSizeTypeSuccess,
} from './slice';
import {
  createSizeTypeApi,
  deleteSizeTypeApi,
  getListSizeTypesApi,
  updateSizeTypeApi,
} from './api';
import { query } from '@/constant/common';

export const getListSizeTypesAsync =
  (payload: { data: IGetListSizeTypesReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await getListSizeTypesApi({ data: data.value });
      if (response.status === 200) {
        dispatch(getListSizeTypesSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const createSizeTypeAsync =
  (payload: { data: ICreateSizeTypeReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await createSizeTypeApi({ data: data.value });
      if (response.status === 200) {
        dispatch(createSizeTypeSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const updateSizeTypeAsync =
  (payload: { data: IUpdateSizeTypeReq; sizeTypeId: string }) => async (dispatch: AppDispatch) => {
    const { data, sizeTypeId } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await updateSizeTypeApi({ data: data.value, sizeTypeId });
      if (response.status === 200) {
        dispatch(updateSizeTypeSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const deleteSizeTypeAsync =
  (payload: { data: IDeleteSizeTypeReq; getData?: IGetListReq }) =>
  async (dispatch: AppDispatch) => {
    const { data, getData } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await deleteSizeTypeApi({ sizeTypeId: data.value.sizeTypeId });
      if (response.status === 200) {
        dispatch(deleteSizeTypeSuccess({ id: data.value.sizeTypeId }));
        data.setToastSuccess(response.code);

        if (getData) {
          dispatch(
            getListSizeTypesAsync({
              data: {
                value: {
                  page: getData.page || query.page,
                  limit: getData.limit || query.limit,
                  textSearch: getData.textSearch,
                },
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
