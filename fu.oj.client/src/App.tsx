import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProblemList from './components/ProblemList';
import SubmissionList from './components/SubmissionList';
import ProblemDetail from './components/ProblemDetail';
import CodeSubmission from './components/SubmitCode';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost'; // Import BlogPost component
import SubmissionDetail from './components/SubmissionDetail'

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
                        <Route path="/problem/:problemCode/submit" element={<CodeSubmission />} />
                        <Route path="/submissions/:id" element={<SubmissionDetail />} />
                        <Route path="/submissions" element={<SubmissionList />} />
                        <Route path="/blog" element={<BlogList />} />
                        {/* Update this route to pass the blog_id */}
                        <Route path="/blog/:blog_id" element={<BlogPost />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
