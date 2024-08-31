import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Page from '../Example/ExampleTestComponent';

describe('Page 3', () => {
  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
