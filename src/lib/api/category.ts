import { apiClient } from './axios';

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  getCategoriesPublic: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  getCategory: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
  createCategory: (data: Record<string, unknown>) => apiClient.post('/categories', data),
  updateCategory: (id: string, data: Record<string, unknown>) => apiClient.patch(`/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/categories/${id}`),
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
