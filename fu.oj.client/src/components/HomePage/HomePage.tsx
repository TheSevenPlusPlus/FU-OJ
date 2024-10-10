import React from "react";
import { Link } from "react-router-dom";
import { Code, BarChart, Users, BookOpen, Trophy, Facebook, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const navbarGuides = [
    {
        icon: Code,
        title: "Problems",
        description: "Programming problems with various difficulty levels and topics.",
        link: "/problems"
    },
    {
        icon: Trophy,
        title: "Contests",
        description: "Join coding contests and compete with others to improve your skills.",
        link: "/contests"
    },
    {
        icon: BarChart,
        title: "Leaderboard",
        description: "View rankings and compare your performance with other participants.",
        link: "/rank"
    },
    {
        icon: Users,
        title: "Submissions",
        description: "View your and others' submissions, track progress, and evaluate solutions.",
        link: "/submissions/all"
    },
    {
        icon: BookOpen,
        title: "Blog",
        description: "Access tutorials, articles, and learning resources to enhance your skills.",
        link: "/blog"
    }
];

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Helmet>
                <title> FU Online Judge </title>
            </Helmet>

            {/* Introduction Section */}
            <section className="bg-black text-white">
                <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                        Improve Your Programming Skills
                    </h1>
                </div>
            </section>

            {/* Guide Section */}
            <section className="container mx-auto py-12">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {navbarGuides.map((guide, index) => (
                        <Card key={index} className="border-gray-200 hover:border-black transition-colors duration-300 shadow-md">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <guide.icon className="h-8 w-8 text-gray-700" />
                                <CardTitle className="text-gray-900">{guide.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">{guide.description}</p>
                                <Button asChild className="bg-black hover:bg-gray-800 text-white">
                                    <Link to={guide.link}>View {guide.title}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-900 mt-auto text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">About Us</h3>
                            <p className="text-sm text-gray-400">
                                FU Online Judge is a product developed by TheSeven++ team for non-profit purposes, serving the students of FPT University.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">Contact</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2 text-gray-400" />
                                    <a href="mailto:thesevenplusplus@gmail.com" className="text-sm text-gray-400 hover:text-white hover:underline">
                                        thesevenplusplus@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <Facebook className="h-5 w-5 mr-2 text-gray-400" />
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61566392623284"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-400 hover:text-white hover:underline"
                                    >
                                        FU Online Judge
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <Globe className="h-5 w-5 mr-2 text-gray-400" />
                                    <a
                                        href="https://landing-page-ssg.vercel.app/?fbclid=IwZXh0bgNhZW0CMTAAAR2tt3P9R_ITtUBCpTCp1OPTfec_7rKmUGAl035EHXngxd5_wPXEBQcMa2M_aem_ZQAhO7vUbM1e9vlMypKJSQ"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-400 hover:text-white hover:underline"
                                    >
                                        Visit Our Landing Page
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-300">Members</h3>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-400">Nguyễn Tuấn Vũ - Leader</li>
                                <li className="text-sm text-gray-400">Trần Ngọc Huy - Sub leader</li>
                                <li className="text-sm text-gray-400">Nguyễn Đình Phong - Developer team</li>
                                <li className="text-sm text-gray-400">Nguyễn Thanh Tùng - Developer team</li>
                                <li className="text-sm text-gray-400">Khuất Dung An - Business team</li>
                                <li className="text-sm text-gray-400">Nguyễn Chiến Nguyên - Business team</li>
                                <li className="text-sm text-gray-400">Đoàn Công Huy - Business team</li>
                                <li className="text-sm text-gray-400">Nguyễn Xuân Kiên - Business team</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-8 text-center">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} FU Online Judge. All rights reserved by TheSeven++ team.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}