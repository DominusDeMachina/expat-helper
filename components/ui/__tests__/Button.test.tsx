import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../Button';
import { PaperProvider } from 'react-native-paper';
import React from 'react';

// Test wrapper with PaperProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider>{children}</PaperProvider>
);

const renderWithProvider = (component: React.ReactElement) => 
  render(component, { wrapper: TestWrapper });

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    renderWithProvider(<Button title="Test Button" />);
    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { rerender } = renderWithProvider(<Button title="Primary" variant="primary" />);
    expect(screen.getByText('Primary')).toBeTruthy();

    rerender(
      <TestWrapper>
        <Button title="Secondary" variant="secondary" />
      </TestWrapper>
    );
    expect(screen.getByText('Secondary')).toBeTruthy();

    rerender(
      <TestWrapper>
        <Button title="Text" variant="text" />
      </TestWrapper>
    );
    expect(screen.getByText('Text')).toBeTruthy();

    rerender(
      <TestWrapper>
        <Button title="Destructive" variant="destructive" />
      </TestWrapper>
    );
    expect(screen.getByText('Destructive')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { rerender } = renderWithProvider(<Button title="Small" size="sm" />);
    expect(screen.getByText('Small')).toBeTruthy();

    rerender(
      <TestWrapper>
        <Button title="Medium" size="md" />
      </TestWrapper>
    );
    expect(screen.getByText('Medium')).toBeTruthy();

    rerender(
      <TestWrapper>
        <Button title="Large" size="lg" />
      </TestWrapper>
    );
    expect(screen.getByText('Large')).toBeTruthy();
  });

  it('handles onPress events', () => {
    const mockOnPress = jest.fn();
    renderWithProvider(<Button title="Pressable" onPress={mockOnPress} />);
    
    const button = screen.getByText('Pressable');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders with icons', () => {
    renderWithProvider(
      <Button 
        title="With Icon" 
        leftIcon={<span>❤️</span>} 
        rightIconName="arrow-forward" 
      />
    );
    
    expect(screen.getByText('With Icon')).toBeTruthy();
  });

  it('respects disabled state', () => {
    const mockOnPress = jest.fn();
    renderWithProvider(
      <Button 
        title="Disabled" 
        disabled={true} 
        onPress={mockOnPress} 
      />
    );
    
    const button = screen.getByText('Disabled');
    fireEvent.press(button);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    renderWithProvider(<Button title="Loading" loading={true} />);
    
    // Should show loading indicator
    expect(screen.getByTestId('button-loading')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithProvider(
      <Button 
        title="Custom Style" 
        style={customStyle} 
      />
    );
    
    expect(screen.getByText('Custom Style')).toBeTruthy();
  });

  it('renders as full width when specified', () => {
    renderWithProvider(<Button title="Full Width" fullWidth={true} />);
    
    expect(screen.getByText('Full Width')).toBeTruthy();
  });

  it('renders text variant correctly', () => {
    renderWithProvider(<Button title="Text Button" variant="text" />);
    
    expect(screen.getByText('Text Button')).toBeTruthy();
  });
}); 