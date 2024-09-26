import React from 'react';
import { Link } from 'react-router-dom';
import { Code, BarChart, Users, BookOpen, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
    { icon: Code, title: "Diverse Problem Set", description: "Access a wide range of coding problems across various difficulty levels and topics." },
    { icon: BarChart, title: "Real-time Feedback", description: "Get instant feedback on your submissions with detailed performance metrics." },
    { icon: Users, title: "Competitive Contests", description: "Participate in regular coding contests and compete with peers from around the world." },
    { icon: BookOpen, title: "Learning Resources", description: "Access tutorials, editorials, and discussion forums to enhance your problem-solving skills." }
];

const stats = [
    { stat: "1,000+", label: "Problems" },
    { stat: "100,000+", label: "Users" },
    { stat: "5M+", label: "Submissions" }
];

const contests = [1, 2, 3];

const blogPosts = [
    { title: "Mastering Dynamic Programming", description: "Learn essential techniques for solving complex algorithmic problems using dynamic programming.", author: "Jane Smith", date: "Mar 16, 2023", readTime: "6 min read" },
    { title: "Efficient Graph Algorithms", description: "Explore advanced graph algorithms and their applications in solving real-world problems.", author: "John Doe", date: "Mar 20, 2023", readTime: "8 min read" },
    { title: "Optimizing Time Complexity", description: "Discover strategies to improve the time complexity of your algorithms and boost performance.", author: "Alice Johnson", date: "Mar 25, 2023", readTime: "5 min read" }
];

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-black text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                        Master Your Coding Skills
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl text-gray-300">
                        Challenge yourself with coding problems, compete in contests, and improve your algorithmic skills.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <Button asChild className="mr-4">
                            <Link to="/register">Get started</Link>
                        </Button>
                        <Button variant="outline" className="text-black" asChild>
                            <Link to="/problems">View problems</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-black font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-black sm:text-4xl">
                            Everything you need to excel
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 max-w-lg mx-auto lg:grid-cols-4 lg:max-w-none">
                        {features.map((feature, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <feature.icon className="h-6 w-6 mb-2" />
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-black text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold sm:text-4xl">
                            Trusted by developers from over 80 countries
                        </h2>
                        <p className="mt-3 text-xl text-gray-300 sm:mt-4">
                            Join our growing community of problem solvers and competitive programmers.
                        </p>
                    </div>
                    <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
                        {stats.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">
                                    {item.label}
                                </dt>
                                <dd className="order-1 text-5xl font-extrabold">
                                    {item.stat}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Recent Contests Section */}
            <section className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-black sm:text-4xl mb-6">
                        Recent Contests
                    </h2>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {contests.map((contest) => (
                            <Card key={contest}>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Trophy className="h-6 w-6 mr-2" />
                                        Weekly Contest {contest}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg font-medium">Starts in 2 days</p>
                                    <Button variant="link" asChild className="mt-2 p-0">
                                        <Link to={`/contest/${contest}`}>View details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-base text-black font-semibold tracking-wide uppercase">Blog</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-black sm:text-4xl">
                            Latest from our blog
                        </p>
                    </div>
                    <div className="mt-10 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                        {blogPosts.map((post, index) => (
                            <Card key={index}>
                                <img className="h-48 w-full object-cover" src={`https://source.unsplash.com/random/800x600?coding&sig=${index}`} alt="" />
                                <CardHeader>
                                    <CardTitle>{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 mb-4">{post.description}</p>
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full mr-2" src={`https://source.unsplash.com/random/100x100?face&sig=${index}`} alt="" />
                                        <div>
                                            <p className="text-sm font-medium text-black">{post.author}</p>
                                            <p className="text-sm text-gray-500">{post.date} · {post.readTime}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block">Start solving problems today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-gray-300">
                        Join thousands of developers who are improving their coding skills every day.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link to="/register">Register for free</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;