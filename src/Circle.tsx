import { useCircleLogic } from './useCircleLogic';
import * as styles from './circle.css';

const Circle = () => {
  const { visible, style, ref, isActive, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchEnd, visibilityToggle, isFadedIn, isFadingIn } = useCircleLogic();
  if (!visible) return null;
  return (
    <div
      key={visibilityToggle}
      ref={ref}
      data-testid="circle"
      className={[
        styles.circle,
        isFadingIn ? styles.fadeIn : '',
        isFadedIn ? styles.fadedIn : '',
        isActive ? styles.active : '',
      ].join(' ')}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isActive && (
        <>
          <span className={styles.ripple} data-testid="ripple-1" />
          <span className={styles.ripple2} data-testid="ripple-2" />
        </>
      )}
    </div>
  );
};

export default Circle; 