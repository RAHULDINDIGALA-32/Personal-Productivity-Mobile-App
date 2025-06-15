import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), title, done: false }]);
  };

  const toggleDone = (id) => {
    setTasks(prev =>
      prev.map(task => task.id === id ? { ...task, done: !task.done } : task)
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleDone }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
