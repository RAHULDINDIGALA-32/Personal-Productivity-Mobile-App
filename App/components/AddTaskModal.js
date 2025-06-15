import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, StatusBar} from 'react-native';;
import { useTasks } from '../context/TaskContext';

const AddTaskModal = ({ visible, onClose }) => {
  const [taskText, setTaskText] = useState('');
  const { addTask } = useTasks();

  const handleAdd = () => {
    if (taskText.trim()) {
      addTask(taskText.trim());
      setTaskText('');
      onClose();
    }
  };

  return (
   <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose} >
   {/* <StatusBar translucent={true}  backgroundColor={'#00000088'}/> */}
    <TouchableOpacity  style={{ flex: 1 }} onPress={() => onClose()}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task..."
            value={taskText}
            onChangeText={setTaskText}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
     </TouchableOpacity>  
   </Modal>
  );
};

export default AddTaskModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    marginRight: 12,
  },
  cancelText: {
    color: '#888',
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
