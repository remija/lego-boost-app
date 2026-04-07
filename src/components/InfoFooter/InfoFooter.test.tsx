import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../test/mocks/i18n';
import { InfoFooter } from './InfoFooter';

describe('InfoFooter', () => {
  it('renders i18n text key', () => {
    render(<InfoFooter />);
    expect(screen.getByText('infoFooter.text')).toBeInTheDocument();
  });
});
