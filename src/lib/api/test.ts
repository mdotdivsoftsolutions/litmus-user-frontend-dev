import { apiClient } from './axios';
import type { ApiQueryParams, ApiRequestBody } from "./types";

export const testApi = {
  getTests: async (params?: ApiQueryParams) => {
    const response = await apiClient.get('/tests', { params });
    return response.data;
  },
  
  getPopularTests: async (limit?: number) => {
    const response = await apiClient.get('/tests', { params: { isPopular: true, ...(limit ? { limit } : {}) } });
    return response.data;
  },

  getTestById: async (id: string) => {
    const response = await apiClient.get(`/tests/${id}`);
    return response.data;
  },

  createTest: async (data: ApiRequestBody) => {
    const response = await apiClient.post('/tests', data);
    return response.data;
  },

  updateTest: async (id: string, data: ApiRequestBody) => {
    const response = await apiClient.patch(`/tests/${id}`, data);
    return response.data;
  },

  deleteTest: async (id: string) => {
    const response = await apiClient.delete(`/tests/${id}`);
    return response.data;
  }
};
