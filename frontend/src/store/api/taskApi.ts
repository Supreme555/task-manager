import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task, TaskFormData } from '../../types';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<{ items: Task[]; total: number }, { page: number; status?: string; priority?: string; sort?: string }>({
      query: ({ page, status, priority, sort }) => ({
        url: '/tasks',
        params: { 
          page: page.toString(),
          ...(status && { status }),
          ...(priority && { priority }),
          ...(sort && { sort: `${sort}:ASC` })
        }
      }),
      transformResponse: (response: { items: Task[]; total: number }) => response,
      transformErrorResponse: (response) => {
        console.error('API Error:', response);
        return response;
      },
      providesTags: ['Task']
    }),
    addTask: builder.mutation<Task, TaskFormData>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task
      }),
      transformErrorResponse: (response) => {
        console.error('API Error:', response);
        return response;
      },
      invalidatesTags: ['Task']
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE'
      }),
      transformErrorResponse: (response) => {
        console.error('API Error:', response);
        return response;
      },
      invalidatesTags: ['Task']
    }),
    updateTaskStatus: builder.mutation<Task, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: { status }
      }),
      transformErrorResponse: (response) => {
        console.error('API Error:', response);
        return response;
      },
      invalidatesTags: ['Task']
    })
  })
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation
} = taskApi; 