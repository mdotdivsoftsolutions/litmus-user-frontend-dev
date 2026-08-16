import type { Metadata } from "next";
import ConsultationPage from "@/views/user/ConsultationPage";

export const metadata: Metadata = {
  title: "Book Scientific & Lab Consultation | Litmus",
  description: "Schedule a one-on-one consultation with food scientists and quality assurance specialists for customized testing panels.",
};

export default function Page() {
  return <ConsultationPage />;
}