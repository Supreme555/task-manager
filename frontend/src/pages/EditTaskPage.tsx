import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetTaskByIdQuery } from '../store/api/taskApi';
import { TaskForm } from '../components/TaskForm';
import { ClipLoader } from 'react-spinners';

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useGetTaskByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load task');
    navigate('/');
    return null;
  }

  if (!task) {
    toast.error('Task not found');
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
      <TaskForm 
        task={task} 
        onSuccess={() => {
          toast.success('Task updated successfully');
          navigate('/');
        }}
      />
    </div>
  );
};

export default EditTaskPage; 