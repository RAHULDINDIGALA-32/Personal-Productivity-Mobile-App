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
import { useTaskContext } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';
import FAB from '../components/FAB';
import AddTaskModal from '../components/AddTaskModal';



const ProjectScreen = () => {
  const { state, addProject } = useTaskContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const navigation = useNavigation();

  const handleAddProject = () => {
    if (projectName.trim()) {
      addProject(projectName.trim());
      setProjectName('');
      setModalVisible(false);
    }
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() =>
        navigation.navigate('ProjectDetail', {
          projectId: item.id,
          projectName: item.name,
        })
      }
    >
      <Text style={styles.projectText}># {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Projects</Text>

      <FlatList
        data={state.projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        ListEmptyComponent={<Text style={styles.emptyText}>No projects created yet.</Text>}
      />

      <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Project</Text>
            <TextInput
              placeholder="Enter project name"
              value={projectName}
              onChangeText={setProjectName}
              style={styles.input}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddProject}>
              <Text style={styles.addText}>Add Project</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FAB onPress={() => setTaskModalVisible(true)} />

      <AddTaskModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
      />

    </View>
  );
};

export default ProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 35,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  projectItem: {
    padding: 14,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  projectText: {
    fontSize: 16,
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
    marginBottom: 16,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
