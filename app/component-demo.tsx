import {
    BodyText,
    Button,
    Caption,
    Column,
    Container,
    DotsLoader,
    Heading1,
    Heading2,
    Heading3,
    Input,
    LoadingIndicator,
    ProgressLoader,
    PulseLoader,
    Row,
    SkeletonLoader,
    SmallText,
    SpinnerLoader,
    Typography,
} from '@/components/ui';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function ComponentDemo() {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(45);
  
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  const handleButtonPress = (variant: string) => {
    Alert.alert('Button Pressed', `You pressed the ${variant} button!`);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Component Demo' }} />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <Container>
          
          {/* Header */}
          <View style={[styles.section, { borderBottomColor: borderColor }]}>
            <Heading1>UI Components</Heading1>
            <BodyText color="muted">
              Comprehensive showcase of all core components with their variants and features.
            </BodyText>
          </View>

          {/* Typography Section */}
          <View style={[styles.section, { borderBottomColor: borderColor }]}>
            <Heading2>Typography</Heading2>
            <Row>
              <Column responsive={{ xs: 12, md: 6 }}>
                <View style={styles.demoCard}>
                  <Heading3>Headings</Heading3>
                  <Heading1>Heading 1</Heading1>
                  <Heading2>Heading 2</Heading2>
                  <Heading3>Heading 3</Heading3>
                  <Typography variant="h4">Heading 4</Typography>
                  <Typography variant="h5">Heading 5</Typography>
                  <Typography variant="h6">Heading 6</Typography>
                </View>
              </Column>
              <Column responsive={{ xs: 12, md: 6 }}>
                <View style={styles.demoCard}>
                  <Heading3>Body Text</Heading3>
                  <BodyText>Body 1 - Default body text for main content.</BodyText>
                  <SmallText>Body 2 - Smaller text for secondary content.</SmallText>
                  <Caption>Caption - Very small text for captions and metadata.</Caption>
                  <Typography variant="overline">OVERLINE TEXT</Typography>
                  <Typography variant="link" color="primary">Link text</Typography>
                </View>
              </Column>
            </Row>
            
            <View style={styles.demoCard}>
              <Heading3>Text Styling</Heading3>
              <Row>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Typography weight="light">Light weight</Typography>
                  <Typography weight="normal">Normal weight</Typography>
                  <Typography weight="medium">Medium weight</Typography>
                  <Typography weight="semibold">Semibold weight</Typography>
                  <Typography weight="bold">Bold weight</Typography>
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Typography align="left">Left aligned</Typography>
                  <Typography align="center">Center aligned</Typography>
                  <Typography align="right">Right aligned</Typography>
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Typography italic>Italic text</Typography>
                  <Typography underline>Underlined text</Typography>
                  <Typography uppercase>uppercase text</Typography>
                  <Typography capitalize>capitalized text</Typography>
                </Column>
              </Row>
            </View>
          </View>

          {/* Button Section */}
          <View style={[styles.section, { borderBottomColor: borderColor }]}>
            <Heading2>Buttons</Heading2>
            
            <View style={styles.demoCard}>
              <Heading3>Button Variants</Heading3>
              <Row>
                <Column responsive={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    title="Primary"
                    variant="primary"
                    onPress={() => handleButtonPress('primary')}
                    style={styles.buttonSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    title="Secondary"
                    variant="secondary"
                    onPress={() => handleButtonPress('secondary')}
                    style={styles.buttonSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    title="Text"
                    variant="text"
                    onPress={() => handleButtonPress('text')}
                    style={styles.buttonSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    title="Destructive"
                    variant="destructive"
                    onPress={() => handleButtonPress('destructive')}
                    style={styles.buttonSpacing}
                  />
                </Column>
              </Row>
            </View>

            <View style={styles.demoCard}>
              <Heading3>Button Sizes</Heading3>
              <Row>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Button
                    title="Small"
                    size="sm"
                    onPress={() => handleButtonPress('small')}
                    style={styles.buttonSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Button
                    title="Medium"
                    size="md"
                    onPress={() => handleButtonPress('medium')}
                    style={styles.buttonSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Button
                    title="Large"
                    size="lg"
                    onPress={() => handleButtonPress('large')}
                    style={styles.buttonSpacing}
                  />
                </Column>
              </Row>
            </View>

            <View style={styles.demoCard}>
              <Heading3>Button States & Features</Heading3>
              <Row>
                <Column responsive={{ xs: 12, md: 6 }}>
                  <Button
                    title="With Left Icon"
                    leftIcon={<Ionicons name="heart" size={16} color="white" />}
                    onPress={() => handleButtonPress('with icon')}
                    style={styles.buttonSpacing}
                  />
                  <Button
                    title="With Right Icon"
                    rightIcon={<Ionicons name="arrow-forward" size={16} color="white" />}
                    onPress={() => handleButtonPress('with right icon')}
                    style={styles.buttonSpacing}
                  />
                  <Button
                    title="Loading"
                    loading={loading}
                    onPress={simulateLoading}
                    style={styles.buttonSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, md: 6 }}>
                  <Button
                    title="Disabled"
                    disabled
                    onPress={() => handleButtonPress('disabled')}
                    style={styles.buttonSpacing}
                  />
                  <Button
                    title="Full Width"
                    fullWidth
                    onPress={() => handleButtonPress('full width')}
                    style={styles.buttonSpacing}
                  />
                </Column>
              </Row>
            </View>
          </View>

          {/* Input Section */}
          <View style={[styles.section, { borderBottomColor: borderColor }]}>
            <Heading2>Inputs</Heading2>
            
            <View style={styles.demoCard}>
              <Heading3>Input Variants</Heading3>
              <Row>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Input
                    label="Default Input"
                    placeholder="Enter text..."
                    variant="default"
                    value={inputValue}
                    onChangeText={setInputValue}
                    containerStyle={styles.inputSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Input
                    label="Outlined Input"
                    placeholder="Enter text..."
                    variant="outlined"
                    containerStyle={styles.inputSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <Input
                    label="Filled Input"
                    placeholder="Enter text..."
                    variant="filled"
                    containerStyle={styles.inputSpacing}
                  />
                </Column>
              </Row>
            </View>

            <View style={styles.demoCard}>
              <Heading3>Input States & Features</Heading3>
              <Row>
                <Column responsive={{ xs: 12, md: 6 }}>
                  <Input
                    label="Required Input"
                    placeholder="This field is required"
                    required
                    helperText="This field is required"
                    containerStyle={styles.inputSpacing}
                  />
                  <Input
                    label="Error State"
                    placeholder="Invalid input"
                    state="error"
                    errorMessage="This field has an error"
                    containerStyle={styles.inputSpacing}
                  />
                  <Input
                    label="With Left Icon"
                    placeholder="Search..."
                    leftIcon={<Ionicons name="search" size={16} color="gray" />}
                    containerStyle={styles.inputSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, md: 6 }}>
                  <Input
                    label="Password Input"
                    placeholder="Enter password"
                    secureTextEntry
                    showPasswordToggle
                    value={passwordValue}
                    onChangeText={setPasswordValue}
                    containerStyle={styles.inputSpacing}
                  />
                  <Input
                    label="Disabled Input"
                    placeholder="Cannot edit"
                    state="disabled"
                    containerStyle={styles.inputSpacing}
                  />
                  <Input
                    label="Number Input"
                    placeholder="Enter number"
                    keyboardType="numeric"
                    rightIcon={<Ionicons name="calculator" size={16} color="gray" />}
                    containerStyle={styles.inputSpacing}
                  />
                </Column>
              </Row>
            </View>
          </View>

          {/* Loading Indicators Section */}
          <View style={[styles.section, { borderBottomColor: borderColor }]}>
            <Heading2>Loading Indicators</Heading2>
            
            <View style={styles.demoCard}>
              <Heading3>Loading Variants</Heading3>
              <Row>
                <Column responsive={{ xs: 12, sm: 6, lg: 2 }}>
                  <View style={styles.loaderContainer}>
                    <SpinnerLoader size="md" />
                    <Caption align="center" style={styles.loaderLabel}>Spinner</Caption>
                  </View>
                </Column>
                <Column responsive={{ xs: 12, sm: 6, lg: 2 }}>
                  <View style={styles.loaderContainer}>
                    <SkeletonLoader size="md" />
                    <Caption align="center" style={styles.loaderLabel}>Skeleton</Caption>
                  </View>
                </Column>
                <Column responsive={{ xs: 12, sm: 6, lg: 2 }}>
                  <View style={styles.loaderContainer}>
                    <ProgressLoader size="md" progress={progress} />
                    <Caption align="center" style={styles.loaderLabel}>Progress</Caption>
                  </View>
                </Column>
                <Column responsive={{ xs: 12, sm: 6, lg: 3 }}>
                  <View style={styles.loaderContainer}>
                    <DotsLoader size="md" />
                    <Caption align="center" style={styles.loaderLabel}>Dots</Caption>
                  </View>
                </Column>
                <Column responsive={{ xs: 12, sm: 6, lg: 3 }}>
                  <View style={styles.loaderContainer}>
                    <PulseLoader size="md" />
                    <Caption align="center" style={styles.loaderLabel}>Pulse</Caption>
                  </View>
                </Column>
              </Row>
            </View>

            <View style={styles.demoCard}>
              <Heading3>Loading Sizes</Heading3>
              <Row>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <View style={styles.loaderContainer}>
                    <LoadingIndicator variant="spinner" size="sm" />
                    <Caption align="center" style={styles.loaderLabel}>Small</Caption>
                  </View>
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <View style={styles.loaderContainer}>
                    <LoadingIndicator variant="spinner" size="md" />
                    <Caption align="center" style={styles.loaderLabel}>Medium</Caption>
                  </View>
                </Column>
                <Column responsive={{ xs: 12, md: 4 }}>
                  <View style={styles.loaderContainer}>
                    <LoadingIndicator variant="spinner" size="lg" />
                    <Caption align="center" style={styles.loaderLabel}>Large</Caption>
                  </View>
                </Column>
              </Row>
            </View>

            <View style={styles.demoCard}>
              <Heading3>Loading with Text</Heading3>
              <LoadingIndicator
                variant="dots"
                size="md"
                text="Loading your data..."
              />
            </View>
          </View>

          {/* Progress Demo */}
          <View style={styles.section}>
            <Heading2>Interactive Demo</Heading2>
            <View style={styles.demoCard}>
              <Row>
                <Column responsive={{ xs: 12, md: 6 }}>
                  <Button
                    title="Increase Progress"
                    onPress={() => setProgress(Math.min(100, progress + 10))}
                    style={styles.buttonSpacing}
                  />
                  <Button
                    title="Decrease Progress"
                    variant="secondary"
                    onPress={() => setProgress(Math.max(0, progress - 10))}
                    style={styles.buttonSpacing}
                  />
                </Column>
                <Column responsive={{ xs: 12, md: 6 }}>
                  <BodyText>Current Progress: {progress}%</BodyText>
                  <ProgressLoader progress={progress} size="lg" />
                </Column>
              </Row>
            </View>
          </View>

        </Container>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  demoCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  buttonSpacing: {
    marginBottom: 12,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  loaderContainer: {
    alignItems: 'center',
    padding: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  loaderLabel: {
    marginTop: 8,
  },
}); 