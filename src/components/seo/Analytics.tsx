import { MetaPixelRouteTracker } from "./MetaPixelRouteTracker";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-FPLJR9VG4C";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MN9XNCDC";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1755389375728414";

// Only production builds report, so local development doesn't pollute the analytics data.
export const ANALYTICS_ENABLED = process.env.NODE_ENV === "production";

const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

const GTAG_SNIPPET = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`;

const META_PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`;

/**
 * Google Tag Manager, Google tag (GA4) and Meta Pixel, rendered as plain scripts inside <head>
 * so they are in the server HTML exactly where Google and Meta ask for them (Search Console's
 * Google Analytics / Tag Manager verification reads the raw <head>). All three load async, so
 * they don't block the first paint.
 */
export function AnalyticsHead() {
  if (!ANALYTICS_ENABLED) return null;
  return (
    <>
      {/* Google Tag Manager */}
      <script id="gtm" dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
      {/* Google tag (gtag.js) */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script id="gtag-init" dangerouslySetInnerHTML={{ __html: GTAG_SNIPPET }} />
      {/* Meta Pixel Code */}
      <script id="meta-pixel" dangerouslySetInnerHTML={{ __html: META_PIXEL_SNIPPET }} />
    </>
  );
}

/** Records a Meta Pixel PageView on client-side route changes; rendered inside <body>. */
export function AnalyticsRouteTracking() {
  if (!ANALYTICS_ENABLED) return null;
  return <MetaPixelRouteTracker />;
}

/** Fallbacks for visitors with JavaScript disabled; rendered right after the opening <body>. */
export function AnalyticsNoScript() {
  if (!ANALYTICS_ENABLED) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
