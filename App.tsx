/**
 * Amrut-Dhara B2B App
 * Water Bottle Ordering System
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {AuthProvider} from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import CodePush from 'react-native-code-push';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// CodePush configuration
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 60, // Wait 60 seconds after app goes to background
};

export default CodePush(codePushOptions)(App);
