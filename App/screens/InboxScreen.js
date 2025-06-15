import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddTaskModal from '../components/AddTaskModal';
import { useTasks } from '../context/TaskContext';


const InboxScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { tasks, toggleTaskCompleted } = useTasks();

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => toggleTaskCompleted(item.id)}
    >
      <Ionicons
        name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={item.completed ? '#4CAF50' : '#ccc'}
        style={styles.checkIcon}
      />
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskText,
            item.completed && { textDecorationLine: 'line-through', color: '#999' },
          ]}
        >
          {item.text}
        </Text>
        {(item.context || item.projectId) && (
          <Text style={styles.metaText}>
            {item.context ? `@${item.context}` : ''} {item.projectId ? `(Project)` : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="mail-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>No tasks in Inbox</Text>
          <Text style={styles.subText}>Tap + to add a new task</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Floating + Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  listContainer: {
    paddingVertical: 12,
    marginTop: 28,
    
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  checkIcon: {
    marginRight: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

