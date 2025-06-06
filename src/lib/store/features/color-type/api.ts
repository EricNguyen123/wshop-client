import apiReq from '@/lib/axios/api-req';
import { ICreateColorType, IGetListReq, IUpdateColorType } from '@/types/common';

export const getListColorTypesApi = async (payload: { data: IGetListReq }) => {
  const { data } = payload;
  const result = await apiReq.get(`/color-types`, { params: data });
  return result.data;
};

export const createColorTypeApi = async (payload: { data: ICreateColorType }) => {
  const { data } = payload;
  const result = await apiReq.post(`/color-types`, data);
  return result.data;
};

export const updateColorTypeApi = async (payload: {
  colorTypeId: string;
  data: IUpdateColorType;
}) => {
  const { colorTypeId, data } = payload;
  const result = await apiReq.put(`/color-types/${colorTypeId}`, data);
  return result.data;
};

export const deleteColorTypeApi = async (payload: { colorTypeId: string }) => {
  const { colorTypeId } = payload;
  const result = await apiReq.delete(`/color-types/${colorTypeId}`);
  return result.data;
};
