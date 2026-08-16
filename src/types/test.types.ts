export interface TestParameter {
  name: string;
  price?: number;
  unit?: string;
  minLimit?: string;
  maxLimit?: string;
  method?: string;
}

export interface TestMetadata {
  method?: string;
  type?: string;
  sampleType?: string;
  sampleQuantity?: string;
  temperatureRequirement?: string;
  tatHours?: number;
}

export interface TestItem {
  _id: string;
  id?: string;
  testName: string;
  name?: string;
  price: number;
  mrp?: number;
  originalPrice?: number;
  discountType?: 'PERCENTAGE' | 'FLAT';
  discountValue?: number;
  turnAroundTime?: string;
  tat?: string;
  parametersCount?: number;
  parameters?: TestParameter[];
  applicableCategories?: { _id: string; name: string }[];
  isApplicableToAll?: boolean;
  description?: string;
  iconUrl?: string;
  itemType?: 'TEST' | 'PACKAGE';
  metadata?: TestMetadata;
}
