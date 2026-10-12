import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ToastContainer } from './components/Toast';

describe('ToastContainer Component', () => {
  it('renders success toast message properly', () => {
    const mockToasts = [{ id: '1', type: 'success' as const, message: 'Item added to cart!' }];
    render(<ToastContainer toasts={mockToasts} onDismiss={() => {}} />);
    expect(screen.getByText('Item added to cart!')).toBeDefined();
  });
});
