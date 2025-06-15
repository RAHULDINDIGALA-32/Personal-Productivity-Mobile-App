import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskItem = ({ task }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{task.title}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    padding: 15, marginVertical: 5,
    backgroundColor: '#F0F0F0', borderRadius: 6,
  },
  title: { fontSize: 16 },
});

export default TaskItem;
