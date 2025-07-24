import { style, keyframes } from '@vanilla-extract/css';

export const fadeIn = style({
  animation: `${keyframes({
    from: { opacity: 0 },
    to: { opacity: 1 },
  })} 1s ease forwards`,
});

export const circle = style({
  width: 64,
  height: 64,
  borderRadius: '50%',
  border: '5px solid rgba(255,255,255,0.75)',
  background: 'transparent',
  position: 'fixed',
  transition: 'background 0.2s, border-color 0.2s',
  zIndex: 1000,
  cursor: 'pointer',
  opacity: 0,
});

export const active = style({
  background: 'white',
  border: '5px solid rgba(255,255,255,1)',
}); 