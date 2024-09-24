import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProblemList from './components/ProblemList';
import SubmissionList from './components/SubmissionList';
import ProblemDetail from './components/ProblemDetail';
import CodeSubmission from './components/SubmitCode';

const App: React.FC = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/problems" element={<ProblemList />} />
                        <Route path="/problem/:problemCode" element={<ProblemDetail />} />
                        <Route path="/problem/:problemCode/submit" element={<CodeSubmission/> } />
                        <Route path="/submissions" element={<SubmissionList />} />
                    </Routes>
                </main>
                {/* <Footer /> */}
            </div>
        </Router>
    );
};

export default App;
