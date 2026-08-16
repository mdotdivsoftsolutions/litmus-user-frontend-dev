import type { TestItem } from "./test.types";

export interface PackageItem {
  _id: string;
  id?: string;
  name: string;
  packageName?: string;
  price: number;
  mrp: number;
  tat: string;
  turnAroundTime?: string;
  category?: string;
  description?: string;
  testsCount?: number;
  tests?: TestItem[];
  features?: string[];
  iconUrl?: string;
  isPopular?: boolean;
}
