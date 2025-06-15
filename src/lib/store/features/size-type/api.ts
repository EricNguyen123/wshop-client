import apiReq from '@/lib/axios/api-req';
import { ICreateSizeType, IGetListReq, IUpdateSizeType } from '@/types/common';

export const getListSizeTypesApi = async (payload: { data: IGetListReq }) => {
  const { data } = payload;
  const result = await apiReq.get(`/size-types`, { params: data });
  return result.data;
};

export const createSizeTypeApi = async (payload: { data: ICreateSizeType }) => {
  const { data } = payload;
  const result = await apiReq.post(`/size-types`, data);
  return result.data;
};

export const updateSizeTypeApi = async (payload: { sizeTypeId: string; data: IUpdateSizeType }) => {
  const { sizeTypeId, data } = payload;
  const result = await apiReq.put(`/size-types/${sizeTypeId}`, data);
  return result.data;
};

export const deleteSizeTypeApi = async (payload: { sizeTypeId: string }) => {
  const { sizeTypeId } = payload;
  const result = await apiReq.delete(`/size-types/${sizeTypeId}`);
  return result.data;
};
