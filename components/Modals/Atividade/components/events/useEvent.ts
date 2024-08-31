import { useCallback, useEffect, useState } from 'react';
import { getActivityInfos, getActivityTypes } from '@/services/api';
import { ActivityTypesData } from '@/services/response-type';
import { TEvents } from '@/services/types';
import useToggle from '@/hooks/useToggle';

export const useEvent = () => {
  const [isLoading, toggleIsLoading] = useToggle(true);
  const [isLoadingEvents, toggleLoadingEvent] = useToggle(false);
  const [eventsTypes, setEventTypes] = useState<ActivityTypesData[]>([]);
  const [activeFrame, setActiveFrame] = useState<ActivityTypesData>({
    id: 0,
    isUrl: false,
    url: undefined,
    name: '',
    activityList: [],
  });
  const [selectedBannerIndex, setSelectedBannerIndex] = useState<number>(0);
  const [events, setEvents] = useState<TEvents[]>([]);
  const [id, setID] = useState(0);

  useEffect(() => {
    const bannerClicked = localStorage.getItem('banner-clicked') ?? '';
    fetchActivityTypes(bannerClicked);
  }, []);

  useEffect(() => {
    const disablePinchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };
    document.addEventListener('touchmove', disablePinchZoom, { passive: false });
    return () => {
      document.removeEventListener('touchmove', disablePinchZoom);
    };
  }, []);

  const refreshEvent = useCallback(async () => {
    const res = await getActivityInfos({ typeId: id });
    setEvents(res?.data?.data);
  }, [id]);

  const getEventsInfo = async (id: number) => {
    toggleLoadingEvent();
    try {
      const { data } = await getActivityInfos({ typeId: id });
      if (data?.code !== 200) return;
      setEvents(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      toggleLoadingEvent();
    }
  };

  const handleActiveSideMenu = useCallback(
    (menu: ActivityTypesData) => {
      setEvents([]);
      setActiveFrame(menu);
      if (!menu.isUrl) {
        setID(menu.id);
        getEventsInfo(menu.id);
      }
    },
    [selectedBannerIndex],
  );

  const handleEvent = (data: ActivityTypesData[], bannerClicked: string) => {
    setEventTypes(data);
    const selectedEvent = data.find((item) => {
      const parsedBanner = parseInt(bannerClicked);
      if (!parsedBanner) return null;
      return item.id === parsedBanner;
    });
    if (selectedEvent) setSelectedBannerIndex(data.indexOf(selectedEvent));
    handleActiveSideMenu(bannerClicked ? selectedEvent! : data[0]);
  };

  const fetchActivityTypes = async (bannerClicked: string) => {
    if (localStorage.getItem('activityTypes')) {
      const data = JSON.parse(localStorage.getItem('activityTypes')!);
      setEventTypes(data);
      handleEvent(data, bannerClicked);
      toggleIsLoading();
      return;
    }

    try {
      const { code, data } = await getActivityTypes();
      if (code !== 200) return;
      if (!data) return;
      handleEvent(data, bannerClicked);
    } catch (error) {
      console.error(error);
    } finally {
      toggleIsLoading();
    }
  };

  return {
    isLoading,
    isLoadingEvents,
    eventsTypes,
    activeFrame,
    selectedBannerIndex,
    events,
    handleActiveSideMenu,
    refreshEvent,
  };
};
