export type SampleDetail = {
  id: string;
  productName: string;
  quantity: string;
  batchNumber: string;
  sku: string;
  specifics: string;
  selectedParameters: string[];
};

export type CartLine = {
  id: string;
  product: string;
  category: string;
  samples: SampleDetail[];
  basePrice: number;
  fixedPrice?: number;
  availableParameters?: any[];
  testObj?: any;
};

export type CollectionMethod = "" | "PICKUP" | "COURIER";

export type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  collectionMethod: CollectionMethod;
  pickupDate: string;
  pickupTime: string;
};
