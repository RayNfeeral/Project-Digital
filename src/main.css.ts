import { style, globalStyle } from '@vanilla-extract/css'

globalStyle('html, body, #root', {
  height: '100%',
  margin: 0,
  padding: 0,
  background: '#000',
  color: '#fff',
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
})

globalStyle('body', {
  minHeight: '100vh',
  minWidth: '320px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

globalStyle('*', {
  boxSizing: 'border-box',
})

export const mainContainer = style({
  width: '100vw',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'black',
}) 