'use client';

import { useEffect } from 'react';
import DisableDevtool from '@/scripts/disable-devtools';

const DisableDevtools = () => {
  useEffect(() => {
    DisableDevtool();
    disableDevtools();
  }, []);

  const disableDevtools = () => {
    window.addEventListener('devtoolschange', function (event: any) {
      if (event.detail.isOpen) {
        alert('Unauthorized access is not allowed!');
      }
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.onkeydown = (e) => {
      if (e.keyCode === 123) {
        e.preventDefault();
      } else if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
      }
    };
  };

  return null;
};

export default DisableDevtools;
