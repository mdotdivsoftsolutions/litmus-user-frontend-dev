import { FooterSteps } from "./FooterSteps";
import { FooterFAQGrid } from "./FooterFAQGrid";
import { FooterIntroGrid } from "./FooterIntroGrid";
import { FooterTrustPoints } from "./FooterTrustPoints";

export function FooterSEO() {
  return (
    <section className="bg-white border-t border-slate-100 pt-12 md:pt-16 pb-8 md:pb-12 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 ">

        <FooterIntroGrid />
        <FooterTrustPoints />
      </div>
    </section>
  );
}
