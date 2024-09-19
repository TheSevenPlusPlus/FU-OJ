// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Home/Navbar';
import Home from './components/Home/Home';
import './styles/App.css';
import Problems from './components/Problems/Problems';
import ProblemDetail from './components/Problems/ProblemDetail';
import SubmitProblemForm from './components/Submissions/SubmitProblemForm';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/problems" element={<Problems />} />
                        <Route path="/problems/:problemCode" element={<ProblemDetail />} />
                        <Route path="/problems/:problemCode/submit" element={<SubmitProblemForm />} />
                        <Route path="/problems/:problemCode/add-testcase" element={<AddTestCaseForm />} /> {/* New route */}

                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
