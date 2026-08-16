import { testApi } from "@/lib/api/test";

export const testService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) => 
    testApi.getTests(params),
  
  getById: (id: string) => 
    testApi.getTestById(id),
  
  getPopular: (limit?: number) => 
    testApi.getPopularTests(limit),
};
