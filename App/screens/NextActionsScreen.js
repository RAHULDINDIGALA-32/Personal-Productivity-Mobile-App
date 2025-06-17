// screens/NextActionsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet, 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';

const NextActionsScreen = () => {
  const { state, toggleComplete } = useTaskContext();
  const [selectedContext, setSelectedContext] = useState('');
  const [selectedProject, setSelectedProject] = useState('');


  const filteredTasks = state.tasks.filter(task =>
    !task.completed &&
    task.category === 'nextActions' &&
    (selectedContext ? task.context === selectedContext : true)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Next Actions</Text>

      {/* Filter by Context */}
      <Text style={styles.filterLabel}>Filter by Context:</Text>
      <Picker
        selectedValue={selectedContext}
        onValueChange={(value) => setSelectedContext(value)}
        style={styles.picker}
      >
        <Picker.Item label="All Contexts" value="" />
        {state.contexts.map((context, idx) => (
          <Picker.Item key={idx} label={context} value={context} />
        ))}
      </Picker>

      {/* Filter by Project */}
      <Text style={styles.filterLabel}>Filter by Project:</Text>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(value) => setSelectedProject(value)}
        style={styles.picker}
      >
        <Picker.Item label="All Projects" value="" />
        {state.projects.map((project) => (
          <Picker.Item key={project.id} label={project.name} value={project.id} />
        ))}
      </Picker>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => toggleComplete(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
      />
    </View>
  );
};

export default NextActionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 35,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  picker: {
    backgroundColor: '#f1f1f1',
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
