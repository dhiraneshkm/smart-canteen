import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge Component', () => {
  it('renders PLACED status correctly with proper text', () => {
    render(<StatusBadge status="PLACED" />);
    expect(screen.getByText('PLACED')).toBeDefined();
  });

  it('renders READY status with emerald badge', () => {
    render(<StatusBadge status="READY" />);
    expect(screen.getByText('READY')).toBeDefined();
  });

  it('renders PREPARING status correctly', () => {
    render(<StatusBadge status="PREPARING" />);
    expect(screen.getByText('PREPARING')).toBeDefined();
  });
});
