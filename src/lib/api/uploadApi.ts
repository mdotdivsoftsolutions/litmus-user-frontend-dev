import { apiClient } from './axios';

export const uploadApi = {
  uploadFile: async (file: File, onProgress?: (progressEvent: any) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    return response.data;
  },

  downloadFile: async (url: string, name: string) => {
    const response = await apiClient.get('/upload/download', {
      params: { url, name },
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
