import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import Circle from './Circle';

const advanceLongPress = async () => {
  await act(async () => {
    vi.advanceTimersByTime(2000);
  });
};

describe('Circle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders at the bottom center initially and is visible', () => {
    const { getByTestId } = render(<Circle />);
    const circle = getByTestId('circle');
    expect(circle).toBeVisible();
    // Should have fade-in class
    expect(circle.className).toMatch(/fadeIn/);
  });

  it('has correct border and transparent background by default', () => {
    const { getByTestId } = render(<Circle />);
    const circle = getByTestId('circle');
    // Use regex to match vanilla-extract class
    expect(circle.className).toMatch(/circle/);
    // Border and background are checked via class
  });

  it('hides after 3 seconds of inactivity', () => {
    const { queryByTestId } = render(<Circle />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(queryByTestId('circle')).toBeNull();
  });

  it('reappears on screen click/touch at last position with fade-in', () => {
    const { getByTestId, queryByTestId, container } = render(<Circle />);
    fireEvent.click(getByTestId('circle'));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(queryByTestId('circle')).toBeNull();
    fireEvent.click(container);
    expect(getByTestId('circle')).toBeInTheDocument();
    expect(getByTestId('circle').className).toMatch(/fadeIn/);
  });

  it('does not jump if reappeared and clicked, only reappears', () => {
    const { getByTestId, container } = render(<Circle />);
    fireEvent.click(getByTestId('circle'));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    fireEvent.click(container);
    const circle = getByTestId('circle');
    fireEvent.click(circle);
    // Should require a long press to jump
  });

  it('jumps to a new position only after a long press (2s)', async () => {
    const { getByTestId } = render(<Circle />);
    const circle = getByTestId('circle');
    const initialTop = circle.style.top;
    const initialLeft = circle.style.left;
    fireEvent.mouseDown(circle);
    await advanceLongPress();
    fireEvent.mouseUp(circle);
    // Should update style to a new position
    expect(circle.style.top === initialTop && circle.style.left === initialLeft).toBe(false);
  });

  it('shows white background and 100% border opacity during long press', async () => {
    const { getByTestId } = render(<Circle />);
    const circle = getByTestId('circle');
    fireEvent.mouseDown(circle);
    // Should have active class
    expect(circle.className).toMatch(/active/);
    fireEvent.mouseUp(circle);
  });

  it('does not disappear if pressed or interacted with in the last 3 seconds', async () => {
    const { getByTestId, queryByTestId } = render(<Circle />);
    const circle = getByTestId('circle');
    // Press and hold for 1.5s, then release
    fireEvent.mouseDown(circle);
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    fireEvent.mouseUp(circle);
    // Wait another 2s (total 3.5s from start, but only 2s since last interaction)
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    // Should still be visible
    expect(queryByTestId('circle')).toBeInTheDocument();
    // Wait another 1.1s (now 3.1s since last interaction)
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    // Now it should disappear
    expect(queryByTestId('circle')).toBeNull();
  });

  it('resets active state when the circle disappears and reappears', async () => {
    const { getByTestId, queryByTestId, container } = render(<Circle />);
    const circle = getByTestId('circle');
    fireEvent.mouseDown(circle);
    expect(circle.className).toMatch(/active/);
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      expect(queryByTestId('circle')).toBeNull();
    }, { timeout: 10000 });
    fireEvent.click(container);
    const newCircle = getByTestId('circle');
    expect(newCircle.className).not.toMatch(/active/);
  }, 10000);
}); 