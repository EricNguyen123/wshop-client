import apiReq from '@/lib/axios/api-req';
import { IGetListReq } from '@/types/common';

export const getListProductsApi = async (payload: { data: IGetListReq }) => {
  const { data } = payload;
  const result = await apiReq.get(`/products`, { params: data });
  return result.data;
};

export const createProductApi = async (payload: { data: FormData }) => {
  const { data } = payload;
  const result = await apiReq.post(`/products`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
};

export const updateProductApi = async (payload: { productId: string; data: FormData }) => {
  const { productId, data } = payload;
  const result = await apiReq.put(`/products/${productId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
};

export const deleteProductApi = async (payload: { productId: string }) => {
  const { productId } = payload;
  const result = await apiReq.delete(`/products/${productId}`);
  return result.data;
};

export const getDetailProductApi = async (payload: { productId: string }) => {
  const { productId } = payload;
  const result = await apiReq.get(`/products/${productId}`);
  return result.data;
};
