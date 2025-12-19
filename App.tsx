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

export default App;
