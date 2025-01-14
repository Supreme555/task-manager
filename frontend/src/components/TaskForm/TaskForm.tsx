import React from 'react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { taskApi } from '../../api/taskApi';
import styles from './TaskForm.module.scss';

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    } : {
      priority: TaskPriority.NONE,
      status: TaskStatus.NOT_COMPLETED,
    },
  });

  const [createTask] = taskApi.useCreateTaskMutation();
  const [updateTask] = taskApi.useUpdateTaskMutation();

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        await updateTask({ id: task.id, ...data });
      } else {
        await createTask(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Title</label>
        <input
          type="text"
          {...register('title', { required: 'Title is required' })}
          className={classNames(styles.input, {
            [styles.error]: errors.title,
          })}
        />
        {errors.title && (
          <p className={styles.errorMessage}>{errors.title.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className={classNames(styles.input, {
            [styles.error]: errors.description,
          })}
          rows={3}
        />
        {errors.description && (
          <p className={styles.errorMessage}>{errors.description.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Priority</label>
        <select
          {...register('priority')}
          className={styles.input}
        >
          <option value={TaskPriority.HIGH}>High</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.LOW}>Low</option>
          <option value={TaskPriority.NONE}>None</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <select
          {...register('status')}
          className={styles.input}
        >
          <option value={TaskStatus.COMPLETED}>Completed</option>
          <option value={TaskStatus.NOT_COMPLETED}>Not Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
      >
        {task ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}; 