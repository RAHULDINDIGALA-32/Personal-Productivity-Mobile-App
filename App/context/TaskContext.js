import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  projects: [],  
  contexts: [],  
};

const reducer = (state, action) => {
  let updatedState;

  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'SET_TASKS':
      updatedState = { ...state, tasks: action.payload };
      break;

    case 'ADD_TASK':
      updatedState = { ...state, tasks: [...state.tasks, action.payload] };
      break;

    case 'TOGGLE_COMPLETE':
      updatedState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
      break;

    case 'UNDO_COMPLETE':
      updatedState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: false } : task
        ),
      };
      break;

    case 'MOVE_TASK_CATEGORY':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
                ...task,
                category: action.payload.category,
                projectId: action.payload.projectId !== undefined
                  ? action.payload.projectId
                  : task.projectId,
                context: action.payload.context !== undefined
                  ? action.payload.context
                  : task.context,
              }
            : task
        ),
      };
      break;

    case 'UPDATE_TASK':
      updatedState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
      break;

    case 'ADD_PROJECT':
      updatedState = {
        ...state,
        projects: [...state.projects, action.payload],
      };
      break;

    case 'ADD_CONTEXT':
      updatedState = {
        ...state,
        contexts: state.contexts.includes(action.payload)
          ? state.contexts
          : [...state.contexts, action.payload],
      };
      break;

    default:
      return state;
  }

  // Persist the entire state on every update
  AsyncStorage.setItem('taskState', JSON.stringify(updatedState));
  return updatedState;
};


export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load tasks on app start
useEffect(() => {
  const loadState = async () => {
    const stored = await AsyncStorage.getItem('taskState');
    if (stored) {
      dispatch({ type: 'SET_STATE', payload: JSON.parse(stored) });
    }
  };
  loadState();
}, []);


  const addTask = (title, description, dueDate, priority, category = 'inbox', projectId = null) => {
    const newTask = {
      id: uuid.v4(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
      category,
      projectId,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const toggleComplete = (id) => dispatch({ type: 'TOGGLE_COMPLETE', payload: id });

  const undoComplete = (id) => dispatch({ type: 'UNDO_COMPLETE', payload: id });

  const updateTask = (updatedTask) => dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

  const moveTaskToCategory = (id, category, projectId = null) => { dispatch({ type: 'MOVE_TASK', payload: { id, category, projectId } });};
  const addProject = (name) => {
    const newProject = {
      id: uuid.v4(),
      name,
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const moveTo = (taskId, destination, payload = {}) => {
  if (destination === 'project') {
    dispatch({
      type: 'MOVE_TASK_CATEGORY',
      payload: {
        taskId,
        category: 'projects',
        projectId: payload.projectId,
      },
    });
  } else if (destination === 'next') {
    dispatch({
      type: 'MOVE_TASK_CATEGORY',
      payload: {
        taskId,
        category: 'nextActions',
        context: payload.context,
      },
    });
  }
};

  const getTasksByProject = (projectId) => {
    return state.tasks.filter(task => task.projectId === projectId);
  };


const addContext = (contextName) => { dispatch({ type: 'ADD_CONTEXT', payload: contextName }); };

const saveState = (updatedState) => {
  AsyncStorage.setItem('taskState', JSON.stringify(updatedState));
};

  return (
    <TaskContext.Provider
      value={{ state, dispatch, addTask, toggleComplete, undoComplete, moveTaskToCategory, updateTask, addProject, addContext, getTasksByProject, saveState, moveTo } }
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
