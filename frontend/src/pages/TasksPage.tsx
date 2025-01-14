import React from 'react';
import { TaskList } from '../components/TaskList/TaskList';

export const TasksPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h2>
      <TaskList />
    </div>
  );
}; 