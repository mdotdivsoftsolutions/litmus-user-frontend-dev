"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { testApi } from "@/lib/api/test";
import { packageApi } from "@/lib/api/package";
import { labApi } from "@/lib/api/lab";
import { bookingApi } from "@/lib/api/booking";
import { authApi } from "@/lib/api/auth";
import { CartLine, SampleDetail, BookingFormData } from "./booking-types";

export function useNewBookingState() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<CartLine[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [orderId, setOrderId] = useState(() => `#LTMS-${Math.floor(100000 + Math.random() * 900000)}`);

  const searchParams = useSearchParams();
  const testId = searchParams?.get("testId") || null;
  const testParams = searchParams?.get("params")?.split(",") || [];
  const packageId = searchParams?.get("packageId") || null;

  const { data: testResponse, isLoading: isTestLoading } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => testApi.getTestById(testId!),
    enabled: !!testId,
  });

  const { data: packageResponse, isLoading: isPackageLoading } = useQuery({
    queryKey: ["package", packageId],
    queryFn: () => packageApi.getPackage(packageId!),
    enabled: !!packageId,
  });

  const { data: cartResponse, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
    enabled: !testId && !packageId,
  });

  const { data: labsResponse, isLoading: isLabsLoading } = useQuery({
    queryKey: ["publicLabs"],
    queryFn: () => labApi.getLabsPublic(),
  });

  const eligibleLabs = useMemo(() => {
    if (!labsResponse?.data) return [];
    const requiredTestIds = items.map((item) => item.id);
    if (requiredTestIds.length === 0) return labsResponse.data;
    return labsResponse.data.filter((lab: any) => {
      const labTestIds = lab.tests?.map((t: any) => t._id || t) || [];
      return requiredTestIds.every((tId) => labTestIds.includes(tId));
    });
  }, [labsResponse?.data, items]);

  const getLabPrice = (lab: any) => {
    let labTotal = 0;
    items.forEach((item) => {
      const specificTestPricing = lab.pricing?.[item.id];
      item.samples.forEach((sample) => {
        let samplePrice = 0;
        sample.selectedParameters.forEach((paramName) => {
          const platformParam = item.availableParameters?.find((p) => p.name === paramName);
          const platformPrice = platformParam ? Number(platformParam.price) || 0 : 0;
          if (specificTestPricing && typeof specificTestPricing === "object" && specificTestPricing[paramName] !== undefined) {
            samplePrice += specificTestPricing[paramName];
          } else {
            samplePrice += platformPrice;
          }
        });
        if (samplePrice === 0) {
          samplePrice = typeof specificTestPricing === "number" ? specificTestPricing : item.testObj?.price || 0;
        }
        labTotal += samplePrice;
      });
    });
    return labTotal;
  };

  useEffect(() => {
    if (dataLoaded) return;
    if (testId && testResponse?.data) {
      const test = testResponse.data;
      setItems((prev) => {
        if (prev.length > 0 && prev[0].id === test._id) {
          const updated = [...prev];
          updated[0].testObj = test;
          updated[0].availableParameters = test.metadata?.parameters || [];
          return updated;
        }
        const testParamsMetadata = test.metadata?.parameters || [];
        const initialSample: SampleDetail = {
          id: Math.random().toString(36).substr(2, 9),
          productName: test.testName,
          quantity: "",
          batchNumber: "",
          sku: "",
          specifics: "",
          selectedParameters: testParams.length > 0 ? testParams : testParamsMetadata.map((p: any) => p.name),
        };
        return [{
          id: test._id,
          product: test.testName,
          category: "Test Panel",
          samples: [initialSample],
          basePrice: 500,
          fixedPrice: 0,
          availableParameters: testParamsMetadata,
          testObj: test,
        }];
      });
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
        id: Math.random().toString(36).substr(2, 9),
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

    if (!testId && !packageId && cartResponse?.data?.items && !isCartLoading) {
      const serverItems = cartResponse.data.items.map((cartItem: any) => {
        const isTest = cartItem.itemType === "TEST";
        const isPkg = cartItem.itemType === "PACKAGE";
        const name = isTest ? cartItem.testId?.testName : cartItem.packageId?.name;
        let testIds: string[] = [];
        let basePrice = cartItem.price;

        if (isTest && cartItem.parameters?.length) {
          testIds = cartItem.parameters;
          basePrice = Math.round(cartItem.price / (cartItem.parameters.length || 1));
        } else if (isPkg) {
          const pkgTests = cartItem.packageId?.tests?.map((t: any) => t.testName);
          const pkgFeats = cartItem.packageId?.features?.map((f: string) => f);
          testIds = (pkgTests?.length ? pkgTests : pkgFeats) || ["General Evaluation"];
          basePrice = Math.round(cartItem.price / (testIds.length || 1));
        } else {
          testIds = ["General"];
        }

        const availableParameters = isTest
          ? cartItem.testId?.metadata?.parameters || []
          : testIds.map((tid: string) => ({ name: tid, price: 0 }));

        const initialSample: SampleDetail = {
          id: Math.random().toString(36).substr(2, 9),
          productName: name || "",
          quantity: "",
          batchNumber: "",
          sku: "",
          specifics: "",
          selectedParameters: isTest && cartItem.parameters?.length ? cartItem.parameters : testIds,
        };

        return {
          id: cartItem._id,
          product: name || "Unknown Item",
          category: isTest ? "Test Panel" : "Package Panel",
          samples: [initialSample],
          basePrice: 500,
          fixedPrice: cartItem.price,
          availableParameters,
          testObj: isTest ? cartItem.testId : cartItem.packageId,
        };
      });
      setItems(serverItems);
      setDataLoaded(true);
    }
  }, [cartResponse, isCartLoading, dataLoaded, testId, packageId, testResponse, packageResponse]);

  const { data: userResponse } = useQuery({ queryKey: ["user"], queryFn: authApi.getMe });

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pickupDate: "",
    pickupTime: "",
  });

  useEffect(() => {
    if (userResponse?.data) {
      const u = userResponse.data;
      setFormData((prev) => ({
        ...prev,
        name: prev.name || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: prev.email || u.email || "",
        phone: prev.phone || u.phone || "",
        address: prev.address || (u.address?.street ? u.address.street : ""),
        city: prev.city || (u.address?.city ? u.address.city : ""),
        state: prev.state || (u.address?.state ? u.address.state : ""),
        pincode: prev.pincode || (u.address?.pincode ? u.address.pincode : ""),
      }));
    }
  }, [userResponse]);

  const minDateString = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const selectedLabProfile = useMemo(() => {
    if (selectedLab === "admin" || !selectedLab) return null;
    return eligibleLabs?.find((l: any) => l._id === selectedLab);
  }, [selectedLab, eligibleLabs]);

  const { data: availabilityResponse, isLoading: isAvailabilityLoading } = useQuery({
    queryKey: ["labAvailability", selectedLab, formData.pickupDate],
    queryFn: () => labApi.getLabAvailability(selectedLab!, formData.pickupDate),
    enabled: !!selectedLab && selectedLab !== "admin" && !!formData.pickupDate,
    retry: false,
  });

  const dateError = useMemo(() => {
    if (!formData.pickupDate || !selectedLabProfile) return null;
    const dateObj = new Date(formData.pickupDate);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const availability = selectedLabProfile.availability;
    if (availability) {
      if (availability.workingDays && !availability.workingDays.includes(dayName)) {
        return `This lab is closed on ${dayName}s. Please select another day.`;
      }
      if (availability.blockedDates?.find((b: any) => b.date === formData.pickupDate)) {
        return `This lab is closed on this date. Please select another date.`;
      }
    }
    if (availabilityResponse?.data && !availabilityResponse.data.isAvailable) {
      return `This lab is fully booked on this date. Please select another date.`;
    }
    return null;
  }, [formData.pickupDate, selectedLabProfile, availabilityResponse]);

  const timeError = useMemo(() => {
    if (!formData.pickupTime || !selectedLabProfile?.availability?.startTime || !selectedLabProfile?.availability?.endTime) return null;
    const [time, period] = formData.pickupTime.split(" ");
    const timeParts = time.split(":").map(Number);
    let hours = timeParts[0];
    const minutes = timeParts[1];
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const selectedTimeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    const startTime = selectedLabProfile.availability.startTime;
    const endTime = selectedLabProfile.availability.endTime;
    if (selectedTimeStr < startTime || selectedTimeStr > endTime) {
      return `Please select a time within the lab's working hours (${startTime} - ${endTime}).`;
    }
    return null;
  }, [formData.pickupTime, selectedLabProfile]);

  const isStep3Valid = !!(
    formData.name &&
    formData.phone &&
    formData.address &&
    formData.city &&
    formData.pincode &&
    formData.pickupDate &&
    formData.pickupTime &&
    !dateError &&
    !timeError &&
    !isAvailabilityLoading
  );

  const calculateItemPrice = (item: CartLine) => {
    if (item.testObj && item.availableParameters && item.availableParameters.length > 0 && item.category === "Test Panel") {
      let totalBase = 0;
      item.samples.forEach((sample) => {
        const samplePrice = item.availableParameters!.reduce(
          (sum: number, p: any) => (sample.selectedParameters.includes(p.name) ? sum + (Number(p.price) || 0) : sum),
          0
        );
        totalBase += samplePrice > 0 ? samplePrice : item.testObj.price || 0;
      });
      let discount = 0;
      if (item.testObj.discountType === "PERCENTAGE") {
        discount = totalBase * ((item.testObj.discountValue || 0) / 100);
      } else if (item.testObj.discountType === "FLAT") {
        discount = item.testObj.discountValue || 0;
      }
      return Math.max(0, totalBase - discount);
    }
    return (item.fixedPrice ?? 0) * item.samples.length;
  };

  const calculateItemMrp = (item: CartLine) => {
    if (item.testObj && item.availableParameters && item.availableParameters.length > 0 && item.category === "Test Panel") {
      let totalBase = 0;
      item.samples.forEach((sample) => {
        const samplePrice = item.availableParameters!.reduce(
          (sum: number, p: any) => (sample.selectedParameters.includes(p.name) ? sum + (Number(p.price) || 0) : sum),
          0
        );
        totalBase += samplePrice > 0 ? samplePrice : item.testObj.price || 0;
      });
      return totalBase;
    }
    if (item.testObj?.mrp) return item.testObj.mrp * item.samples.length;
    return (item.fixedPrice ?? 0) * 1.75 * item.samples.length;
  };

  const subtotal = items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
  const totalMrp = items.reduce((acc, item) => acc + calculateItemMrp(item), 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const canProceedSampleDetails =
    items.length > 0 &&
    items.some((item) => item.samples.some((s) => s.productName.trim().length > 0 && s.selectedParameters.length > 0));

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const addSample = (itemId: string) => {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const defaultParams = item.availableParameters?.map((p) => p.name) || [];
        const newSample: SampleDetail = {
          id: Math.random().toString(36).substr(2, 9),
          productName: "",
          quantity: "",
          batchNumber: "",
          sku: "",
          specifics: "",
          selectedParameters: defaultParams,
        };
        return { ...item, samples: [...item.samples, newSample] };
      })
    );
  };

  const removeSample = (itemId: string, sampleId: string) => {
    setItems(items.map((item) => (item.id !== itemId ? item : { ...item, samples: item.samples.filter((s) => s.id !== sampleId) })));
  };

  const toggleTestForSample = (itemId: string, sampleId: string, paramName: string) => {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const newSamples = item.samples.map((sample) => {
          if (sample.id !== sampleId) return sample;
          const isSelected = sample.selectedParameters.includes(paramName);
          const newParams = isSelected ? sample.selectedParameters.filter((p) => p !== paramName) : [...sample.selectedParameters, paramName];
          return { ...sample, selectedParameters: newParams };
        });
        return { ...item, samples: newSamples };
      })
    );
  };

  const updateSampleField = (itemId: string, sampleId: string, field: keyof SampleDetail, value: string) => {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const newSamples = item.samples.map((sample) => (sample.id !== sampleId ? sample : { ...sample, [field]: value }));
        return { ...item, samples: newSamples };
      })
    );
  };

  const { mutate: createBooking, isPending: isCreatingBooking } = useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: async (res) => {
      setOrderId(res.data._id || `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setStep(5);
      try {
        await cartApi.clearCart();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } catch (e) {
        console.error("Failed to clear cart:", e);
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to create booking. Please try again.");
    },
  });

  const handleNext = () => {
    if (step === 4) {
      const payload = {
        labId: selectedLab,
        items: items.map((item) => ({
          itemType: item.category === "Test Panel" ? "TEST" : "PACKAGE",
          testId: item.category === "Test Panel" ? item.testObj?._id || item.id : undefined,
          packageId: item.category !== "Test Panel" ? item.testObj?._id || item.id : undefined,
          price: calculateItemPrice(item),
          mrp: calculateItemMrp(item),
          samples: item.samples.map((s) => ({
            productName: s.productName,
            quantity: s.quantity,
            batchNumber: s.batchNumber,
            sku: s.sku,
            specifics: s.specifics,
            selectedParameters: item.category === "Test Panel" ? s.selectedParameters : undefined,
            selectedTests: item.category !== "Test Panel" ? s.selectedParameters : undefined,
          })),
        })),
        bookingDate: new Date(),
        totalAmount: total,
        metadata: {
          collectionDetails: formData,
          paymentMethod: "ONLINE_DIRECT",
        },
      };
      createBooking(payload as any);
    } else if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0 && step < 5) setStep(step - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return {
    step,
    setStep,
    items,
    dataLoaded,
    isCartLoading,
    isTestLoading,
    isPackageLoading,
    isLabsLoading,
    eligibleLabs,
    getLabPrice,
    selectedLab,
    setSelectedLab,
    orderId,
    formData,
    handleInputChange,
    minDateString,
    isAvailabilityLoading,
    dateError,
    timeError,
    isStep3Valid,
    calculateItemPrice,
    calculateItemMrp,
    subtotal,
    totalMrp,
    discount,
    gst,
    total,
    canProceedSampleDetails,
    removeItem,
    addSample,
    removeSample,
    toggleTestForSample,
    updateSampleField,
    isCreatingBooking,
    handleNext,
    handleBack,
  };
}
