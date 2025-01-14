import React, { useState } from 'react';
import classNames from 'classnames';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { taskApi } from '../../api/taskApi';
import styles from './TaskList.module.scss';

const ITEMS_PER_PAGE = 10;

export const TaskList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [priority, setPriority] = useState<TaskPriority | undefined>();

  const { data, isLoading, error } = taskApi.useGetTasksQuery({
    page,
    pageSize: ITEMS_PER_PAGE,
    status,
    priority,
  });

  const [deleteTask] = taskApi.useDeleteTaskMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading tasks</div>;
  }

  return (
    <div className={styles.taskList}>
      <div className={styles.filters}>
        <select
          value={status || ''}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className={styles.select}
        >
          <option value="">All Statuses</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
          <option value={TaskStatus.NOT_COMPLETED}>Not Completed</option>
        </select>

        <select
          value={priority || ''}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className={styles.select}
        >
          <option value="">All Priorities</option>
          <option value={TaskPriority.HIGH}>High</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.LOW}>Low</option>
          <option value={TaskPriority.NONE}>None</option>
        </select>
      </div>

      <div className={styles.list}>
        {data?.tasks.map((task) => (
          <div key={task.id} className={styles.task}>
            <div className={styles.header}>
              <h3 className={styles.title}>{task.title}</h3>
              <div className={styles.actions}>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className={styles.description}>{task.description}</p>
            <div className={styles.meta}>
              <span
                className={classNames(
                  styles.tag,
                  styles.priority,
                  styles[task.priority]
                )}
              >
                {task.priority}
              </span>
              <span
                className={classNames(
                  styles.tag,
                  styles.status,
                  styles[task.status]
                )}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {data && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={styles.button}
          >
            Previous
          </button>
          <span className={styles.info}>
            Page {page} of {Math.ceil(data.total / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(data.total / ITEMS_PER_PAGE)}
            className={styles.button}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}; 