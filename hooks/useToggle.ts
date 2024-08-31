import { useCallback, useState } from 'react';

type ToggleReturnType = [isToggled: boolean, toggle: () => void, setOn: () => void, setOff: () => void];

const useToggle = (initialValue: boolean): ToggleReturnType => {
  const [isToggled, setIsToggled] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setIsToggled((prevState) => !prevState);
  }, []);

  const setOn = useCallback(() => {
    setIsToggled(true);
  }, []);

  const setOff = useCallback(() => {
    setIsToggled(false);
  }, []);

  return [isToggled, toggle, setOn, setOff];
};

export default useToggle;
