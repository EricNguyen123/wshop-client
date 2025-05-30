import apiReq from '@/lib/axios/api-req';
import { ICreateCategory, IGetListReq } from '@/types/common';

export const getListCategoriesApi = async (payload: { data: IGetListReq }) => {
  const { data } = payload;
  const result = await apiReq.get(`/categories`, { params: data });
  return result.data;
};

export const createCategoryApi = async (payload: { data: ICreateCategory }) => {
  const { data } = payload;
  const result = await apiReq.post(`/categories`, data);
  return result.data;
};

export const updateCategoryApi = async (payload: { categoryId: string; data: ICreateCategory }) => {
  const { categoryId, data } = payload;
  const result = await apiReq.put(`/categories/${categoryId}`, data);
  return result.data;
};

export const deleteCategoryApi = async (payload: { categoryId: string }) => {
  const { categoryId } = payload;
  const result = await apiReq.delete(`/categories/${categoryId}`);
  return result.data;
};

export const getDetailCategoryApi = async (payload: { categoryId: string }) => {
  const { categoryId } = payload;
  const result = await apiReq.get(`/categories/${categoryId}`);
  return result.data;
};

export const removeProductsFromCategoryApi = async (payload: {
  categoryId: string;
  data: {
    productIds: string[];
  };
}) => {
  const { categoryId, data } = payload;
  const result = await apiReq.delete(`/categories/${categoryId}/remove-products`, { data });
  return result.data;
};

export const applyProductsToCategoryApi = async (payload: {
  categoryId: string;
  data: {
    productIds: string[];
  };
}) => {
  const { categoryId, data } = payload;
  const result = await apiReq.post(`/categories/${categoryId}/apply-products`, data);
  return result.data;
};
