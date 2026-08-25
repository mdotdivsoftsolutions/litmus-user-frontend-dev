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
import { paymentApi } from "@/lib/api/payment";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { CartLine, SampleDetail, BookingFormData, CollectionMethod } from "./booking-types";
import { settingsApi } from "@/lib/api/settings";
import { isCityCovered } from "@/lib/pickup-coverage";
import { useUserLocation } from "@/components/location/LocationContext";
import { toast } from "sonner";

export function useNewBookingState() {
  const queryClient = useQueryClient();
  const { city: detectedCity } = useUserLocation();
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<CartLine[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");
  // Payment-specific state
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  // Store the booking ID created at step 4 so retries reuse the same booking
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

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

  const { data: settingsResponse } = useQuery({
    queryKey: ["publicPlatformSettings"],
    queryFn: settingsApi.getPublicSettings,
  });
  const pickupCities: string[] = settingsResponse?.data?.pickupCities || ["Chennai"];
  const enablePickupSlotSelection: boolean = settingsResponse?.data?.enablePickupSlotSelection ?? false;

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
      const availableParameters = testIds.map((tid: string) => ({ name: tid, price: 0, isBasePackageTest: true }));
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
          : testIds.map((tid: string) => ({ name: tid, price: 0, isBasePackageTest: true }));

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

  const savedProfileAddress = useMemo(() => {
    const u = userResponse?.data;
    if (!u) return null;
    const street = u.shippingAddress?.street || u.address?.street || u.billingAddress?.street || "";
    const city = u.shippingAddress?.city || u.address?.city || u.billingAddress?.city || "";
    const state = u.shippingAddress?.state || u.address?.state || u.billingAddress?.state || "";
    const pincode =
      u.shippingAddress?.pincode ||
      u.address?.pincode ||
      u.address?.pinCode ||
      u.billingAddress?.pincode ||
      "";
    if (!street && !city && !pincode) return null;
    return { street, city, state, pincode };
  }, [userResponse?.data]);

  const hasSavedAddress = !!savedProfileAddress;
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);
  const [isAddressInitialized, setIsAddressInitialized] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    collectionMethod: "",
    pickupDate: "",
    pickupTime: "",
  });

  useEffect(() => {
    if (userResponse?.data && !isAddressInitialized) {
      const u = userResponse.data;
      const street = u.shippingAddress?.street || u.address?.street || u.billingAddress?.street || "";
      const city = u.shippingAddress?.city || u.address?.city || u.billingAddress?.city || detectedCity || "";
      const state = u.shippingAddress?.state || u.address?.state || u.billingAddress?.state || "";
      const pincode =
        u.shippingAddress?.pincode ||
        u.address?.pincode ||
        u.address?.pinCode ||
        u.billingAddress?.pincode ||
        "";

      setFormData((prev) => ({
        ...prev,
        name: prev.name || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: prev.email || u.email || "",
        phone: prev.phone || u.phone || "",
        address: prev.address || street,
        city: prev.city || city,
        state: prev.state || state,
        pincode: prev.pincode || pincode,
      }));

      // If user did not have a saved address in profile, check save to profile by default
      if (!street && !city && !pincode) {
        setSaveAddressToProfile(true);
      }
      setIsAddressInitialized(true);
    } else if (detectedCity && !isAddressInitialized) {
      setFormData((prev) => ({
        ...prev,
        city: prev.city || detectedCity,
      }));
    }
  }, [userResponse, detectedCity, isAddressInitialized]);

  const isUsingSavedAddress = useMemo(() => {
    if (!savedProfileAddress) return false;
    return (
      (formData.address || "").trim().toLowerCase() === (savedProfileAddress.street || "").trim().toLowerCase() &&
      (formData.city || "").trim().toLowerCase() === (savedProfileAddress.city || "").trim().toLowerCase() &&
      (formData.pincode || "").trim().toLowerCase() === (savedProfileAddress.pincode || "").trim().toLowerCase()
    );
  }, [formData.address, formData.city, formData.pincode, savedProfileAddress]);

  const handleToggleUseSavedAddress = () => {
    if (!savedProfileAddress) return;
    if (isUsingSavedAddress) {
      // Clear fields to allow entering a different address
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: detectedCity || "",
        state: "",
        pincode: "",
      }));
      setSaveAddressToProfile(true);
    } else {
      // Restore saved profile address
      setFormData((prev) => ({
        ...prev,
        address: savedProfileAddress.street,
        city: savedProfileAddress.city,
        state: savedProfileAddress.state,
        pincode: savedProfileAddress.pincode,
      }));
      setSaveAddressToProfile(false);
    }
  };

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

  const isPickupCovered = isCityCovered(formData.city, pickupCities);

  const isStep3Valid = !!(
    formData.name &&
    formData.phone &&
    formData.address &&
    formData.city &&
    formData.pincode &&
    formData.collectionMethod &&
    (formData.collectionMethod === "COURIER" ||
      (formData.collectionMethod === "PICKUP" &&
        isPickupCovered &&
        (!enablePickupSlotSelection ||
          (formData.pickupDate &&
            formData.pickupTime &&
            !dateError &&
            !timeError &&
            !isAvailabilityLoading))))
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
        const isPackage = item.category !== "Test Panel";
        const paramObj = item.availableParameters?.find((p: any) => p.name === paramName);
        if (isPackage && (paramObj?.isBasePackageTest || !paramObj?.isCustom)) {
          // Bundled package tests are mandatory and cannot be removed
          return item;
        }

        const isCurrentlySelected = item.samples
          .find((s) => s.id === sampleId)
          ?.selectedParameters.includes(paramName);

        if (isPackage && paramObj?.isCustom && isCurrentlySelected) {
          // Unchecking a custom parameter on a package removes it
          const newSamples = item.samples.map((sample) => {
            if (sample.id !== sampleId) return sample;
            return {
              ...sample,
              selectedParameters: sample.selectedParameters.filter((p) => p !== paramName),
            };
          });
          const isStillUsed = newSamples.some((s) => s.selectedParameters.includes(paramName));
          const newAvailable = isStillUsed
            ? item.availableParameters
            : item.availableParameters?.filter((p: any) => !(p.isCustom && p.name === paramName));
          return {
            ...item,
            availableParameters: newAvailable,
            samples: newSamples,
          };
        }

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

  const addCustomParamToSample = (itemId: string, sampleId: string, customParamName: string) => {
    const trimmed = customParamName.trim();
    if (!trimmed) return;

    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;

        const existsInAvailable = item.availableParameters?.some(
          (p: any) => p.name.toLowerCase() === trimmed.toLowerCase()
        );
        const newAvailable = existsInAvailable
          ? item.availableParameters
          : [...(item.availableParameters || []), { name: trimmed, price: 0, isCustom: true }];

        const newSamples = item.samples.map((sample) => {
          if (sample.id !== sampleId) return sample;
          const alreadySelected = sample.selectedParameters.some(
            (p) => p.toLowerCase() === trimmed.toLowerCase()
          );
          if (alreadySelected) return sample;
          return {
            ...sample,
            selectedParameters: [...sample.selectedParameters, trimmed],
          };
        });

        return {
          ...item,
          availableParameters: newAvailable,
          samples: newSamples,
        };
      })
    );
  };

  const removeCustomParamFromSample = (itemId: string, sampleId: string, paramName: string) => {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const newSamples = item.samples.map((sample) => {
          if (sample.id !== sampleId) return sample;
          return {
            ...sample,
            selectedParameters: sample.selectedParameters.filter((p) => p !== paramName),
          };
        });
        const isStillUsed = newSamples.some((s) => s.selectedParameters.includes(paramName));
        const newAvailable = isStillUsed
          ? item.availableParameters
          : item.availableParameters?.filter((p: any) => !(p.isCustom && p.name === paramName));

        return {
          ...item,
          availableParameters: newAvailable,
          samples: newSamples,
        };
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
      const bookingId = res.data._id;
      if (!bookingId) {
        setPaymentError("Booking created but no booking ID returned. Please contact support.");
        setIsPaymentProcessing(false);
        return;
      }
      // Store so retries reuse the same booking
      setCreatedBookingId(bookingId);
      await initiateRazorpayPayment(bookingId);
    },
    onError: (err: any) => {
      setPaymentError(err.response?.data?.message || "Failed to create booking. Please try again.");
      setIsPaymentProcessing(false);
    },
  });

  // ─── Extracted payment flow ─── called with bookingId (new OR existing on retry)
  const initiateRazorpayPayment = async (bookingId: string) => {
    // Step 2: Create Razorpay order — amount read from DB, can't be tampered
    let orderData;
    try {
      const orderRes = await paymentApi.createOrder(bookingId);
      if (!orderRes.success) throw new Error("Failed to create payment order");
      orderData = orderRes.data;
    } catch (err: any) {
      setPaymentError(err?.response?.data?.message || "Could not initiate payment. Please try again.");
      setIsPaymentProcessing(false);
      return;
    }

    // Step 3: Open Razorpay Checkout modal
    const user = userResponse?.data;
    await openRazorpayCheckout({
      orderId: orderData.orderId,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      bookingId,
      prefill: {
        name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      onSuccess: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
        // Step 4: Verify signature on backend
        try {
          const verifyRes = await paymentApi.verifyPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
          });
          if (!verifyRes.success) throw new Error("Payment verification failed");

          // Step 5: All good — clear cart and go to confirmation
          setOrderId(bookingId);
          setCreatedBookingId(null); // reset for next booking
          setStep(5);
          setIsPaymentProcessing(false);
          try {
            await cartApi.clearCart();
            queryClient.invalidateQueries({ queryKey: ["cart"] });
          } catch (e) {
            console.error("Failed to clear cart:", e);
          }
        } catch (err: any) {
          setPaymentError(
            err?.response?.data?.message ||
            "Payment was received but verification failed. Please contact support with your booking ID: " + bookingId
          );
          setIsPaymentProcessing(false);
        }
      },
      onFailure: ({ description }) => {
        setPaymentError(description || "Payment failed. Please try again or use a different payment method.");
        setIsPaymentProcessing(false);
      },
      onDismiss: () => {
        // Booking is saved — user can click Pay Now again and we reuse same booking
        setPaymentError("Payment was cancelled. Click 'Pay Now' again to retry — no new booking will be created.");
        setIsPaymentProcessing(false);
      },
    });
  };

  const handleNext = async () => {
    if (step === 3) {
      if (saveAddressToProfile && (formData.address || formData.city || formData.pincode)) {
        try {
          await authApi.updateProfile({
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state || "",
              pincode: formData.pincode,
            },
            shippingAddress: {
              street: formData.address,
              city: formData.city,
              state: formData.state || "",
              pincode: formData.pincode,
              country: "India",
            },
            billingAddress: {
              street: formData.address,
              city: formData.city,
              state: formData.state || "",
              pincode: formData.pincode,
              country: "India",
            },
          });
          queryClient.invalidateQueries({ queryKey: ["user"] });
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          if (hasSavedAddress) {
            toast.success("Profile address updated successfully");
          } else {
            toast.success("Address saved to profile successfully");
          }
        } catch (err) {
          console.error("Failed to update profile address:", err);
        }
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!acceptedTerms) {
        toast.error("Please accept the terms and conditions for sample collection before proceeding to payment.");
        return;
      }
      setPaymentError(null);
      setIsPaymentProcessing(true);

      // ── If booking was already created (user cancelled/retrying), skip creation ──
      if (createdBookingId) {
        initiateRazorpayPayment(createdBookingId);
        return;
      }

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
          collectionMethod: formData.collectionMethod,
          paymentMethod: "RAZORPAY",
        },
      };
      createBooking(payload as any);
    } else if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0 && step < 5) {
      // If going back from step 4, clear the created booking ID
      // (user will be changing details, so we need a fresh booking on next Pay Now)
      if (step === 4) setCreatedBookingId(null);
      setPaymentError(null);
      setStep(step - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "city" && next.collectionMethod === "PICKUP" && !isCityCovered(value, pickupCities)) {
        next.collectionMethod = "";
        next.pickupDate = "";
        next.pickupTime = "";
      }
      return next;
    });
  };

  const setCollectionMethod = (method: CollectionMethod) => {
    setFormData((prev) => ({
      ...prev,
      collectionMethod: method,
      pickupDate: method === "COURIER" ? "" : prev.pickupDate,
      pickupTime: method === "COURIER" ? "" : prev.pickupTime,
    }));
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
    setCollectionMethod,
    pickupCities,
    isPickupCovered,
    enablePickupSlotSelection,
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
    addCustomParamToSample,
    removeCustomParamFromSample,
    updateSampleField,
    isCreatingBooking,
    isPaymentProcessing,
    paymentError,
    handleNext,
    handleBack,
    savedProfileAddress,
    hasSavedAddress,
    saveAddressToProfile,
    setSaveAddressToProfile,
    isUsingSavedAddress,
    handleToggleUseSavedAddress,
    acceptedTerms,
    setAcceptedTerms,
  };
}
