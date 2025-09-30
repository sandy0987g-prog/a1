import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MetricsCards from './MetricsCards';

describe('MetricsCards', () => {
  it('should render metrics cards with data', () => {
    const mockMetrics = {
      totalParcels: 100,
      processed: 75,
      pendingInsurance: 10,
      errors: 5
    };

    render(<MetricsCards metrics={mockMetrics} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render zero values when metrics are empty', () => {
    const mockMetrics = {
      totalParcels: 0,
      processed: 0,
      pendingInsurance: 0,
      errors: 0
    };

    render(<MetricsCards metrics={mockMetrics} />);

    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });

  it('should display proper labels', () => {
    const mockMetrics = {
      totalParcels: 50,
      processed: 40,
      pendingInsurance: 5,
      errors: 5
    };

    render(<MetricsCards metrics={mockMetrics} />);

    expect(screen.getByText('Total Parcels')).toBeInTheDocument();
    expect(screen.getByText('Processed')).toBeInTheDocument();
    expect(screen.getByText('Pending Insurance')).toBeInTheDocument();
    expect(screen.getByText('Processing Errors')).toBeInTheDocument();
  });
});
