/**
 * Amrut-Dhara B2B App
 * Water Bottle Ordering System
 */

import React, {Component, ErrorInfo, ReactNode} from 'react';
import {StatusBar, useColorScheme, View, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {AuthProvider} from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';

// Error Boundary Component
class ErrorBoundary extends Component<
  {children: ReactNode},
  {hasError: boolean; error: Error | null}
> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
            Something went wrong
          </Text>
          <Text style={{textAlign: 'center', color: '#666'}}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppNavigator />
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
