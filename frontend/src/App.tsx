import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SubmitPage from './pages/SubmitPage';
import ReviewPage from './pages/ReviewPage'; // 相对路径导入，无 .tsx 后缀
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;