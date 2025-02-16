// components/AdScript.js
import Script from 'next/script';

const AdScript = () => {
  // Use your actual AdSense publisher ID (replace test ID in production)
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3940256099942544';

  return (
    <div data-testid="ad-script-container">
      <Script
        id="google-adsense-script"
        strategy="afterInteractive" // Changed from lazyOnload (better for ads)
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('AdSense script failed to load:', e);
        }}
      />
    </div>
  );
};

export default AdScript;