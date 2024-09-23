import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
//import Footer from './components/Footer';
//import ProblemsPage from './pages/ProblemsPage';
//import ContestsPage from './pages/ContestsPage';
//import LeaderboardPage from './pages/LeaderboardPage';
//import BlogPage from './pages/BlogPage';
import './index.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage/> } />
                        {/*<Route path="/problems" element={<ProblemsPage />} />*/}
                        {/*<Route path="/contests" element={<ContestsPage />} />*/}
                        {/*<Route path="/leaderboard" element={<LeaderboardPage />} />*/}
                        {/*<Route path="/blog" element={<BlogPage />} />*/}
                    </Routes>
                </main>
                {/*<Footer />*/}
            </div>
        </Router>
    );
};

export default App;