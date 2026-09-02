export function FooterBottom() {
  return (
    <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-[13px] text-slate-600 font-medium text-center sm:text-left">
        © {new Date().getFullYear()} Litmus Food Analytics. All rights reserved.
      </div>
      <div className="flex items-center gap-6 text-slate-600">
        <a
          href="https://twitter.com/Litmus"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Litmus on Twitter"
          className="hover:text-brand-primary cursor-pointer text-[13px] transition-colors font-semibold"
        >
          Twitter
        </a>
        <a
          href="https://linkedin.com/company/litmus"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Litmus on LinkedIn"
          className="hover:text-brand-primary cursor-pointer text-[13px] transition-colors font-semibold"
        >
          LinkedIn
        </a>
        <a
          href="https://instagram.com/litmus"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Litmus on Instagram"
          className="hover:text-brand-primary cursor-pointer text-[13px] transition-colors font-semibold"
        >
          Instagram
        </a>
      </div>
    </div>
  );
}
