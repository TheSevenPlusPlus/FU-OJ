import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage";
import ProblemList from "./components/ProblemList";
import SubmissionList from "./components/SubmissionList";
import ProblemDetail from "./components/ProblemDetail";
import CodeSubmission from "./components/SubmitCode";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import AuthPage from "./components/AuthPage";
import ProfileView from "./components/Profile/ProfileView";
import ProfileEdit from "./components/Profile/ProfileEdit";
import Rank from "./components/Rank";
import SubmissionDetail from "./components/SubmissionDetail";
import NotFound from "./components/NotFound";
import ComingSoon from "./components/ComingSoon";
import CreateUser from "./components/Management/User/CreateUser";
import UpdateUser from "./components/Management/User/UpdateUser";
import BlogManagement from "./components/Management/BlogManagement";
import CreateProblem from "./components/Management/Problem/CreateProblem";
import UpdateProblem from "./components/Management/Problem/UpdateProblem";
import ProblemManagement from "./components/Management/Problem/ProblemManagement";
import UserManagement from "./components/Management/User/UserManagement";
import ChangePassword from "./components/Profile/ChangePassword";

const App: React.FC = () => {
    const mockProfile = {
        username: "mock_user",
        avatar: "https://github.com/shadcn.png",
        description: "Welcome to my profile!",
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        {/* Auth */}
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/register" element={<AuthPage />} />

                        {/* Profile */}
                        <Route path="/profile" element={<ProfileView />} />
                        <Route
                            path="/profile/:userName"
                            element={<ProfileView />}
                        />
                        <Route path="/profile/edit" element={<ProfileEdit />} />
                        <Route
                            path="/changepassword"
                            element={<ChangePassword />}
                        />

                        {/* Problem */}
                        <Route path="/problems" element={<ProblemList />} />
                        <Route
                            path="/problem/:problemCode"
                            element={<ProblemDetail />}
                        />
                        <Route
                            path="/problem/:problemCode/submit"
                            element={<CodeSubmission />}
                        />

                        {/* Submissions */}
                        <Route
                            path="/submissions/:id"
                            element={<SubmissionDetail />}
                        />
                        <Route
                            path="/submissions/all"
                            element={<SubmissionList />}
                        />

                        {/* Blogs */}
                        <Route path="/blog" element={<BlogList />} />
                        <Route path="/blog/:blog_id" element={<BlogPost />} />

                        {/* RankBoard */}
                        <Route path="/rank" element={<Rank />} />
                        <Route path="/rank/:page" element={<Rank />} />

                        {/* Contests */}
                        <Route
                            path="/contests"
                            element={
                                <ComingSoon
                                    targetDate={new Date("2024-10-07T00:00:00")}
                                />
                            }
                        />

                        {/* Management */}
                        <Route
                            path="/manager/problems"
                            element={<ProblemManagement />}
                        />
                        <Route
                            path="/manager/problems/create"
                            element={<CreateProblem />}
                        />
                        <Route
                            path="/manager/problems/update/:problemCode"
                            element={<UpdateProblem />}
                        />

                        <Route
                            path="/manager/users"
                            element={<UserManagement />}
                        />
                        <Route
                            path="/manager/users/create"
                            element={<CreateUser />}
                        />
                        <Route
                            path="/manager/users/update/:userName"
                            element={<UpdateUser />}
                        />
                        <Route
                            path="/manager/blogs"
                            element={<BlogManagement />}
                        />

                        {/* 404 Not Found */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
