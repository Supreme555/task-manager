import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Task, TaskFormData, TaskPriority, TaskStatus } from '../types';
import { useAddTaskMutation, useUpdateTaskMutation } from '../store/api/taskApi';

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess }) => {
  const navigate = useNavigate();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    } : {
      priority: TaskPriority.NONE,
      status: TaskStatus.NOT_COMPLETED,
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        await updateTask({ id: task.id, ...data }).unwrap();
        toast.success('Task updated successfully');
      } else {
        await addTask(data).unwrap();
        toast.success('Task created successfully');
      }
      onSuccess?.() || navigate('/');
    } catch (error: any) {
      console.error('Failed to save task:', error);
      if (error.data?.message) {
        if (Array.isArray(error.data.message)) {
          error.data.message.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(error.data.message);
        }
      } else {
        toast.error(task ? 'Failed to update task' : 'Failed to create task');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto px-4 mt-5">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { 
              required: 'Title is required',
              minLength: {
                value: 4,
                message: 'Title must be at least 4 characters long'
              }
            })}
            className={`input ${errors.title ? 'input-error' : ''}`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'Description is required' })}
            className={`input ${errors.description ? 'input-error' : ''}`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority')}
            className={`input ${errors.priority ? 'input-error' : ''}`}
          >
            <option value={TaskPriority.NONE}>None</option>
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className={`input ${errors.status ? 'input-error' : ''}`}
          >
            <option value={TaskStatus.NOT_COMPLETED}>Not Completed</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <button type="submit" className="btn btn-primary w-full">
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm; 