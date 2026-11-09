export type SampleDetail = {
  id: string;
  productName: string;
  quantity: string;
  batchNumber: string;
  sku: string;
  specifics: string;
  selectedParameters: string[];
  /** Comma-separated purposes picked on the sample card (e.g. "Label, Export Requirement"). */
  testingPurpose?: string;
};

export const TESTING_PURPOSES = [
  "Label",
  "FSSAI Licensing",
  "Regulatory Quality Check",
  "Batch Check",
  "Export Requirement",
] as const;

/** Text sent to the lab: the chosen purposes followed by the customer's own notes. */
export function composeSampleSpecifics(sample: Pick<SampleDetail, "specifics" | "testingPurpose">): string {
  const purpose = (sample.testingPurpose || "").trim();
  const notes = (sample.specifics || "").trim();
  return [purpose && `Purpose of testing: ${purpose}`, notes].filter(Boolean).join("\n");
}

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
  gstNumber?: string;
  collectionMethod: CollectionMethod;
  pickupDate: string;
  pickupTime: string;
};

