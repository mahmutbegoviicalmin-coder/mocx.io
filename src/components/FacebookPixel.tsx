"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const FB_PIXEL_ID = "1390563582447505"; // Ovdje zamijenite sa vašim Pixel ID-jem

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Track pageview on route change
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname]);

  useEffect(() => {
    // Listen for Lemon Squeezy events (Purchase)
    const handleLemonSqueezyEvent = (event: any) => {
      if (event.detail && event.detail.event === "Payment.Success") {
        if ((window as any).fbq) {
          (window as any).fbq("track", "Purchase");
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("LemonSqueezy.Event", handleLemonSqueezyEvent);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("LemonSqueezy.Event", handleLemonSqueezyEvent);
      }
    };
  }, []);

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

