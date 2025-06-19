import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { TaskProvider } from './context/TaskContext';
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from './screens/SplashScreen';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }
  return (
    <TaskProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#f6f8fa" translucent />
        <AppNavigator />
      </NavigationContainer>
    </TaskProvider>
  );
}
