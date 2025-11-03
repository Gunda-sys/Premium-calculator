import { render, screen } from '@testing-library/react';
import Header from '../Header/Header';

describe('Header Component', () => {

  test('renders the header element with correct class', () => {
    render(<Header />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass('header-premium');
  });

  test('renders the heading with correct text and class', () => {
    render(<Header />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Premium calculator...');
    expect(heading).toHaveClass('header-text');
  });
});
