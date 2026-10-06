import { apiClient } from './axios';
import type { ApiQueryParams, ApiRequestBody } from "./types";

export const packageApi = {
  getAllPackages: async (params?: ApiQueryParams) => {
    const response = await apiClient.get('/packages', { params });
    return response.data;
  },

  getPackages: async (params?: ApiQueryParams) => {
    const response = await apiClient.get('/packages', { params });
    return response.data;
  },

  getPackage: async (id: string) => {
    const response = await apiClient.get(`/packages/${id}`);
    return response.data;
  },

  getPackageById: async (id: string) => {
    const response = await apiClient.get(`/packages/${id}`);
    return response.data;
  },

  createPackage: async (data: ApiRequestBody) => {
    const response = await apiClient.post('/packages', data);
    return response.data;
  },

  updatePackage: async (id: string, data: ApiRequestBody) => {
    const response = await apiClient.put(`/packages/${id}`, data);
    return response.data;
  },

  deletePackage: async (id: string) => {
    const response = await apiClient.delete(`/packages/${id}`);
    return response.data;
  },
};
