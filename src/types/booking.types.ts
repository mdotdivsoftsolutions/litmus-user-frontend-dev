import type { TestItem, TestParameter } from "./test.types";
import type { PackageItem } from "./package.types";

export interface SampleDetail {
  sampleName: string;
  category?: string;
  notes?: string;
  selectedParameters?: string[];
}

export interface CartLineItem {
  id: string;
  type: 'TEST' | 'PACKAGE';
  itemId: string;
  name: string;
  price: number;
  mrp: number;
  count: number;
  testObj?: TestItem;
  packageObj?: PackageItem;
  availableParameters?: TestParameter[];
  category?: string;
  samples: SampleDetail[];
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions?: string;
}
