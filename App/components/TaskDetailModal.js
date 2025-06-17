import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useTaskContext } from '../context/TaskContext';

const TaskDetailModal = ({ visible, task, onClose, moveTo }) => {
  const { state, updateTask, addProject, addContext } = useTaskContext();
  const [editableTask, setEditableTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // For project/context selection
  const [selectedProject, setSelectedProject] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedContext, setSelectedContext] = useState('');
  const [newContextName, setNewContextName] = useState('');

  useEffect(() => {
    if (task) {
      setEditableTask({ ...task });
      setSelectedProject(task.projectId || '');
      setSelectedContext(task.context || '');
      setNewProjectName('');
      setNewContextName('');
    }
  }, [task]);

  if (!editableTask) return null;

  const handleSave = () => {
    updateTask(editableTask);
    onClose();
  };

  const handleMoveToProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      // Wait for state to update, then find the new project by name
      setTimeout(() => {
        const newProj = state.projects.find(p => p.name === newProjectName.trim());
        if (newProj) {
          moveTo(editableTask.id, 'project', { projectId: newProj.id });
          setSelectedProject(newProj.id);
        }
        setNewProjectName('');
      }, 100); // small delay to allow state update
    } else if (selectedProject) {
      moveTo(editableTask.id, 'project', { projectId: selectedProject });
      setSelectedProject(selectedProject);
      setNewProjectName('');
    }
  };

  const handleMoveToNext = () => {
    const contextToAssign = newContextName.trim() || selectedContext;
    if (contextToAssign) {
      if (newContextName.trim()) addContext(newContextName.trim());
      moveTo(editableTask.id, 'next', { context: contextToAssign });
      setSelectedContext(contextToAssign);
      setNewContextName('');
    }
  };

  // Ensure projects/contexts are string arrays
  const projectList = Array.isArray(state.projects)
    ? state.projects
    : [];
  const contextList = Array.isArray(state.contexts)
    ? state.contexts.map(c => (typeof c === 'string' ? c : c.name || ''))
    : [];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TextInput
            style={styles.titleInput}
            value={editableTask.title}
            onChangeText={(text) =>
              setEditableTask({ ...editableTask, title: text })
            }
          />

          <TouchableOpacity
            style={styles.row}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>📅 Due: {new Date(editableTask.dueDate).toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(editableTask.dueDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(e, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setEditableTask({ ...editableTask, dueDate: selectedDate });
                }
              }}
            />
          )}

          <View style={styles.prioritySection}>
            <Text>⭐ Priority:</Text>
            <View style={styles.priorityRow}>
              {[1, 2, 3, 4, 5].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityCircle,
                    p === editableTask.priority && styles.selectedPriority,
                  ]}
                  onPress={() => setEditableTask({ ...editableTask, priority: p })}
                >
                  <Text style={p === editableTask.priority ? { color: '#fff' } : {}}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Project Selection */}
          <Text style={styles.label}>Project</Text>
          <Picker
            selectedValue={selectedProject}
            onValueChange={(itemValue) => setSelectedProject(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Project" value="" />
            {projectList.map((project) => (
              <Picker.Item key={project.id} label={project.name} value={project.id} />
            ))}
          </Picker>
          <TextInput
            placeholder="Or add new project"
            value={newProjectName}
            onChangeText={setNewProjectName}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleMoveToProject} style={styles.actionBtn}>
            <Text>
              Move to Project
              {selectedProject
                ? `: ${projectList.find(p => p.id === selectedProject)?.name || selectedProject}`
                : newProjectName
                ? `: ${newProjectName}`
                : ''}
            </Text>
          </TouchableOpacity>
          {editableTask.projectId ? (
            <Text style={styles.currentSelection}>
              Current Project: {state.projects.find(p => p.id === editableTask.projectId)?.name || editableTask.projectId}
            </Text>
          ) : null}

          {/* Context Selection */}
          <Text style={[styles.label, { marginTop: 16 }]}>Next Action Context</Text>
          <Picker
            selectedValue={selectedContext}
            onValueChange={(itemValue) => setSelectedContext(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Context" value="" />
            {contextList.map((ctx, idx) => (
              <Picker.Item key={idx} label={ctx} value={ctx} />
            ))}
          </Picker>
          <TextInput
            placeholder="Or add new context"
            value={newContextName}
            onChangeText={setNewContextName}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleMoveToNext} style={styles.actionBtn}>
            <Text>
              Move to Next Action
              {selectedContext ? `: ${selectedContext}` : newContextName ? `: ${newContextName}` : ''}
            </Text>
          </TouchableOpacity>
          {editableTask.context ? (
            <Text style={styles.currentSelection}>
              Current Context: {editableTask.context}
            </Text>
          ) : null}

          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={{ color: '#fff' }}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: '55%',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  row: {
    paddingVertical: 10,
  },
  prioritySection: {
    marginTop: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  priorityCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPriority: {
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
  },
  picker: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  actionBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  currentSelection: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  closeBtn: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
});
