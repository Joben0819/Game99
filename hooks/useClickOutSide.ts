import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

const useClickOutSide = (theRef: RefObject<HTMLElement> | null) => {
	const [clickOutSide, setClickOutSide] = useState(false);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (theRef?.current && !theRef.current.contains(event.target as Node)) {
				setClickOutSide(true);
			} else {
				setClickOutSide(false);
			}
		};

		window.addEventListener('click', handleOutsideClick);

		return () => {
			window.removeEventListener('click', handleOutsideClick);
		};
	}, [clickOutSide]);

	return clickOutSide;
};

export default useClickOutSide;
