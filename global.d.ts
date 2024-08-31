declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'globalThis';

declare module '*.mp3';
declare module '*.wav';
declare module 'react-copy-to-clipboard';

interface Window extends globalThis {
  TechSpark: any;
  OpenInstall: any;
  jsBridge: any;
  webkit: any;
}
interface Navigator {
  standalone?: boolean;
}
