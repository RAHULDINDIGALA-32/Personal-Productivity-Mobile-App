import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TodayScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>projects Screen</Text>
    </View>
  );
};

export default TodayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
