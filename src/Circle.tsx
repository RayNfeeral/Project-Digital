import { useCircleLogic } from './useCircleLogic';
import * as styles from './circle.css';

const Circle = () => {
  const { visible, style, ref, isActive, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchEnd, visibilityToggle } = useCircleLogic();
  if (!visible) return null;
  return (
    <div
      key={visibilityToggle}
      ref={ref}
      data-testid="circle"
      className={[
        styles.circle,
        styles.fadeIn,
        isActive ? styles.active : '',
      ].join(' ')}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};

export default Circle; 