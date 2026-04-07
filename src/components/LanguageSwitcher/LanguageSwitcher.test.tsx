import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const changeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'fr',
      changeLanguage,
    },
  }),
}));

import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('renders FR and EN buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('FR')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('FR button has active class when language is fr', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('FR').classList.contains('language-switcher__button--active')).toBe(true);
    expect(screen.getByText('EN').classList.contains('language-switcher__button--active')).toBe(false);
  });

  it('calls changeLanguage on click', async () => {
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByText('EN'));
    expect(changeLanguage).toHaveBeenCalledWith('en');
  });
});
