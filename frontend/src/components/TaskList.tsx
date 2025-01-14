import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { TaskPriority, TaskStatus, SavedFilters } from '../types';
import { useGetTasksQuery, useDeleteTaskMutation } from '../store/api/taskApi';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ConfirmModal } from './ConfirmModal';

const ITEMS_PER_PAGE = 10;

const TaskList: React.FC = () => {
  const [savedFilters, setSavedFilters] = useLocalStorage<SavedFilters>('taskFilters', {
    status: undefined,
    priority: undefined,
    sort: undefined,
  });

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TaskStatus | undefined>(savedFilters.status);
  const [priority, setPriority] = useState<TaskPriority | undefined>(savedFilters.priority);
  const [sort, setSort] = useState<string | undefined>(savedFilters.sort);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const { data, isLoading, error } = useGetTasksQuery({
    page,
    status,
    priority,
    sort,
  });

  console.log('TaskList render:', {
    data: data ? {
      items: data.items,
      total: data.total,
      itemsLength: data.items?.length
    } : undefined,
    isLoading,
    error,
    filters: { page, status, priority, sort }
  });

  const [deleteTask] = useDeleteTaskMutation();

  const handleStatusChange = (newStatus: TaskStatus | undefined) => {
    console.log('Status changed to:', newStatus);
    setStatus(newStatus);
    setSavedFilters({ ...savedFilters, status: newStatus });
    setPage(1);
  };

  const handlePriorityChange = (newPriority: TaskPriority | undefined) => {
    console.log('Priority changed to:', newPriority);
    setPriority(newPriority);
    setSavedFilters({ ...savedFilters, priority: newPriority });
    setPage(1);
  };

  const handleSortChange = (newSort: string | undefined) => {
    console.log('Sort changed to:', newSort);
    setSort(newSort);
    setSavedFilters({ ...savedFilters, sort: newSort });
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete).unwrap();
        toast.success('Task deleted successfully');
        setDeleteModalOpen(false);
      } catch (error) {
        console.error('Failed to delete task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  if (error) {
    console.error('API Error:', error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading tasks</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : 'Please try again later'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6 flex gap-4 flex-wrap">
        <select
          className="input"
          value={status || ''}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus || undefined)}
        >
          <option value="">All Status</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
          <option value={TaskStatus.NOT_COMPLETED}>Not Completed</option>
        </select>

        <select
          className="input"
          value={priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value as TaskPriority || undefined)}
        >
          <option value="">All Priority</option>
          <option value={TaskPriority.HIGH}>High</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.LOW}>Low</option>
          <option value={TaskPriority.NONE}>None</option>
        </select>

        <select
          className="input"
          value={sort || ''}
          onChange={(e) => handleSortChange(e.target.value || undefined)}
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="createdAt">Date Created</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <ClipLoader color="#4F46E5" size={50} />
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found
        </div>
      ) : (
        <div className="space-y-4">
          {data.items.map((task) => (
            <div key={task.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-gray-600">{task.description}</p>
              <div className="mt-4 flex gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === TaskPriority.HIGH
                    ? 'bg-red-100 text-red-800'
                    : task.priority === TaskPriority.MEDIUM
                    ? 'bg-yellow-100 text-yellow-800'
                    : task.priority === TaskPriority.LOW
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.priority}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.status === TaskStatus.COMPLETED
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskList; 