import { Shield, FileText, Package, Microscope } from "lucide-react";
import heroScientist from "@/assets/banner-hero-1.jpg";

export const homeHeroSlides = [
  {
    id: 1,
    title: "Certified Laboratory Testing at Your Fingertips",
    description:
      "Select your product, choose the required parameters, submit samples, and receive accredited laboratory reports without the hassle of contacting multiple labs.",
    badge: "NABL & FSSAI Accredited Labs",
    offer: "GET OFFERS UPTO 15% ON YOUR FIRST BOOKING",
    image: heroScientist,
    imageAlt: "Food Safety Specialist",
    video: "https://litmuslabs.sgp1.digitaloceanspaces.com/static-assets/video/video-banner.mp4",
    floatingBadges: [

      {
        icon: Shield,
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        title: "100% Reliable",
        subtitle: "Certified Results",
        position: "top-12 right-[10%]",
        animation: "animate-[bounce_3s_infinite]",
      },
      {
        icon: FileText,
        iconColor: "text-[#E53935]",
        iconBg: "bg-red-100",
        title: "FSSAI Ready",
        subtitle: "Auto-generated",
        position: "bottom-12 left-[10%]",
        animation: "animate-[bounce_4s_infinite_reverse]",
      },
    ],
  },
  {
    id: 2,
    title: "Comprehensive Food Safety Packages",
    description:
      "Explore bundled testing packages tailored for regulatory compliance. Stay FSSAI and NABL ready with our curated testing solutions.",
    badge: "Compliance Ready",
    offer: "FLAT 20% OFF ON COMPREHENSIVE PACKAGES",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Food Safety Packages",
    floatingBadges: [
      {
        icon: Package,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
        title: "Curated Packages",
        subtitle: "Save Time & Money",
        position: "top-12 right-[10%]",
        animation: "animate-[bounce_3s_infinite]",
      },
    ],
  },
  {
    id: 3,
    title: "Track & Analyze with Ease",
    description:
      "Get real-time status updates on your samples and download digitally certified, tamper-proof reports the moment they are ready.",
    badge: "Real-time Tracking",
    offer: "INSTANT DIGITAL REPORTS",
    image: heroScientist,
    imageAlt: "Track and Analyze",
    floatingBadges: [
      {
        icon: Microscope,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        title: "Real-time Updates",
        subtitle: "Track Samples",
        position: "bottom-12 left-[10%]",
        animation: "animate-[bounce_4s_infinite_reverse]",
      },
    ],
  },
];
