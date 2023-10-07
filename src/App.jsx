import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/log-in" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
