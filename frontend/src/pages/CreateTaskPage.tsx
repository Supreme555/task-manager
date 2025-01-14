import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/TaskForm/TaskForm';

export const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
      <div className="max-w-2xl">
        <TaskForm onSuccess={() => navigate('/')} />
      </div>
    </div>
  );
}; 