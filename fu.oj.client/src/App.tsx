import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import ProblemList from "./components/Problem/ProblemList";
import SubmissionList from "./components/Submission/SubmissionList";
import ProblemDetail from "./components/Problem/ProblemDetail";
import CodeSubmission from "./components/Submission/SubmitCode";
import BlogList from "./components/Blog/BlogList";
import BlogPost from "./components/Blog/BlogPost";
import AuthPage from "./components/Auth/AuthPage";
import ProfileView from "./components/Profile/ProfileView";
import ProfileEdit from "./components/Profile/ProfileEdit";
import Rank from "./components/Rank/Rank";
import SubmissionDetail from "./components/Submission/SubmissionDetail";
import NotFound from "./components/NotFound";
import ComingSoon from "./components/ComingSoon";
import CreateUser from "./components/Management/User/CreateUser";
import UpdateUser from "./components/Management/User/UpdateUser";
import CreateProblem from "./components/Management/Problem/CreateProblem";
import UpdateProblem from "./components/Management/Problem/UpdateProblem";
import ProblemManagement from "./components/Management/Problem/ProblemManagement";
import UserManagement from "./components/Management/User/UserManagement";
import ChangePassword from "./components/Profile/ChangePassword";
import BlogManagement from "./components/Management/Blog/BlogManagement";
import BlogForm from "./components/Management/Blog/BlogForm";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ContestManagement from "./components/Management/Contest/ContestManagement";
import ContestList from "./components/Contest/ContestList";
import ContestProblem from "./components/Contest/ContestProblem";
import CreateContest from "./components/Management/Contest/CreateContest";
import UpdateContest from "./components/Management/Contest/UpdateContest";
import { ContestRank } from "./components/Contest/ContestRank";
import { ContestHome } from "./components/Contest/ContestHome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="/resetpassword" element={<ResetPassword />} />

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
                                <ContestList />
                            }
                        />
                        <Route
                            path="/contests/:contestCode"
                            element={
                                <ContestHome />
                            }
                        />
                        <Route
                            path="/manager/contests"
                            element={
                                <ContestManagement />
                            }
                        />
                        <Route
                            path="/contests/:contestCode/problems"
                            element={
                                <ContestProblem />
                            }
                        />
                        <Route
                            path="/contests/:contestCode/rank"
                            element={
                                <ContestRank />
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
                            path="/manager/contests/create"
                            element={<CreateContest />}
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
                            path="/manager/contests/update/:contestCode"
                            element={<UpdateContest />}
                        />

                        {/* Blog Management Routes */}
                        <Route
                            path="/manager/blogs"
                            element={<BlogManagement />}
                        />
                        <Route
                            path="/manager/blogs/create"
                            element={<BlogForm />}
                        />
                        <Route
                            path="/manager/blogs/update/:blogId"
                            element={<BlogForm />}
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