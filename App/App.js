import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TodayScreen from './screens/TodayScreen';
import InboxScreen from './screens/InboxScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import NextActionsScreen from './screens/NextActionsScreen';
import { TaskProvider } from './context/TaskContext';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        {/* <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" /> */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#fefefe',
              height: 125,
              borderTopWidth: 0.5,
              borderTopColor: '#ccc',
              paddingBottom: 8,
              paddingTop: 12,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
           tabBarIcon: ({ color, size, focused }) => {
             let iconName;
           
             if (route.name === 'Today') iconName = focused ? 'calendar' : 'calendar-outline';
             else if (route.name === 'Inbox') iconName = focused ? 'mail' : 'mail-outline';
             else if (route.name === 'Projects') iconName = focused ? 'briefcase' : 'briefcase-outline';
             else if (route.name === 'Next Actions') iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
           
             return(
              // <Ionicons name={iconName} size={24} color={color} />;
              <View style={[styles.tabIconContainer, focused && styles.activeTabIconContainer]}>
                <Ionicons name={iconName} size={24} color={color} />
              </View>
             )
           },
          })}
        >
          <Tab.Screen name="Today" component={TodayScreen} />
          <Tab.Screen name="Inbox" component={InboxScreen} />
          <Tab.Screen name="Projects" component={ProjectsScreen} />
          <Tab.Screen name="Next Actions" component={NextActionsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}


const styles = StyleSheet.create({
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  marginBottom: 8
    
   
  },
  activeTabIconContainer: {
    backgroundColor: '#e0f7fa', 
    borderRadius: 20,
   
   
  },
})