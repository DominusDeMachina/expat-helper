import { Column, Container, Row } from '../Layout';
import { render, screen } from '@testing-library/react-native';

import React from 'react';
import { Text } from 'react-native';

describe('Layout Components', () => {
  describe('Container', () => {
    it('renders correctly with default props', () => {
      render(
        <Container testID="test-container">
          <Text>Container Content</Text>
        </Container>
      );
      
      expect(screen.getByTestId('test-container')).toBeTruthy();
      expect(screen.getByText('Container Content')).toBeTruthy();
    });

    it('applies fluid width when specified', () => {
      render(
        <Container fluid testID="fluid-container">
          <Text>Fluid Container</Text>
        </Container>
      );
      
      expect(screen.getByTestId('fluid-container')).toBeTruthy();
    });

    it('applies custom padding', () => {
      render(
        <Container padding={20} testID="padded-container">
          <Text>Padded Container</Text>
        </Container>
      );
      
      expect(screen.getByTestId('padded-container')).toBeTruthy();
    });

    it('applies center alignment', () => {
      render(
        <Container 
          center={true}
          testID="centered-container"
        >
          <Text>Centered Container</Text>
        </Container>
      );
      
      expect(screen.getByTestId('centered-container')).toBeTruthy();
    });

    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      render(
        <Container style={customStyle} testID="styled-container">
          <Text>Styled Container</Text>
        </Container>
      );
      
      expect(screen.getByTestId('styled-container')).toBeTruthy();
    });
  });

  describe('Row', () => {
    it('renders correctly with default props', () => {
      render(
        <Row testID="test-row">
          <Text>Row Content</Text>
        </Row>
      );
      
      expect(screen.getByTestId('test-row')).toBeTruthy();
      expect(screen.getByText('Row Content')).toBeTruthy();
    });

    it('applies different justify content values', () => {
      const justifyValues = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const;
      
      justifyValues.forEach((justify) => {
        render(
          <Row justify={justify} testID={`row-${justify}`}>
            <Text>{justify} row</Text>
          </Row>
        );
        expect(screen.getByTestId(`row-${justify}`)).toBeTruthy();
      });
    });

    it('applies different align items values', () => {
      const alignValues = ['flex-start', 'center', 'flex-end', 'stretch'] as const;
      
      alignValues.forEach((align) => {
        render(
          <Row align={align} testID={`row-align-${align}`}>
            <Text>{align} aligned row</Text>
          </Row>
        );
        expect(screen.getByTestId(`row-align-${align}`)).toBeTruthy();
      });
    });

    it('disables gutters when specified', () => {
      render(
        <Row noGutters={true} testID="no-gutters-row">
          <Text>No Gutters Row</Text>
        </Row>
      );
      
      expect(screen.getByTestId('no-gutters-row')).toBeTruthy();
    });

    it('applies custom justify content', () => {
      render(
        <Row justify="space-evenly" testID="justified-row">
          <Text>Justified Row</Text>
        </Row>
      );
      
      expect(screen.getByTestId('justified-row')).toBeTruthy();
    });

    it('enables wrapping when specified', () => {
      render(
        <Row wrap testID="wrapped-row">
          <Text>Item 1</Text>
          <Text>Item 2</Text>
          <Text>Item 3</Text>
        </Row>
      );
      
      expect(screen.getByTestId('wrapped-row')).toBeTruthy();
    });
  });

  describe('Column', () => {
    it('renders correctly with default props', () => {
      render(
        <Column testID="test-column">
          <Text>Column Content</Text>
        </Column>
      );
      
      expect(screen.getByTestId('test-column')).toBeTruthy();
      expect(screen.getByText('Column Content')).toBeTruthy();
    });

    it('applies different justify content values', () => {
      const justifyValues = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const;
      
      justifyValues.forEach((justify) => {
        render(
          <Column justify={justify} testID={`column-${justify}`}>
            <Text>{justify} column</Text>
          </Column>
        );
        expect(screen.getByTestId(`column-${justify}`)).toBeTruthy();
      });
    });

    it('applies different align items values', () => {
      const alignValues = ['flex-start', 'center', 'flex-end', 'stretch'] as const;
      
      alignValues.forEach((align) => {
        render(
          <Column align={align} testID={`column-align-${align}`}>
            <Text>{align} aligned column</Text>
          </Column>
        );
        expect(screen.getByTestId(`column-align-${align}`)).toBeTruthy();
      });
    });

    it('applies gap spacing', () => {
      render(
        <Column gap={16} testID="gapped-column">
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </Column>
      );
      
      expect(screen.getByTestId('gapped-column')).toBeTruthy();
    });

    it('applies responsive gap', () => {
      render(
        <Column gap={{ base: 8, md: 16, lg: 24 }} testID="responsive-column">
          <Text>Responsive Column</Text>
        </Column>
      );
      
      expect(screen.getByTestId('responsive-column')).toBeTruthy();
    });

    it('handles flex properties', () => {
      render(
        <Column flex={1} testID="flex-column">
          <Text>Flex Column</Text>
        </Column>
      );
      
      expect(screen.getByTestId('flex-column')).toBeTruthy();
    });

    it('applies custom styles to all components', () => {
      const customStyle = { backgroundColor: 'blue' };
      
      render(
        <Container style={customStyle} testID="styled-container">
          <Row style={customStyle} testID="styled-row">
            <Column style={customStyle} testID="styled-column">
              <Text>Styled Layout</Text>
            </Column>
          </Row>
        </Container>
      );
      
      expect(screen.getByTestId('styled-container')).toBeTruthy();
      expect(screen.getByTestId('styled-row')).toBeTruthy();
      expect(screen.getByTestId('styled-column')).toBeTruthy();
    });
  });
}); 