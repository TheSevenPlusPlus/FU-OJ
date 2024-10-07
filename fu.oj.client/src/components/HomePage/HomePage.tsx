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
        description: "Các bài toán lập trình với nhiều mức độ khó và chủ đề khác nhau",
        link: "/problems"
    },
    {
        icon: Trophy,
        title: "Contests",
        description: "Tham gia các cuộc thi lập trình và thi đấu với với mọi người để nâng cao kỹ năng",
        link: "/contests"
    },
    {
        icon: BarChart,
        title: "Leaderboard",
        description: "Xem thứ hạng và so sánh hiệu suất của bạn với các người tham gia khác",
        link: "/rank"
    },
    {
        icon: Users,
        title: "Submissions",
        description: "Xem các bài nộp của bạn và mọi người, theo dõi tiến độ và đánh giá hiệu suất các bài giải",
        link: "/submissions/all"
    },
    {
        icon: BookOpen,
        title: "Blog",
        description: "Truy cập các bài hướng dẫn, bài viết và tài nguyên học tập để nâng cao kỹ năng của bạn.",
        link: "/blog"
    }
];

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Helmet>
                <title> FU Online Judge </title>
            </Helmet>

            {/* Phần Giới Thiệu */}
            <section className="bg-black text-white">
                <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                        Nâng Cao Kỹ Năng Lập Trình Của Bạn
                    </h1>
{/*                    <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl text-gray-300">
                        Thử thách bản thân với các bài toán lập trình, tham gia cuộc thi
                        và cải thiện kỹ năng giải thuật của bạn.
                    </p>*/}
                </div>
            </section>

            {/* Phần Hướng Dẫn */}
            <section className="container mx-auto py-12">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {navbarGuides.map((guide, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <guide.icon className="h-8 w-8" />
                                <CardTitle>{guide.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">{guide.description}</p>
                                <Button asChild>
                                    <Link to={guide.link}>Views {guide.title}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Phần Chân Trang */}
            <footer className="bg-gray-100 mt-auto">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About Us</h3>
                            <p className="text-sm text-gray-600">
                                FU Online Judge là sản phẩm do nhóm TheSeven++ phát triển nhằm mục đích phi lợi nhuận và phục vụ cho các bạn sinh viên trường đại học FPT.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2" />
                                    <a href="mailto:thesevenplusplus@gmail.com" className="text-sm text-gray-600 hover:underline">
                                        thesevenplusplus@gmail.com
                                    </a>
                                </li>

                                <li className="flex items-center">
                                    <Facebook className="h-5 w-5 mr-2" />
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61566392623284"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-600 hover:underline"
                                    >
                                        FU Online Judge
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <Globe className="h-5 w-5 mr-2" />
                                    <a
                                        href="https://landing-page-ssg.vercel.app/?fbclid=IwZXh0bgNhZW0CMTAAAR2tt3P9R_ITtUBCpTCp1OPTfec_7rKmUGAl035EHXngxd5_wPXEBQcMa2M_aem_ZQAhO7vUbM1e9vlMypKJSQ"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-600 hover:underline"
                                    >
                                        Visit Our Landing Page
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Member</h3>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-600">Nguyễn Tuấn Vũ - Leader</li>
                                <li className="text-sm text-gray-600">Trần Ngọc Huy - Sub leader</li>
                                <li className="text-sm text-gray-600">Nguyễn Đình Phong - Developer team</li>
                                <li className="text-sm text-gray-600">Nguyễn Thanh Tùng - Developer team</li>
                                <li className="text-sm text-gray-600">Khuất Dung An - Bussiness team</li>
                                <li className="text-sm text-gray-600">Nguyễn Chiến Nguyên - Bussiness team</li>
                                <li className="text-sm text-gray-600">Đoàn Công Huy - Bussiness team</li>
                                <li className="text-sm text-gray-600">Nguyễn Xuân Kiên - Business team</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} FU Online Judge. Bản quyền thuộc về nhóm TheSeven++
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
