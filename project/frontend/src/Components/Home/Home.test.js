import {render, screen} from '@testing-library/react'
import Home from './Home';

test('displays output', () => {
  render(<Home />);

  expect(screen.getByRole("h2")).toHaveDisplayValue("Drive Safely and Get Rewarded!");
  expect(screen.getByRole("p")).toHaveDisplayValue("Join our program and earn rewards for your good driving behavior.");
});