# Litmus Food Analytics — User Frontend

Litmus is an advanced digital food diagnostics and laboratory testing marketplace connecting food manufacturers, cloud kitchens, D2C brands, and consumers with NABL-accredited and FSSAI-notified testing laboratories across India.

---

## 🏗️ Architecture & Component Philosophy

The frontend is built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **TanStack React Query**. It adheres to strict clean-code and modular architecture principles:

1. **Max 120–150 Lines Per Component File:** Large monolithic views are decomposed into focused subcomponents and dedicated custom hooks.
2. **One Component Per File:** Reusable cards, dialogs, drawers, and form steps are isolated into individual files.
3. **Separation of Concerns:**
   - **UI Components:** Responsible strictly for layout and rendering.
   - **Custom Hooks (`use<Feature>State.ts`):** Encapsulate complex state, calculations, mutations, and side effects.
   - **API Layer (`src/lib/api/` & `src/services/`):** Handles all HTTP requests, interceptors, and strict typing.
4. **Design Tokens & Typography Standards:**
   - Headings: `font-heading` (*Nunito*, Bold/Extrabold, line-height 1.3)
   - Body Copy: `font-body` (*Manrope*, Medium/Normal, line-height 1.5)
   - Numbers & Pricing: `font-data` (*Inter*, SemiBold/Bold, line-height 1.4)
   - Brand Colors: `#D32F2F` (Primary / Brand Red), `#F06C00` (Action Orange), `#10B981` (Success Green).

---

## 📁 Directory Structure

```text
src/
├── app/                              # Next.js App Router Pages
│   └── (user)/                       # Consumer & Business routes
│       ├── page.tsx                  # Home Page
│       ├── tests/                    # Tests listing & [id] detail routes
│       ├── packages/                 # Packages listing & [id] detail routes
│       ├── labs/                     # Laboratories listing & [id] detail routes
│       ├── bookings/new/             # Booking Wizard route
│       ├── orders/                   # Order tracking & [id] breakdown
│       ├── profile/                  # User / Business Profile
│       ├── consultation/             # Advisory booking
│       ├── about/                    # About Litmus
│       └── ...                       # Policies, Blogs, Careers, Support
│
├── views/user/                       # View Controllers & Feature Subcomponents
│   ├── NewBookingPage.tsx            # Multi-step Booking Wizard coordinator (<90 lines)
│   ├── TestDetailPage.tsx           # Test Detail coordinator (<110 lines)
│   ├── PackageDetailPage.tsx        # Package Detail coordinator (<115 lines)
│   ├── LabDetailConsumerPage.tsx     # Lab Detail coordinator (<85 lines)
│   ├── ConsumerProfilePage.tsx       # Profile coordinator (<110 lines)
│   ├── OrderDetailPage.tsx          # Order Detail coordinator (<85 lines)
│   ├── LaboratoriesPage.tsx          # Laboratories coordinator (<65 lines)
│   ├── AboutPage.tsx                 # About Us coordinator (<45 lines)
│   ├── components/                   # Modular subcomponent libraries
│   │   ├── booking/                  # Booking wizard steps, cards & custom hook
│   │   ├── test-detail/              # Test detail header, parameters selector & sidebar
│   │   ├── package-detail/           # Package header, included tests, FAQ & sidebar
│   │   ├── lab-detail/               # Hero, tabs (tests, overview, facility, reviews) & promo
│   │   ├── profile/                  # Sidebar, InfoTab, DocumentsTab, SettingsTab
│   │   ├── order-detail/             # Timeline, info cards & sample breakdown
│   │   ├── labs/                     # Filters, GridView, TableView
│   │   ├── home-hero/                # Hero slides, desktop/mobile search & actions
│   │   ├── tests-listing/            # Tests hero, search, why-litmus & trust cards
│   │   ├── packages/                 # Packages hero, search & grid
│   │   ├── consultation/             # Consultation modal, form view & success view
│   │   ├── home/                     # FAQ items, process steps, test cards & banners
│   │   └── about/                    # Story, metrics, vision/mission, values, milestones
│   └── RegisterPage.tsx              # Registration wizard coordinator (<115 lines)
│       └── register/                 # Brand panel, business info, FSSAI, password & OTP steps
│
├── components/
│   ├── auth/                         # Auth modal coordinator, sub-forms & account blocked modal
│   ├── cart/                         # Cart drawer coordinator, item, footer & empty state
│   ├── layout/
│   │   ├── header/                   # Header coordinator, nav links, location selector, user menu & mobile drawer
│   │   ├── Footer.tsx                # Global footer
│   │   └── FloatingSupportChat.tsx   # Floating chat coordinator, trigger & window
│   ├── common/                       # SearchAutocomplete (supports top/bottom dropdowns)
│   └── ui/                           # Shadcn UI primitives (Button, Card, Input, Dialog, etc.)
│
├── lib/
│   ├── api/                          # Axios API clients (auth, booking, cart, lab, package, test, search, etc.)
│   ├── constants.ts                  # App-wide constants (WhatsApp URLs, API endpoints)
│   └── utils.ts                      # Currency formatters, cn helper, date helpers
│
└── services/                         # Service layer wrappers (cartService, etc.)
```

---

## 📊 Modular Component Decomposition Summary

| Module / View | Original Lines | Refactored Lines | Modularized Components & Hooks |
| :--- | :--- | :--- | :--- |
| **New Booking Wizard** | 1,144 | **90** | `useNewBookingState.ts`, `BookingWizardStepsHeader`, `BookingStep0Review`, `SampleCard`, `BookingStep1Samples`, `BookingStep2LabSelection`, `BookingStep3Collection`, `BookingStep4Payment`, `BookingStep5Confirmation`, `BookingSidebarSummary` |
| **Auth Modal** | 505 | **110** | `useAuthModalState.ts`, `AuthLoginForm`, `AuthRegisterForm`, `AuthOtpForm`, `AuthForgotPasswordForm`, `AuthResetPasswordForm`, `AuthResetSuccess` |
| **Lab Detail Page** | 489 | **85** | `LabHeroHeader`, `LabTestsTab`, `LabOverviewTab`, `LabFacilityTab`, `LabReviewsTab`, `LabSidebarCard`, `LabPromoBanner`, `LabDetailSkeleton` |
| **Package Detail Page** | 370 | **115** | `PackageDetailHeader`, `PackageTestsIncluded`, `PackageFaqSection`, `PackageBookingSidebar` |
| **Consumer Profile Page** | 375 | **110** | `ProfileSidebar`, `ProfileInfoTab`, `ProfileDocumentsTab`, `ProfileSettingsTab` |
| **Test Detail Page** | 342 | **110** | `TestDetailHeader`, `TestParametersSelector`, `TestBookingSidebar` |
| **Global Header** | 317 | **110** | `HeaderLocationSelector`, `HeaderNavLinks`, `HeaderUserMenu`, `HeaderMobileDrawer` |
| **Home Hero Section** | 309 | **110** | `homeHeroSlides.tsx`, `HomeHeroDesktopSearch.tsx`, `HomeHeroMobileSearch.tsx` |
| **About Us Page** | 301 | **45** | `AboutStorySection`, `AboutMetricsSection`, `AboutVisionMission`, `AboutValuesPillars`, `AboutMilestonesQuality` |
| **Business Registration** | 271 | **115** | `RegisterBrandPanel`, `RegisterBusinessInfoStep`, `RegisterFssaiStep`, `RegisterPasswordStep`, `RegisterOtpStep` |
| **Home Test Packages** | 252 | **70** | `TestCard.tsx` (standalone reusable component) |
| **Order Detail Breakdown** | 232 | **85** | `OrderTrackingTimeline`, `OrderInfoCards`, `OrderSampleBreakdown` |
| **Packages Hero** | 217 | **110** | `PackagesHeroSearch`, `PackagesHeroVideo` |
| **Why Litmus Section** | 211 | **85** | `WhyLitmusFeatureCards`, `WhyLitmusVisualColumn` |
| **Laboratories Page** | 206 | **65** | `LaboratoriesFilters`, `LaboratoriesGridView`, `LaboratoriesTableView` |
| **Consultation Modal** | 205 | **65** | `ConsultationSuccessView`, `ConsultationFormView` |
| **Tests Hero** | 202 | **85** | `TestsHeroSearch` |
| **Trust & Ordering** | 214 | **20** | `TrustCarouselCard`, `EasyOrderingCard` |
| **Home FAQ** | 200 | **70** | `FAQItem.tsx`, `faq-data.ts` |
| **Floating Support Chat** | 189 | **45** | `SupportChatTrigger.tsx`, `SupportChatWindow.tsx` |
| **Cart Drawer** | 183 | **85** | `CartDrawerItem`, `CartDrawerFooter`, `CartDrawerEmpty` |
| **Login Section** | 165 | **115** | `AccountBlockedModal.tsx` |

---

## 🚀 Key Features & Capabilities

- **🧪 Dynamic Parameter Selection:** Select and deselect individual chemical, physical, and microbiological parameters with live recalculation of pricing and testing turn-around times (TAT).
- **📦 Comprehensive Food Safety Bundles:** Multi-test packages customized for dairy, beverages, bakery, edible oils, meat, water, and FMCG regulatory submissions.
- **🔬 Accredited Partner Laboratory Network:** Filter and compare NABL and FSSAI-certified testing labs by city, capability, rating, and starting price.
- **🚚 Temperature-Controlled Sample Logistics:** Multi-sample booking with batch tracking, SKU mapping, and door-step cold-chain collection scheduling.
- **📄 Digital Tamper-Proof Reports:** Direct in-app downloads of verified QR-coded certificates and FSSAI-ready compliance artefacts.
- **🔍 Intelligent Omnisearch:** Live autocomplete supporting bidirectional dropdown positioning (`dropdownPosition="top" | "bottom"`) to avoid overflow clipping across headers and hero banners.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn / pnpm

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Run the Next.js development server
npm run dev

# 3. Open local preview
http://localhost:3000
```

### TypeScript Validation
```bash
# Run strict TypeScript compiler verification
npx tsc --noEmit
```

---

## 📜 Coding Conventions & Guidelines

- **File Limit:** Keep all component and view files under 120–150 lines.
- **Single Component Per File:** Never export multiple primary React components from the same `.tsx` file.
- **Styling:** Use standard Tailwind CSS utility classes aligned with design tokens (`bg-brand-action`, `text-brand-primary`, `font-heading`, `font-body`, `font-data`).
- **Data Hydration Safety:** Use `suppressHydrationWarning` on dynamic currency and timestamp displays (`formatCurrency(price)`).
