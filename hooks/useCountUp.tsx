import { useEffect, useState } from 'react';

const useCountUp = (endValue: number, duration: number) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startValue = value;
    const increment = (endValue - startValue) / (duration / 10);

    const timer = setInterval(() => {
      startValue += increment;
      if ((increment > 0 && startValue >= endValue) || (increment < 0 && startValue <= endValue)) {
        clearInterval(timer);
        setValue(endValue);
      } else {
        setValue(Math.round(startValue));
      }
    }, 10);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  return value;
};

export default useCountUp;
