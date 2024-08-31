import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { DraggableEvent, DraggableEventHandler } from 'react-draggable';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal, setThirdModal } from '@/reducers/appData';
import { useAppDispatch, useAppSelector } from '@/store';

export const useGameScreen = () => {
  const dispatch = useAppDispatch();
  const [game, setGame] = useState('');
  const defaultCoords = { x: 30, y: 38 };
  const [start, setStart] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const gameUrl = useAppSelector((state) => state.appData.gameUrl);

  useEffect(() => {
    setGame(gameUrl);
  }, [gameUrl]);

  useEffect(() => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setSecondModal(DATA_MODAL.CLOSE));
    dispatch(setThirdModal(DATA_MODAL.CLOSE));

    const root = document.getElementById('root') as HTMLElement | null;
    const onRoot = document.getElementById('onroot') as HTMLElement | null;

    if (root !== null) {
      if (root.style) {
        root.style.width = '100%';
        root.style.height = '100%';
        root.style.transform = 'none';
      }
    }

    if (onRoot !== null) {
      if (onRoot.style) {
        onRoot.style.width = '100%';
        onRoot.style.height = '100%';
      }
    }
    
    return () => {
      if (root) {
        const styles = window.getComputedStyle(root);
        const width = styles.getPropertyValue('width');
        const height = styles.getPropertyValue('height');
        sessionStorage.setItem('Width', width);
        sessionStorage.setItem('Height', height);
        const transform = styles.getPropertyValue('transform');
        if (root !== null) {
          if (root.style) {
            root.style.width = height;
            root.style.height = width;
            root.style.transform = transform;
          }
        }
        sessionStorage.removeItem('on-game');
        if (onRoot !== null) {
          if (onRoot.style) {
            onRoot.style.width = '';
            onRoot.style.height = '';
          }
        }
      }
    };
  }, []);

  const getCoordsFromLocalStorage = (key: string) => {
    const storedCoords = localStorage.getItem(key);
    return storedCoords ? JSON.parse(storedCoords) : defaultCoords;
  };

  const coordinatesMobile = getCoordsFromLocalStorage('exitButtonCoordsMobile');
  const coordinatesDesktop = getCoordsFromLocalStorage('exitButtonCoordsDesktop');
  const defaultPosition = isMobile ? coordinatesMobile : coordinatesDesktop;

  const onDragStop: DraggableEventHandler = (event: DraggableEvent) => {
    let dragMouseDesktop;
    let dragMouseMobile;
    const exitButton = document.getElementById('exit-button');

    if (isMobile && exitButton) {
      const transformStyle = exitButton.style.transform;
      const isMatch = transformStyle.match(/translate\(([^,]+)px,\s*([^,]+)px\)/);

      if (isMatch) {
        dragMouseMobile = { x: parseFloat(isMatch[1]), y: parseFloat(isMatch[2]) };
        localStorage.setItem('exitButtonCoordsMobile', JSON.stringify(dragMouseMobile));
      }
    } else {
      if ('clientX' in event && 'clientY' in event) {
        const mouseEvent = event as MouseEvent;
        dragMouseDesktop = { x: mouseEvent.clientX - mouseEvent.offsetX, y: mouseEvent.clientY - mouseEvent.offsetY };
        localStorage.setItem('exitButtonCoordsDesktop', JSON.stringify(dragMouseDesktop));
      }
    }
    if (start) {
      setShowExit(true);
    } else {
      setShowExit(false);
      setTimeout(function () {
        setStart(true);
      }, 1500);
    }
  };

  const onDragStart = () => {
    setTimeout(function () {
      setStart(true);
    }, 50);
  };

  const onDrag = () => {
    setTimeout(function () {
      setStart(false);
    }, 150);
  };

  const handleCancelExit = () => {
    setShowExit(false);
    setStart(false);
  };

  return {
    game,
    showExit,
    defaultPosition,
    setStart,
    onDragStop,
    onDrag,
    onDragStart,
    handleCancelExit,
  };
};
