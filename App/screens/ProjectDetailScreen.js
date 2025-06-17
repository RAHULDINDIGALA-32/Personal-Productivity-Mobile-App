import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import FAB from '../components/FAB';
import AddTaskModal from '../components/AddTaskModal';

const ProjectDetailScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { projectId, projectName } = params;
  const { state,  toggleComplete } = useTaskContext();
  const [taskModalVisible, setTaskModalVisible] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: projectName || 'Project Details',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'semi-bold',
        marginLeft: 10,
      },
    });

  }, [navigation, projectName]);

  const tasks = state.tasks.filter((task) => task.projectId === projectId && !task.completed);
  const projectTasks = state.tasks.filter(
    task => task.projectId === projectId && !task.completed && !task.trashed
  );
  
  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => toggleComplete(item.id)}
    >
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.taskDescription}>{item.description}</Text>
        ) : null}
        <Text style={styles.taskDate}>📅 {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
     
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet.</Text>}
      />


      <FAB onPress={() => setTaskModalVisible(true)} />

      <AddTaskModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
      />

    </View>
  );
};

export default ProjectDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 35,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  taskItem: {
    padding: 14,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  taskDate: {
    fontSize: 13,
    color: 'green',
    marginTop: 6,
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
  },
  plusButton: {
    position: 'absolute',
    top: 22,
    right: 22,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
  },
});
