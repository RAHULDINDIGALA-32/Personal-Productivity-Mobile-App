import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import FAB from '../components/FAB';
import { isToday } from '../utils/dateUtils';
import TaskDetailModal from '../components/TaskDetailModal';

const TodayScreen = () => {
  const { state, moveTaskToCategory } = useTaskContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const todayTasks = state.tasks.filter(
    task => isToday(task.dueDate) && !task.completed && !task.trashed
  );


  const handleMoveTo = (id, category) => {
    moveTaskToCategory(id, category);
    setDetailModalVisible(false);
    setSelectedTask(null);
  };

  const handleOnPressItem= (item)  => {
      setSelectedTask(item);
      setDetailModalVisible(true);
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today</Text>
      {todayTasks.length === 0 ? (
        <Text style={styles.empty}>You're all caught up!</Text>
      ) : (
         <FlatList
        data={todayTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
           <TaskItem task={item} onPress={() => handleOnPressItem(item)}  />
        )}
      />
      )}

      <FAB onPress={() => setModalVisible(true)} />
      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {selectedTask && detailModalVisible && (
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


export default TodayScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 35 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  empty: { color: '#777', fontSize: 16, textAlign: 'center', marginTop: 40 },
});


