import { ROUTES } from "@/constants/routes";

export interface ChatActionSuggestion {
  label: string;
  action: string;
  payload?: any;
  /** Only shown to signed-in customers (order tracking, reports...). */
  requiresAuth?: boolean;
}

/** Queue policy — must stay in sync with LIVE_SUPPORT in backend/src/constants. */
export const LIVE_SUPPORT_MAX_ATTEMPTS = 3;
export const LIVE_SUPPORT_ATTEMPT_SECONDS = 60;
export const LIVE_SUPPORT_TOTAL_SECONDS = LIVE_SUPPORT_MAX_ATTEMPTS * LIVE_SUPPORT_ATTEMPT_SECONDS;

/** Status copy shown while the customer waits, one entry per retry attempt. */
export const QUEUE_ATTEMPT_MESSAGES: ReadonlyArray<{ title: string; description: string }> = [
  {
    title: "Connecting to a Live Specialist",
    description: "Your request has been sent to our support desk. An available specialist will accept shortly.",
  },
  {
    title: "Specialists are busy",
    description: "All our specialists are assisting other customers. Please wait — this can take up to 5 minutes.",
  },
  {
    title: "Our agent seems to be away",
    description: "Final attempt. If no one picks up, we'll save your request and a specialist will contact you shortly.",
  },
];

/** Shown locally if the server could not confirm the timeout (e.g. connection dropped). */
export const LIVE_SUPPORT_AWAY_MESSAGE =
  "Our specialists are away or busy assisting other customers right now. We have saved your request and a Litmus specialist will contact you shortly (usually within 5 minutes during working hours). Meanwhile, I am happy to help you here.";

export const DEFAULT_CHAT_PROMPTS: ChatActionSuggestion[] = [
  { label: "📋 How do I book a test?", action: "ask_faq", payload: "book_test" },
  { label: "🔬 What can I test?", action: "ask_faq", payload: "what_can_i_test" },
  { label: "⚖️ How much sample is required?", action: "ask_faq", payload: "sample_quantity" },
  { label: "📍 Track my sample", action: "ask_faq", payload: "track_sample", requiresAuth: true },
  { label: "📦 View My Orders", action: "navigate", payload: ROUTES.ORDERS, requiresAuth: true },
  { label: "⏱️ When will I get my report?", action: "ask_faq", payload: "report_timeline" },
  { label: "💬 Talk to Support", action: "request_live_support" },
];

/** Routes that require a signed-in customer; used to gate chatbot navigation. */
const PROTECTED_PREFIXES = [ROUTES.ORDERS, ROUTES.REPORTS, ROUTES.PROFILE, ROUTES.BOOKING_NEW];

/** Legacy links stored in old chat transcripts, mapped to current routes. */
const LEGACY_ROUTE_MAP: Record<string, string> = {
  "/dashboard/bookings": ROUTES.ORDERS,
  "/dashboard/orders": ROUTES.ORDERS,
  "/dashboard/reports": ROUTES.REPORTS,
};

export function resolveChatRoute(path: string): string {
  return LEGACY_ROUTE_MAP[path] ?? path;
}

/**
 * Chat suggestions come from the server: only follow in-site paths ("/orders") or plain
 * http(s) links. Blocks javascript:/data: URLs and protocol-relative "//evil.com" paths.
 */
export function isSafeChatTarget(target: string): boolean {
  if (/^https?:\/\//i.test(target)) return true;
  return target.startsWith("/") && !target.startsWith("//") && !target.startsWith("/\\");
}

export function isProtectedRoute(path: string): boolean {
  const resolved = resolveChatRoute(path);
  return PROTECTED_PREFIXES.some((prefix) => resolved === prefix || resolved.startsWith(`${prefix}/`));
}

/**
 * Hides sign-in-only suggestions from guests. Also covers older transcripts whose
 * suggestions predate the `requiresAuth` flag by checking the navigation target.
 */
export function filterSuggestionsForAuth(
  suggestions: ChatActionSuggestion[] | undefined,
  isAuthenticated: boolean
): ChatActionSuggestion[] {
  if (!suggestions?.length) return [];
  if (isAuthenticated) return suggestions;
  return suggestions.filter((s) => {
    if (s.requiresAuth) return false;
    if (s.action === "navigate" && typeof s.payload === "string" && isProtectedRoute(s.payload)) return false;
    if (s.action === "ask_faq" && s.payload === "track_sample") return false;
    return true;
  });
}
