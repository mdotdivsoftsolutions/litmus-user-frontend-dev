"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { testApi } from "@/lib/api/test";
import { packageApi } from "@/lib/api/package";
import { labApi } from "@/lib/api/lab";
import { bookingApi } from "@/lib/api/booking";
import { authApi } from "@/lib/api/auth";
import { cartApi } from "@/lib/api/cart";

export interface SampleDetail {
  id: string;
  productName: string;
  quantity: string;
  batchNumber: string;
  sku: string;
  specifics: string;
  selectedParameters: string[];
}

export interface CartLine {
  id: string;
  product: string;
  category?: string;
  samples: SampleDetail[];
  basePrice?: number;
  fixedPrice?: number;
  availableParameters?: any[];
  testObj?: any;
}

function mapCartItemsToLines(cartItems: any[]): CartLine[] {
  return (cartItems || []).map((cartItem: any) => {
    const isTest = cartItem.itemType === "TEST";
    const source = isTest ? cartItem.testId : cartItem.packageId;
    const name = isTest ? source?.testName : source?.name;

    let availableParameters: { name: string; price?: number }[] = [];
    let selectedParameters: string[] = [];

    if (isTest) {
      availableParameters = source?.metadata?.parameters || [];
      selectedParameters =
        cartItem.parameters?.length > 0
          ? cartItem.parameters
          : availableParameters.map((p) => p.name);
    } else {
      const pkgTests = source?.tests?.map((t: any) => t.testName).filter(Boolean);
      const pkgFeats = source?.features?.filter(Boolean);
      const names = (pkgTests?.length ? pkgTests : pkgFeats) || ["General Evaluation"];
      availableParameters = names.map((tid: string) => ({ name: tid, price: 0 }));
      selectedParameters = names;
    }

    const initialSample: SampleDetail = {
      id: Math.random().toString(36).substring(2, 9),
      productName: name || "",
      quantity: "",
      batchNumber: "",
      sku: "",
      specifics: "",
      selectedParameters,
    };

    return {
      id: cartItem._id,
      product: name || "Unknown Item",
      category: isTest ? "Test Panel" : "Package Panel",
      samples: [initialSample],
      basePrice: 500,
      fixedPrice: cartItem.price || source?.price || 0,
      availableParameters,
      testObj: source,
    };
  });
}

export function useBookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const testId = searchParams.get("testId");
  const packageId = searchParams.get("packageId");
  const testParams = searchParams.get("params")?.split(",") || [];

  const [step, setStep] = useState(0);
  const [items, setItems] = useState<CartLine[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedLab, setSelectedLab] = useState<string | null>("admin");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
  });

  const { data: userResponse } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: () => authApi.getMe(),
    retry: false,
  });

  const { data: testResponse } = useQuery({
    queryKey: ["testForBooking", testId],
    queryFn: () => testApi.getTestById(testId!),
    enabled: !!testId,
  });

  const { data: packageResponse } = useQuery({
    queryKey: ["packageForBooking", packageId],
    queryFn: () => packageApi.getPackage(packageId!),
    enabled: !!packageId,
  });

  const { data: cartResponse, isLoading: isCartLoading, isFetched: isCartFetched } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
    enabled: !testId && !packageId,
  });

  const { data: labsResponse } = useQuery({
    queryKey: ["eligibleLabs"],
    queryFn: () => labApi.getLabs({ limit: 50 }),
  });

  useEffect(() => {
    if (userResponse?.data?.user) {
      const u = userResponse.data.user;
      setFormData(prev => ({
        ...prev,
        name: prev.name || u.name || "",
        email: prev.email || u.email || "",
        phone: prev.phone || u.phone || "",
        address: prev.address || (u.address?.street ? u.address.street : ""),
        city: prev.city || (u.address?.city ? u.address.city : ""),
        state: prev.state || (u.address?.state ? u.address.state : ""),
        pincode: prev.pincode || (u.address?.pincode ? u.address.pincode : ""),
      }));
    }
  }, [userResponse]);

  useEffect(() => {
    if (dataLoaded) return;

    if (testId && testResponse?.data) {
      const test = testResponse.data;
      const testParamsMetadata = test.metadata?.parameters || [];
      const initialSample: SampleDetail = {
        id: Math.random().toString(36).substring(2, 9),
        productName: test.testName,
        quantity: "",
        batchNumber: "",
        sku: "",
        specifics: "",
        selectedParameters: testParams.length > 0 ? testParams : testParamsMetadata.map((p: any) => p.name),
      };

      setItems([{
        id: test._id,
        product: test.testName,
        category: 'Test Panel',
        samples: [initialSample],
        basePrice: 500,
        fixedPrice: 0,
        availableParameters: testParamsMetadata,
        testObj: test,
      }]);
      setDataLoaded(true);
      return;
    }

    if (packageId && packageResponse?.data) {
      const pkg = packageResponse.data;
      const pkgTests = pkg.tests?.map((t: any) => t.testName);
      const pkgFeats = pkg.features?.map((f: string) => f);
      const testIds = (pkgTests?.length ? pkgTests : pkgFeats) || ["General Evaluation"];
      const availableParameters = testIds.map((tid: string) => ({ name: tid, price: 0 }));

      const initialSample: SampleDetail = {
        id: Math.random().toString(36).substring(2, 9),
        productName: pkg.name,
        quantity: "",
        batchNumber: "",
        sku: "",
        specifics: "",
        selectedParameters: testIds,
      };

      setItems([{
        id: pkg._id,
        product: pkg.name,
        category: pkg.category,
        samples: [initialSample],
        basePrice: 500,
        fixedPrice: pkg.price || 0,
        availableParameters,
        testObj: pkg,
      }]);
      setDataLoaded(true);
      return;
    }

    if (!testId && !packageId && isCartFetched) {
      setItems(mapCartItemsToLines(cartResponse?.data?.items || []));
      setDataLoaded(true);
    }
  }, [testId, packageId, testResponse, packageResponse, cartResponse, isCartFetched, dataLoaded, testParams]);

  const calculateItemPrice = (item: CartLine) => {
    if (item.testObj && item.availableParameters && item.availableParameters.length > 0 && item.category === 'Test Panel') {
      let totalBase = 0;
      item.samples.forEach(sample => {
        const samplePrice = item.availableParameters!.reduce((sum: number, p: any) => 
          sample.selectedParameters.includes(p.name) ? sum + (Number(p.price) || 0) : sum, 0);
        totalBase += samplePrice > 0 ? samplePrice : (item.testObj.price || 0);
      });
      return totalBase;
    }
    return (item.fixedPrice || 0) * item.samples.length;
  };

  const calculateLabPricing = (lab: any) => {
    if (!lab || !lab.customPricing) return null;
    let labTotal = 0;
    items.forEach(item => {
      item.samples.forEach(sample => {
        let samplePrice = 0;
        sample.selectedParameters.forEach(paramName => {
          const paramObj = item.availableParameters?.find(p => p.name === paramName);
          const platformPrice = paramObj ? Number(paramObj.price) || 0 : 0;
          const specificTestPricing = lab.customPricing[item.id];
          if (specificTestPricing && typeof specificTestPricing === 'object' && specificTestPricing[paramName] !== undefined) {
            samplePrice += specificTestPricing[paramName];
          } else {
            samplePrice += platformPrice;
          }
        });
        if (samplePrice === 0) {
          samplePrice = item.testObj?.price || 0;
        }
        labTotal += samplePrice;
      });
    });
    return labTotal;
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
  }, [items]);

  const totalMrp = useMemo(() => {
    return items.reduce((acc, item) => {
      const itemMrp = item.testObj?.mrp || item.testObj?.originalPrice || item.fixedPrice || item.testObj?.price || 0;
      return acc + (itemMrp * item.samples.length);
    }, 0);
  }, [items]);

  const discount = Math.max(0, totalMrp - subtotal);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const canProceedSampleDetails = useMemo(() => {
    if (items.length === 0) return false;
    return items.every(item => item.samples.length > 0 && item.samples.every(s => s.productName.trim() !== ""));
  }, [items]);

  const selectedLabProfile = useMemo(() => {
    if (selectedLab === 'admin' || !selectedLab) return null;
    return labsResponse?.data?.find((l: any) => l._id === selectedLab);
  }, [selectedLab, labsResponse]);

  const isStep3Valid = !!(
    formData.name &&
    formData.phone &&
    formData.address &&
    formData.city &&
    formData.pincode &&
    formData.pickupDate &&
    formData.pickupTime
  );

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => bookingApi.createBooking(data),
    onSuccess: (res) => {
      setCreatedBooking(res.data);
      setStep(5);
      toast.success("Booking confirmed successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create booking. Please try again.");
    }
  });

  const handleNext = () => {
    if (step === 4) {
      createBookingMutation.mutate({
        items,
        selectedLab,
        customerDetails: formData,
        paymentMethod,
        totalAmount: total,
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  return {
    step,
    setStep,
    items,
    setItems,
    dataLoaded,
    isCartLoading,
    selectedLab,
    setSelectedLab,
    paymentMethod,
    setPaymentMethod,
    formData,
    setFormData,
    subtotal,
    totalMrp,
    discount,
    gst,
    total,
    calculateLabPricing,
    canProceedSampleDetails,
    isStep3Valid,
    selectedLabProfile,
    eligibleLabs: Array.isArray(labsResponse?.data) ? labsResponse.data : [],
    isCreatingBooking: createBookingMutation.isPending,
    createdBooking,
    handleNext,
    handleBack,
  };
}
