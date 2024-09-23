import React from 'react';
import { Link } from 'react-router-dom';
import { CodeIcon, ChartBarIcon, UserGroupIcon, BookOpenIcon, StopIcon } from '@heroicons/react/outline';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-orange-600 text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                        Master Your Coding Skills
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl">
                        Challenge yourself with coding problems, compete in contests, and improve your algorithmic skills.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 md:py-4 md:text-lg md:px-10">
                                Get started
                            </Link>
                        </div>
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Link to="/problems" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 md:py-4 md:text-lg md:px-10">
                                View problems
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to excel
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                                        <CodeIcon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-lg leading-6 font-medium text-gray-900">
                                        Diverse Problem Set
                                    </dt>
                                    <dd className="mt-2 text-base text-gray-500">
                                        Access a wide range of coding problems across various difficulty levels and topics.
                                    </dd>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                                        <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-lg leading-6 font-medium text-gray-900">
                                        Real-time Feedback
                                    </dt>
                                    <dd className="mt-2 text-base text-gray-500">
                                        Get instant feedback on your submissions with detailed performance metrics.
                                    </dd>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                                        <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-lg leading-6 font-medium text-gray-900">
                                        Competitive Contests
                                    </dt>
                                    <dd className="mt-2 text-base text-gray-500">
                                        Participate in regular coding contests and compete with peers from around the world.
                                    </dd>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                                        <BookOpenIcon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-lg leading-6 font-medium text-gray-900">
                                        Learning Resources
                                    </dt>
                                    <dd className="mt-2 text-base text-gray-500">
                                        Access tutorials, editorials, and discussion forums to enhance your problem-solving skills.
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-orange-600">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Trusted by developers from over 80 countries
                        </h2>
                        <p className="mt-3 text-xl text-orange-200 sm:mt-4">
                            Join our growing community of problem solvers and competitive programmers.
                        </p>
                    </div>
                    <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
                        <div className="flex flex-col">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-orange-200">
                                Problems
                            </dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">
                                1,000+
                            </dd>
                        </div>
                        <div className="flex flex-col mt-10 sm:mt-0">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-orange-200">
                                Users
                            </dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">
                                100,000+
                            </dd>
                        </div>
                        <div className="flex flex-col mt-10 sm:mt-0">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-orange-200">
                                Submissions
                            </dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">
                                5M+
                            </dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Recent Contests Section */}
            <section className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Recent Contests
                    </h2>
                    <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((contest) => (
                            <div key={contest} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <StopIcon className="h-6 w-6 text-orange-600" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Weekly Contest {contest}
                                                </dt>
                                                <dd>
                                                    <div className="text-lg font-medium text-gray-900">
                                                        Starts in 2 days
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm">
                                        <Link to={`/contest/${contest}`} className="font-medium text-orange-600 hover:text-orange-500">
                                            View details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-12 bg-orange-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Blog</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Latest from our blog
                        </p>
                    </div>
                    <div className="mt-10 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                        {[1, 2, 3].map((post) => (
                            <div key={post} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                <div className="flex-shrink-0">
                                    <img className="h-48 w-full object-cover" src={`https://source.unsplash.com/random/800x600?coding&sig=${post}`} alt="" />
                                </div>
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-orange-600">
                                            <Link to="#" className="hover:underline">
                                                Article
                                            </Link>
                                        </p>
                                        <Link to="#" className="block mt-2">
                                            <p className="text-xl font-semibold text-gray-900">Mastering Dynamic Programming</p>
                                            <p className="mt-3 text-base text-gray-500">Learn essential techniques for solving complex algorithmic problems using dynamic programming.</p>
                                        </Link>
                                    </div>
                                    <div className="mt-6 flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="sr-only">Author name</span>
                                            <img className="h-10 w-10 rounded-full" src={`https://source.unsplash.com/random/100x100?face&sig=${post}`} alt="" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                <Link to="#" className="hover:underline">
                                                    Jane Smith
                                                </Link>
                                            </p>
                                            <div className="flex space-x-1 text-sm text-gray-500">
                                                <time dateTime="2023-03-16">Mar 16, 2023</time>
                                                <span aria-hidden="true">&middot;</span>
                                                <span>6 min read</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-orange-600">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block">Start solving problems today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-orange-200">
                        Join thousands of developers who are improving their coding skills every day.
                    </p>
                    <Link
                        to="/signup"
                        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 sm:w-auto"
                    >
                        Sign up for free
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;