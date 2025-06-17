import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTaskContext } from '../context/TaskContext';
import Toast from 'react-native-toast-message';

const TaskItem = ({ task, onPress }) => {
  const { dispatch, toggleComplete, undoComplete } = useTaskContext();

  const handleComplete = () => {
    toggleComplete(task.id);
    Toast.show({
      type: 'success',
      text1: 'Task Completed',
      text2: task.title,
      position: 'bottom',
      autoHide: true,
      visibilityTime: 3000,
      bottomOffset: 250,
      onPress: () => {
        dispatch({ type: 'UNDO_COMPLETE_TASK', payload: task.id });
        undoComplete(task.id);
        Toast.hide();
      },
    });
  };

  return (
    <TouchableOpacity style={styles.task} onLongPress={() => handleComplete()} onPress={onPress}>
      <View style={[styles.indicator, { backgroundColor: task.color || '#007bff' }]} />
      <View>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.sub}>{task.duration} hrs • Priority {task.priority}</Text>
      </View>
    </TouchableOpacity>
  );
};


export default TaskItem;


const styles = StyleSheet.create({
  task: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 12,
    alignItems: 'center',
  },
  indicator: {
    width: 10,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sub: {
    color: '#777',
    marginTop: 4,
  },
});


