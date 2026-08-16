export interface FAQData {
  id: number;
  question: string;
  answer: string;
}

export const homeFaqs: FAQData[] = [
  {
    id: 1,
    question: "What types of food safety tests does Litmus offer?",
    answer:
      "Litmus offers a comprehensive range of FSSAI-mandated food safety tests including microbiological testing, heavy metal analysis, pesticide residue testing, nutritional labeling, allergen testing, and adulteration detection. All tests are conducted in NABL-accredited laboratories.",
  },
  {
    id: 2,
    question: "How long does it take to receive my test report?",
    answer:
      "Standard reports are typically delivered within 5–7 business days after sample collection. For premium express testing, reports are available in 24–48 hours. You'll receive an email and SMS notification when your report is ready, and you can download it directly from your Litmus dashboard.",
  },
  {
    id: 3,
    question: "Are Litmus reports accepted by FSSAI and regulatory authorities?",
    answer:
      "Yes. All Litmus test reports are issued by NABL-accredited laboratories and are fully recognized by FSSAI (Food Safety and Standards Authority of India) and other statutory bodies. Our reports comply with IS/ISO/IEC 17025 standards, making them valid for licensing, audits, and regulatory submissions.",
  },
  {
    id: 4,
    question: "How is my food sample collected?",
    answer:
      "After booking, a trained Litmus sample collection specialist visits your premises at the scheduled time. Samples are collected using sterile, tamper-evident kits and transported in temperature-controlled conditions to maintain integrity. You receive a sample receipt with a unique tracking ID.",
  },
  {
    id: 5,
    question: "Can I track my sample in real time?",
    answer:
      "Absolutely. Every sample is assigned a unique tracking ID. You can monitor the complete chain of custody — from collection pickup, transit, lab receipt, analysis, and report generation — from your Litmus account dashboard at any time.",
  },
  {
    id: 6,
    question: "What is the refund or cancellation policy?",
    answer:
      "Orders can be cancelled for a full refund up to 12 hours before the scheduled sample collection time. Post-collection cancellations are not eligible for a refund, as lab analysis has already commenced. Please review our full policy at the Help Centre for edge cases.",
  },
];
