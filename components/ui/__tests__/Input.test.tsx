import { fireEvent, render, screen } from '@testing-library/react-native';

import { Input } from '../Input';
import { PaperProvider } from 'react-native-paper';
import React from 'react';

// Test wrapper with PaperProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider>{children}</PaperProvider>
);

const renderWithProvider = (component: React.ReactElement) => 
  render(component, { wrapper: TestWrapper });

describe('Input Component', () => {
  it('renders correctly with basic props', () => {
    renderWithProvider(<Input placeholder="Test Input" />);
    expect(screen.getByPlaceholderText('Test Input')).toBeTruthy();
  });

  it('renders with label', () => {
    renderWithProvider(<Input label="Test Label" placeholder="Test Input" />);
    expect(screen.getByText('Test Label')).toBeTruthy();
  });

  it('handles text input', () => {
    const mockOnChange = jest.fn();
    renderWithProvider(
      <Input 
        placeholder="Test Input" 
        onChangeText={mockOnChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Test Input');
    fireEvent.changeText(input, 'Hello World');
    
    expect(mockOnChange).toHaveBeenCalledWith('Hello World');
  });

  it('shows error state', () => {
    renderWithProvider(
      <Input 
        placeholder="Test Input" 
        errorMessage="This field is required"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('respects disabled state', () => {
    renderWithProvider(
      <Input 
        placeholder="Test Input" 
        disabled={true}
      />
    );
    
    const input = screen.getByPlaceholderText('Test Input');
    expect(input.props.editable).toBe(false);
  });

  it('renders with different variants', () => {
    const { rerender } = renderWithProvider(
      <Input placeholder="Outlined" variant="outlined" />
    );
    expect(screen.getByPlaceholderText('Outlined')).toBeTruthy();

    rerender(
      <TestWrapper>
        <Input placeholder="Filled" variant="filled" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Filled')).toBeTruthy();
  });

  it('handles secure text entry', () => {
    renderWithProvider(
      <Input 
        placeholder="Password" 
        type="password"
      />
    );
    
    const input = screen.getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders with helper text', () => {
    renderWithProvider(
      <Input 
        placeholder="Test Input" 
        helperText="This is helper text"
      />
    );
    
    expect(screen.getByText('This is helper text')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    renderWithProvider(
      <Input 
        placeholder="Custom Style" 
        style={customStyle}
      />
    );
    
    expect(screen.getByPlaceholderText('Custom Style')).toBeTruthy();
  });

  it('handles multiline input', () => {
    renderWithProvider(
      <Input 
        placeholder="Multiline Input" 
        multiline={true}
        numberOfLines={4}
      />
    );
    
    const input = screen.getByPlaceholderText('Multiline Input');
    expect(input.props.multiline).toBe(true);
  });
}); 