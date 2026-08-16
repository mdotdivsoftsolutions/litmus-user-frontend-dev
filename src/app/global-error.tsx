"use client";

import { useEffect } from "react";
import { RefreshCw, Home, AlertOctagon } from "lucide-react";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical root global error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertOctagon className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              System Error
            </h1>
            <p className="text-sm text-slate-600">
              A critical error occurred. Please reload the application or try again later.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00751F] text-white font-medium hover:bg-[#005a18] transition-colors shadow"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </button>

            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
