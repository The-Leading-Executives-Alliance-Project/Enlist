// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Grades from './pages/Grades';
import Applications from './pages/Applications';
import Search from './pages/Search';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Document from './pages/Document';
import DocumentEditor from './pages/DocumentEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard routes with persistent NavBar */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="grades" element={<Grades />} />
          <Route path="applications" element={<Applications />} />
          <Route path="search" element={<Search />} />
          <Route path="document" element={<Document />} />
          <Route path="document/edition/:essayId" element={<DocumentEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;