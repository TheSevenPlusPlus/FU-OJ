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
import AuthPage from './components/AuthPage';
import ProfilePage from './components/Profile/ProfilePage';
import PublicProfilePage from './components/Profile/PublicProfilePage';
import PasswordEditPage from './components/Profile/PasswordEditPage';

const App: React.FC = () => {

    const mockProfile = {
        username: 'mock_user',
        avatar: 'https://github.com/shadcn.png',
        description: 'Welcome to my profile!'
    }

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        {/*Auth*/}
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/register" element={<AuthPage />} />
                        {/*Profile*/}
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/:username" element={<PublicProfilePage profile={mockProfile} />} />
                        <Route path="/change-password" element={<PasswordEditPage />} />
                        {/*Problem*/}
                        <Route path="/problems" element={<ProblemList />} />
                        <Route path="/problem/:problemCode" element={<ProblemDetail />} />
                        <Route path="/problem/:problemCode/submit" element={<CodeSubmission />} />
                        {/*Submissions*/}
                        <Route path="/submissions" element={<SubmissionList />} />
                        {/*Blogs*/}
                        <Route path="/blog" element={<BlogList />} />
                        <Route path="/blog/:blog_id" element={<BlogPost />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
