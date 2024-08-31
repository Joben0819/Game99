import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image, { ImageProps } from 'next/image';
import { FC, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { staticImport } from '@/utils/resources';

type ImgWithFallbackProps = ImageProps & {
  fallback?: ImageProps['src'];
  loadingPlaceholder?: string | StaticImport;
  handleIconWidthChange?: (width: number | undefined) => void;
};

export const ImgWithFallback: FC<ImgWithFallbackProps> = ({
  fallback,
  alt,
  src,
  loadingPlaceholder,
  handleIconWidthChange,
  ...props
}) => {
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event> | null>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSrc, setSelectedSrc] = useState<string | StaticImport>(
    loadingPlaceholder || staticImport.game_item_placeholder,
  );

  useEffect(() => {
    setError(null);
    if(error) {
      setSelectedSrc(loadingPlaceholder!);
    }
  }, [src, error]);

  useEffect(() => {
    srcSelector();
  }, [isLoading]);

  useEffect(() => {
    handleIconWidthChange && handleIconWidthChange(iconRef?.current?.offsetHeight);
  }, [iconRef?.current?.offsetHeight, window.screen.orientation]);

  useEffect(() => {
    let debounceId: any;

    function handleDebouncedResize() {
      if (debounceId) {
        clearTimeout(debounceId);
      }
      debounceId = setTimeout(() => {
        handleResize();
      }, 1000);
    }

    window.addEventListener('resize', handleDebouncedResize);
    window.addEventListener('pageshow', handleDebouncedResize);
    window.addEventListener('orientationchange', handleDebouncedResize);

    return () => {
      window.removeEventListener('resize', handleDebouncedResize);
      window.removeEventListener('pageshow', handleDebouncedResize);
      window.removeEventListener('orientationchange', handleDebouncedResize);
    };
  }, []);

  const handleResize = useCallback(() => {
    setIconContainerSize();
  }, []);

  const setIconContainerSize = () => {
    if (!iconRef) return;
    handleIconWidthChange && handleIconWidthChange(iconRef?.current?.offsetHeight);
  };

  const srcSelector = () => {
    if (isLoading) {
      return setSelectedSrc(loadingPlaceholder ?? staticImport.game_item_placeholder);
    } else {
      if (error) {
        return setSelectedSrc(staticImport.game_item_placeholder);
      } else {
        return setSelectedSrc(src ?? staticImport.game_item_placeholder);
      }
    }
  };

  return (
    <Image
      ref={iconRef}
      alt={alt}
      onError={setError}
      onLoad={() => setIsLoading(false)}
      src={selectedSrc}
      blurDataURL={selectedSrc as string}
      {...props}
      className="cursor-pointer"
    />
  );
};
