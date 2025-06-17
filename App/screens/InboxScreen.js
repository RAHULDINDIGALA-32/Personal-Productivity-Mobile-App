import React, { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { isAfter } from 'date-fns';
import { useTaskContext } from '../context/TaskContext';
import { groupTasksByDate } from '../utils/groupTasks';
import TaskItem from '../components/TaskItem';
import FAB from '../components/FAB';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

const InboxScreen = () => {
  const { state, moveTaskToCategory } = useTaskContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleMoveTo = (id, category) => {
    moveTaskToCategory(id, category);
    setDetailModalVisible(false);
    setSelectedTask(null);
  };

  const filtered = state.tasks.filter(
    task =>
      !task.completed &&
      !task.trashed &&
      isAfter(new Date(task.dueDate), new Date(2020, 0, 1))
  );

  const grouped = groupTasksByDate(
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  );

  const handleOnPressItem= (item)  => {
      setSelectedTask(item);
      setDetailModalVisible(true);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inbox</Text>

      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TaskItem task={item} onPress={() => handleOnPressItem(item)} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />

      <FAB onPress={() => setModalVisible(true)} />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {selectedTask &&  detailModalVisible &&(
        <TaskDetailModal
          visible={detailModalVisible}
          task={selectedTask}
          onClose={() => {
            setDetailModalVisible(false);
            setSelectedTask(null);
          }}
          moveTo={handleMoveTo}
        />
      )}
    </View>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '',
    marginTop: 35
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: 12,
  },
  taskItem: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#f1f1f1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});
