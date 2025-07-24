import { style, keyframes } from '@vanilla-extract/css';

export const circle = style({
  width: 64,
  height: 64,
  borderRadius: '50%',
  border: '5px solid rgba(255,255,255,0.75)',
  background: 'transparent',
  position: 'fixed',
  zIndex: 1000,
  cursor: 'pointer',
  opacity: 0,
});

export const fadeIn = style({
  animation: `${keyframes({
    from: { opacity: 0 },
    to: { opacity: 1 },
  })} 1s ease forwards`,
});

export const fadedIn = style({
  opacity: 1,
});

export const active = style({
  selectors: {
    '&:after': {
      position: 'absolute',
      content: '',
      inset: -10,
      borderRadius: '50%',
      background: 'white',
      filter: 'brightness(1.5)',
      zIndex: 1,
    }
  },
});

const rippleKeyframes = keyframes({
  '0%': {
    opacity: 0.5,
    transform: 'scale(1)',
  },
  '80%': {
    opacity: 0.2,
    transform: 'scale(2)',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(2.2)',
  },
});

export const ripple = style({
  position: 'absolute',
  inset: -10,
  borderRadius: '50%',
  border: '4px solid #fff',
  pointerEvents: 'none',
  animation: `${rippleKeyframes} 800ms linear infinite`,
  zIndex: 1,
});

export const ripple2 = style([
  ripple,
  {
    animationDelay: '400ms',
  },
]);
