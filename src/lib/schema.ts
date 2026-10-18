import { SITE_NAME, SITE_URL } from "./seo";

/** schema.org structured data (JSON-LD) for search engines and AI crawlers. */

const ORG_ID = `${SITE_URL}/#organization`;

const AREA_SERVED = [
  { "@type": "Country", name: "India" },
  { "@type": "City", name: "Chennai" },
  { "@type": "City", name: "Kochi" },
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      alternateName: "Litmus Food Analytics",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.webp`,
      description:
        "Litmus Labs is a food and laboratory testing network offering NABL accredited and FSSAI approved food, water and agricultural testing across India.",
      areaServed: AREA_SERVED,
      knowsAbout: [
        "Food testing",
        "NABL accredited laboratory testing",
        "FSSAI compliance",
        "Water testing",
        "Shelf life studies",
        "Pesticide residue testing",
        "Heavy metal testing",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+91-9092218770",
        availableLanguage: "English",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "19:00",
        },
      },
      sameAs: [
        "https://twitter.com/Litmus",
        "https://linkedin.com/company/litmus",
        "https://instagram.com/litmus",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": ORG_ID },
    },
  ],
};

export const testsServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Food, Water and Agricultural Testing",
  serviceType: "Laboratory food testing",
  description:
    "NABL accredited food, water and agricultural testing including microbiology, heavy metals, pesticide residue, nutritional analysis and shelf life studies.",
  url: `${SITE_URL}/tests`,
  provider: { "@id": ORG_ID },
  areaServed: AREA_SERVED,
};

/** Built from the same Q&A list the page renders, so the markup always matches what visitors see. */
export const faqPageSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});
