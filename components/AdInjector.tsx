// components/AdInjector.tsx
'use client';
import Script from 'next/script';

export default function AdInjector() {
  return (
    <Script
      strategy="afterInteractive"
      id="client-ad-script"
      dangerouslySetInnerHTML={{
        __html: `
          const uploadL = document.getElementById('upload-l');
          const uploadR = document.getElementById('upload-r');
          const supportR = document.getElementById('support-r');
          const supportL = document.getElementById('support-l');
          const homeR = document.getElementById('home-r');
          const homeL = document.getElementById('home-l');
          const prev1 = document.getElementById('prev-1');
          const prev2 = document.getElementById('prev-2');
          
          [uploadL, uploadR, supportR, supportL, homeR, homeL, prev1, prev2].forEach((slot) => {
            if (slot) {
              const script = document.createElement('script');
              script.src = '${process.env.NEXT_PUBLIC_AD_SCRIPT_URL}';
              slot.appendChild(script);
            }
          });
        `,
      }}
    />
  );
}