// BlogPostHeader.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TextWithNewLines from "../TextWithNewLines/TextWithNewLines";

export default function BlogPostHeader({ blogPost }) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    return (
        <Card className="bg-white shadow-lg">
            <CardHeader>
                <h1 className="text-3xl font-bold">{blogPost.title}</h1>
                <p className="text-sm text-gray-500">
                    By {blogPost.userName} on {formatDate(blogPost.createdAt)}
                </p>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">
                    <TextWithNewLines text={blogPost.content} />
                </p>
            </CardContent>
        </Card>
    );
}