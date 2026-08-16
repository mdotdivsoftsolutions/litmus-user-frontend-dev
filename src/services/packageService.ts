import { packageApi } from "@/lib/api/package";

export const packageService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) => 
    packageApi.getAllPackages(params),
  
  getById: (id: string) => 
    packageApi.getPackageById(id),
};
