import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Modal, TouchableOpacity,
  StyleSheet, Keyboard, TouchableWithoutFeedback, Button
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskContext } from '../context/TaskContext';
import uuid from 'react-native-uuid';

const AddTaskModal = ({ visible, onClose }) => {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  const handleAdd = () => {
    if (!title.trim()) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: uuid.v4(),
        title,
        duration,
        dueDate: dueDate.toISOString(),
        priority,
        category: 'inbox',
        completed: false,
        trashed: false,
        createdAt: new Date().toISOString(),
      },
    });

    onClose();
    setTitle('');
    setDuration('');
    setPriority(3);
    setDueDate(new Date());
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.header}>Add Task</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Task title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (e.g. 1.5)"
              keyboardType="decimal-pad"
              value={duration}
              onChangeText={setDuration}
            />

            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={styles.label}>Due Date: {dueDate.toDateString()}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                onChange={(e, date) => {
                  setShowPicker(false);
                  if (date) setDueDate(date);
                }}
              />
            )}

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {[1, 2, 3, 4, 5].map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[styles.priorityDot, p === priority && styles.selectedDot]}
                >
                  <Text>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actions}>
              <Button title="Cancel" onPress={onClose} />
              <Button title="Add" onPress={handleAdd} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modal: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6 },
  label: { fontWeight: '600', marginBottom: 6 },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  priorityDot: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: '#999',
    justifyContent: 'center', alignItems: 'center'
  },
  selectedDot: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default AddTaskModal;
