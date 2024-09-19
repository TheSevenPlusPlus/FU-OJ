// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './styles/App.css';
import Problems from './components/Problems';
import ProblemDetail from './components/ProblemDetail';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/problems" element={<Problems />} />
                        <Route path="/problems/:problemCode" element={<ProblemDetail/>} />

                        {/* Thêm các route khác ở đây */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
