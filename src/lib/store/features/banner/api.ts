import apiReq from '@/lib/axios/api-req';
import { IGetListBannersParams, IUpdateBanner } from '@/types/common';

export const getListBannersApi = async (payload: { data: IGetListBannersParams }) => {
  const { data } = payload;
  const result = await apiReq.get(`/banners`, { params: data });
  return result.data;
};

export const createBannerApi = async (payload: { data: FormData }) => {
  const { data } = payload;
  const result = await apiReq.post(`/banners`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
};

export const updateBannerApi = async (payload: { bannerId: string; data: IUpdateBanner }) => {
  const { bannerId, data } = payload;
  const result = await apiReq.put(`/banners/${bannerId}`, data);
  return result.data;
};

export const deleteBannerApi = async (payload: { bannerId: string }) => {
  const { bannerId } = payload;
  const result = await apiReq.delete(`/banners/${bannerId}`);
  return result.data;
};

export const getDetailBannerApi = async (payload: { bannerId: string }) => {
  const { bannerId } = payload;
  const result = await apiReq.get(`/banners/${bannerId}`);
  return result.data;
};
