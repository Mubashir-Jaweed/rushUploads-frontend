// components/AdUnit.js
import { useEffect } from 'react';

const AdUnit = () => {
  useEffect(() => {
    // Load ad after component mounts
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3940256099942544"
        data-ad-slot='1234567890'
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdUnit;