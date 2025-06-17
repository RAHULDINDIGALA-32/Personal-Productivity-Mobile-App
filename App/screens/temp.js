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
import { useTaskContext } from '../context/TaskContext';

const TaskDetailModal = ({ visible, task, onClose, moveTo }) => {
  const { updateTask } = useTaskContext();
  const [editableTask, setEditableTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (task) setEditableTask({ ...task });
  }, [task]);

  if (!editableTask) return null;

  const handleSave = () => {
    updateTask(editableTask);
    onClose();
  };

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
                  <Text>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => moveTo(editableTask.id, 'project')}
              style={styles.actionBtn}
            >
              <Text>Move to Project</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => moveTo(editableTask.id, 'next')}
              style={styles.actionBtn}
            >
              <Text>Move to Next Action</Text>
            </TouchableOpacity>
          </View>

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
    minHeight: '45%',
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
  buttons: {
    marginTop: 20,
    gap: 12,
  },
  actionBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  saveBtn: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  closeBtn: {
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
});
