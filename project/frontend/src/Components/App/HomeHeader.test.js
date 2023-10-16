import {render, screen} from '@testing-library/react';
import App from './App';

test('Displays Home text', () => {
    render(<App />);
    const el = screen.getByText('Drive Safely and Get Rewarded!');
    expect(el).toBeInTheDocument();
});
  