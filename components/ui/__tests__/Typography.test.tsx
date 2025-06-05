import { render, screen } from '@testing-library/react-native';

import { PaperProvider } from 'react-native-paper';
import React from 'react';
import { Typography } from '../Typography';

// Test wrapper with PaperProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider>{children}</PaperProvider>
);

const renderWithProvider = (component: React.ReactElement) => 
  render(component, { wrapper: TestWrapper });

describe('Typography Component', () => {
  it('renders correctly with default props', () => {
    renderWithProvider(<Typography>Test Text</Typography>);
    expect(screen.getByText('Test Text')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'body1', 'body2', 'caption', 'overline',
      'subtitle1', 'subtitle2',
      'button', 'link'
    ] as const;

    variants.forEach((variant) => {
      renderWithProvider(
        <Typography variant={variant}>Test {variant}</Typography>
      );
      expect(screen.getByText(`Test ${variant}`)).toBeTruthy();
    });
  });

  it('applies custom styling', () => {
    const customStyle = { marginTop: 20 };
    renderWithProvider(
      <Typography style={customStyle}>Styled Text</Typography>
    );
    
    expect(screen.getByText('Styled Text')).toBeTruthy();
  });

  it('handles different text colors', () => {
    renderWithProvider(
      <Typography lightColor="#ff0000" darkColor="#00ff00">
        Colored Text
      </Typography>
    );
    
    expect(screen.getByText('Colored Text')).toBeTruthy();
  });

  it('renders as different elements based on variant', () => {
    // Heading variants should render as headings
    renderWithProvider(
      <Typography variant="h1">Heading 1</Typography>
    );
    expect(screen.getByText('Heading 1')).toBeTruthy();

    // Body variants should render as paragraphs  
    renderWithProvider(
      <Typography variant="body1">Body Text</Typography>
    );
    expect(screen.getByText('Body Text')).toBeTruthy();
  });

  it('supports custom testID', () => {
    renderWithProvider(
      <Typography testID="custom-typography">Test ID Text</Typography>
    );
    
    expect(screen.getByTestId('custom-typography')).toBeTruthy();
  });

  it('handles bold text', () => {
    renderWithProvider(
      <Typography weight="bold">Bold Text</Typography>
    );
    
    expect(screen.getByText('Bold Text')).toBeTruthy();
  });

  it('handles text alignment', () => {
    const alignments = ['left', 'center', 'right'] as const;
    
    alignments.forEach(align => {
      renderWithProvider(
        <Typography align={align}>{align} aligned text</Typography>
      );
      expect(screen.getByText(`${align} aligned text`)).toBeTruthy();
    });
  });

  it('handles custom props', () => {
    renderWithProvider(
      <Typography numberOfLines={2} ellipsizeMode="tail">
        This is a long text that should be truncated
      </Typography>
    );
    
    expect(screen.getByText('This is a long text that should be truncated')).toBeTruthy();
  });
}); 