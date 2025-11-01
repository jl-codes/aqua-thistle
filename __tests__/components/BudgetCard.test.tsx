import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BudgetCard } from '@/components/ui/budget-card';
import { DollarSign } from 'lucide-react';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  DollarSign: ({ className }: { className?: string }) => (
    <div data-testid="dollar-sign-icon" className={className}></div>
  ),
}));

describe('BudgetCard', () => {
  const defaultProps = {
    title: 'Monthly Income',
    amount: '$1,200',
    status: 'good' as const,
  };

  it('renders basic budget card correctly', () => {
    render(<BudgetCard {...defaultProps} />);
    
    expect(screen.getByText('Monthly Income')).toBeInTheDocument();
    expect(screen.getByText('$1,200')).toBeInTheDocument();
  });

  it('applies correct status styling for good status', () => {
    render(<BudgetCard {...defaultProps} status="good" />);
    
    const card = screen.getByText('Monthly Income').closest('.bg-green-50');
    expect(card).toHaveClass('border-green-200');
  });

  it('applies correct status styling for warning status', () => {
    render(<BudgetCard {...defaultProps} status="warning" />);
    
    const card = screen.getByText('Monthly Income').closest('.bg-yellow-50');
    expect(card).toHaveClass('border-yellow-200');
  });

  it('applies correct status styling for danger status', () => {
    render(<BudgetCard {...defaultProps} status="danger" />);
    
    const card = screen.getByText('Monthly Income').closest('.bg-red-50');
    expect(card).toHaveClass('border-red-200');
  });

  it('renders icon when provided', () => {
    render(<BudgetCard {...defaultProps} icon={<DollarSign />} />);
    
    expect(screen.getByTestId('dollar-sign-icon')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<BudgetCard {...defaultProps} description="From part-time job" />);
    
    expect(screen.getByText('From part-time job')).toBeInTheDocument();
  });

  it('renders progress bar when progress is provided', () => {
    render(<BudgetCard {...defaultProps} progress={75} />);
    
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('applies hover effects', () => {
    render(<BudgetCard {...defaultProps} />);
    
    const card = screen.getByText('Monthly Income').closest('[class*="hover:scale-105"]');
    expect(card).toHaveClass('hover:scale-105', 'hover:shadow-lg');
  });

  it('handles large amounts correctly', () => {
    render(<BudgetCard {...defaultProps} amount="$23,000" />);
    
    expect(screen.getByText('$23,000')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<BudgetCard {...defaultProps} className="custom-class" />);
    
    const card = screen.getByText('Monthly Income').closest('.custom-class');
    expect(card).toHaveClass('custom-class');
  });

  it('has proper accessibility structure', () => {
    render(<BudgetCard {...defaultProps} />);
    
    const title = screen.getByText('Monthly Income');
    const amount = screen.getByText('$1,200');
    
    expect(title).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
    
    // Check that the components are properly structured
    expect(title).toHaveClass('font-bold');
    expect(amount).toHaveClass('text-2xl', 'font-bold');
  });
});

// Test for different status combinations
describe('BudgetCard Status Integration', () => {
  it('renders consistently across all status types', () => {
    const statuses: Array<'good' | 'warning' | 'danger'> = ['good', 'warning', 'danger'];
    
    statuses.forEach(status => {
      const { unmount } = render(
        <BudgetCard 
          title={`${status} Status Card`}
          amount="$1,000" 
          status={status} 
          progress={50}
        />
      );
      
      expect(screen.getByText(`${status} Status Card`)).toBeInTheDocument();
      expect(screen.getByText('$1,000')).toBeInTheDocument();
      
      unmount();
    });
  });
});
