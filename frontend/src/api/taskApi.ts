import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task, TaskFilters, TasksResponse } from '../types/task';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, TaskFilters>({
      query: (filters) => ({
        url: '/tasks',
        params: filters,
      }),
      providesTags: ['Task'],
    }),
    
    getTaskById: builder.query<Task, number>({
      query: (id) => `/tasks/${id}`,
      providesTags: ['Task'],
    }),
    
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    
    updateTask: builder.mutation<Task, Partial<Task> & Pick<Task, 'id'>>({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
}); 