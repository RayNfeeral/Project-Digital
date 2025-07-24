import { useCallback, useEffect, useRef, useState } from 'react';

type Position = { top: number; left: number };

const CIRCLE_SIZE = 64;
const EDGE_MARGIN = 16;
const HIDE_TIMEOUT = 3000;
const LONG_PRESS_TIME = 2000;

const getRandomPosition = (): Position => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const maxLeft = width - CIRCLE_SIZE - EDGE_MARGIN;
  const maxTop = height - CIRCLE_SIZE - EDGE_MARGIN;
  const minLeft = EDGE_MARGIN;
  const minTop = EDGE_MARGIN;
  const left = Math.random() * (maxLeft - minLeft) + minLeft;
  const top = Math.random() * (maxTop - minTop) + minTop;
  return { top, left };
};

export const useCircleLogic = () => {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState<Position>(() => {
    const width = window.innerWidth;
    const left = width / 2 - CIRCLE_SIZE / 2;
    const top = window.innerHeight - CIRCLE_SIZE - EDGE_MARGIN;
    return { top, left };
  });
  const [isActive, setIsActive] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isFadedIn, setIsFadedIn] = useState(false);
  const [visibilityToggle, setVisibilityToggle] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const fadeInTimer = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const clearInactivityTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    timer.current = setTimeout(() => {
      setIsActive(false); // Reset active state before disappearing
      setVisible(false);
      setVisibilityToggle((v) => v + 1); // Force re-render
    }, HIDE_TIMEOUT);
  }, [clearInactivityTimer]);

  const fadeIn = useCallback(() => {
    if (fadeInTimer.current) clearTimeout(fadeInTimer.current)
    setIsFadedIn(false);
    setIsFadingIn(true);
    fadeInTimer.current = setTimeout(() => {
      setIsFadedIn(true);
      setIsFadingIn(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const onContextMenu = window.oncontextmenu;
    window.oncontextmenu = (e) => e.preventDefault();

    return () => {window.oncontextmenu = onContextMenu};  
  }, [])

  useEffect(() => {
    if (visible) {
      resetInactivityTimer();
      fadeIn();
      return () => {
        clearInactivityTimer();
      };
    }
    setIsFadingIn(false);
    setIsFadedIn(false);
    return () => {
      clearInactivityTimer();
    };
  }, [visible, resetInactivityTimer, clearInactivityTimer, fadeIn]);

  useEffect(() => {
    const handleScreenClick = () => {
      if (!visible) {
        setVisible(true);
        setIsActive(false); // Reset active state on reappear
        setVisibilityToggle((v) => v + 1); // Force re-render
      }
    };
    window.addEventListener('click', handleScreenClick);
    window.addEventListener('touchstart', handleScreenClick);
    return () => {
      window.removeEventListener('click', handleScreenClick);
      window.removeEventListener('touchstart', handleScreenClick);
    };
  }, [visible]);

  const handleJump = useCallback(() => {
    setPosition(getRandomPosition());
    resetInactivityTimer();
    fadeIn();
  }, [fadeIn, resetInactivityTimer]);

  const handleMouseDown = useCallback(() => {
    setIsActive(true);
    resetInactivityTimer();
    longPressTimer.current = setTimeout(() => {
      handleJump();
      setIsActive(false);
    }, LONG_PRESS_TIME);
  }, [handleJump, resetInactivityTimer]);

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
    resetInactivityTimer();
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, [resetInactivityTimer]);

  const handleTouchStart = useCallback(() => {
    setIsActive(true);
    resetInactivityTimer();
    longPressTimer.current = setTimeout(() => {
      handleJump();
      setIsActive(false);
    }, LONG_PRESS_TIME);
  }, [handleJump, resetInactivityTimer]);

  const handleTouchEnd = useCallback(() => {
    setIsActive(false);
    resetInactivityTimer();
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, [resetInactivityTimer]);

  return {
    visible,
    style: {
      top: position.top,
      left: position.left,
    },
    ref,
    isActive,
    handleMouseDown,
    handleMouseUp,
    handleTouchStart,
    handleTouchEnd,
    visibilityToggle,
    isFadingIn,
    isFadedIn,
  };
}; 