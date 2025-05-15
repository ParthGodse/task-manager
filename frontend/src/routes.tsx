import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BoardPage from './components/Board/BoardPage';
import PrivateRoute from './components/common/PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/boards/:id"
        element={<PrivateRoute><BoardPage /></PrivateRoute>}
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}