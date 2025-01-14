import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store/store';
import MainLayout from './layouts/MainLayout';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import EditTaskPage from './pages/EditTaskPage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<TaskList />} />
            <Route path="create" element={<TaskForm />} />
            <Route path="edit/:id" element={<EditTaskPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </Provider>
  );
};

export default App; 