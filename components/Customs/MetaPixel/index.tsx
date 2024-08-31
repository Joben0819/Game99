'use client';

// import Script from 'next/script';
import { useEffect } from 'react';

import { Pixel } from '@framit/meta-pixel';

const MetaPixel = () => {
  useEffect(() => {
    const config: any = {
      pixelId: '1581606902764943',
      autoConfig: true, // Optional, true as default.
      isDebugMode: false, // Optional, false as default.
      disablePushState: false, // Optional, false as default. It's not recommended to disable push state, read more at https://developers.facebook.com/ads/blog/post/2017/05/29/tagging-a-single-page-application-facebook-pixel
      allowDuplicatePageViews: false, // Optional, false as default.
    };

    Pixel.initialize(config);
    Pixel.pageView();
  }, []);

  return null;

  // return (
  //   <>
  //     <Script
  //       id="fb-pixel"
  //       strategy="afterInteractive"
  //       dangerouslySetInnerHTML={{
  //         __html: `
  //           !function(f,b,e,v,n,t,s)
  //           {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  //           n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  //           if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  //           n.queue=[];t=b.createElement(e);t.async=!0;
  //           t.src=v;s=b.getElementsByTagName(e)[0];
  //           s.parentNode.insertBefore(t,s)}(window, document,'script',
  //           'https://connect.facebook.net/en_US/fbevents.js');
  //           fbq('init', '1581606902764943');
  //           fbq('track', 'PageView');
  //         `,
  //       }}
  //     />
  //     <noscript>
  //       <img
  //         height="1"
  //         width="1"
  //         style={{ display: 'none' }}
  //         src="https://www.facebook.com/tr?id=1581606902764943&ev=PageView&noscript=1"
  //       />
  //     </noscript>
  //   </>
  // );
};

export default MetaPixel;
