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
  const [visibilityToggle, setVisibilityToggle] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
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

  useEffect(() => {
    if (visible) resetInactivityTimer();
    return () => {
      clearInactivityTimer();
    };
  }, [visible, resetInactivityTimer, clearInactivityTimer]);

  useEffect(() => {
    const handleScreenClick = () => {
      if (!visible) {
        setVisible(true);
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
  }, [resetInactivityTimer]);

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
      position: 'fixed' as const,
      top: position.top,
      left: position.left,
      zIndex: 1000,
      cursor: 'pointer',
    },
    ref,
    isActive,
    handleMouseDown,
    handleMouseUp,
    handleTouchStart,
    handleTouchEnd,
    visibilityToggle,
  };
}; 