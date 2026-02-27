import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../test/mocks/i18n';
import { Header } from './Header';

describe('Header', () => {
  it('renders title and subtitle i18n keys', () => {
    render(<Header />);
    expect(screen.getByText('header.title')).toBeInTheDocument();
    expect(screen.getByText('header.subtitle')).toBeInTheDocument();
  });
});
