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
  const updatedTasks = state.tasks.map(task =>
    task.id === action.payload.taskId
      ? {
          ...task,
          category: action.payload.category,
          projectId:
            action.payload.projectId !== undefined
              ? action.payload.projectId
              : task.projectId,
          contextId:
            action.payload.contextId !== undefined
              ? action.payload.contextId
              : task.contextId,
        }
      : task
  );
  updatedState = { ...state, tasks: updatedTasks };
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
    
  case 'DELETE_PROJECT_AND_TASKS':
    updatedState = {
    ...state,
    projects: state.projects.filter(p => p.id !== action.payload),
    tasks: state.tasks.filter(task => task.projectId !== action.payload),
  };
  break;

  case 'UPDATE_PROJECT':
    updatedState = {
    ...state,
    projects: state.projects.map(p =>
      p.id === action.payload.id
        ? { ...p, ...action.payload }
        : p
    ),
  };
  break;

  case 'ADD_CONTEXT':
  if (state.contexts.some(c => c.name === action.payload.name)) return state;
  return {
    ...state,
    contexts: [...state.contexts, { id: action.payload.id, name: action.payload.name }],
  };
  
  case 'DELETE_CONTEXT':
  updatedState = {
    ...state,
    contexts: state.contexts.filter(c => c.id !== action.payload),
    tasks: state.tasks.map(task =>
      task.contextId === action.payload
        ? { ...task, contextId: null, completed: true } 
        : task
    ),
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

  const moveTaskToCategory = (id, category, payload = {}) => {
  dispatch({
    type: 'MOVE_TASK_CATEGORY',
    payload: {
      taskId: id,
      category,
      ...payload, 
    },
  });
};

const addProject = (name, id = uuid.v4()) => {
  const newProject = { id, name };
  dispatch({ type: 'ADD_PROJECT', payload: newProject });
};

const deleteProject = (projectId) => {
  dispatch({ type: 'DELETE_PROJECT_AND_TASKS', payload: projectId });
};

const updateProject = (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project, });


  const moveTo = (taskId, destination, payload = {}) => {
  const task = state.tasks.find(t => t.id === taskId);

  if (destination === 'project') {
    // If the task is already a next action, keep it as a next action!
    dispatch({
      type: 'MOVE_TASK_CATEGORY',
      payload: {
        taskId,
        category: (task?.category === 'nextActions' || task?.category === 'next') ? task.category : 'projects',
        projectId: payload.projectId,
        contextId: task?.contextId,
      },
    });
  } else if (destination === 'next' || destination === 'nextActions') {
    dispatch({
      type: 'MOVE_TASK_CATEGORY',
      payload: {
        taskId,
        category: 'nextActions',
        contextId: payload.contextId,
        projectId: task?.projectId,
      },
    });
  }
};

  const getTasksByProject = (projectId) => {
    return state.tasks.filter(task => task.projectId === projectId &&  !task.completed && !task.trashed);
  };


const addContext = (name, id = uuid.v4()) => {
  if (!name.trim()) return; 
  if (state.contexts.some(c => c.name === name.trim())) return; 
  dispatch({ type: 'ADD_CONTEXT', payload: { id, name: name.trim() } });
};

const deleteContext = (contextId) => {
  dispatch({ type: 'DELETE_CONTEXT', payload: contextId });
};

const saveState = (updatedState) => {
  AsyncStorage.setItem('taskState', JSON.stringify(updatedState));
};

  return (
    <TaskContext.Provider
      value={{ state, dispatch, addTask, toggleComplete, undoComplete, moveTaskToCategory, updateTask, addProject, deleteProject, updateProject, addContext, deleteContext, getTasksByProject, saveState, moveTo } }
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
