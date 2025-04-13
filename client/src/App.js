import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import InternshipDetails from './pages/InternshipDetails';
import Dashboard from './pages/Dashboard';
import PostInternship from './pages/PostInternship';
import Applications from './pages/Applications';
import NotFound from './pages/NotFound';

// Context Provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/internship/:id" element={<InternshipDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<PostInternship />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/post-internship" element={<PostInternship />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
