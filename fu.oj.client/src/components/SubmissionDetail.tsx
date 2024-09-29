import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code, Clock, User } from "lucide-react";
import { getSubmissionById } from "../api/submission";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism"; // Sử dụng theme "vs" của Visual Studio Code
import { Result } from "../models/ResultModel";
import { Submission } from "../models/SubmissionModel";

const SubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmissionById(id);
        //console.log(response);
        //console.log(response.data);
        setSubmission(response.data);
      } catch (err) {
        setError("Failed to fetch problem details");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-500";
      case "wrong answer":
        return "bg-red-500";
      case "time limit exceeded":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

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
    <div className="container mx-auto py-8 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto bg-white text-black">
        <CardHeader className="border-b border-gray-200">
          {submission ? (
            <CardTitle className="text-2xl font-bold">
              <Link
                to={`/problem/${submission.problemName}`}
                className="text-blue-600 hover:underline"
              >
                {submission.problemName}
              </Link>
            </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {submission ? (
            <>
              {/* Basic Submission Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Code className="mr-2 text-gray-600" />
                  <span className="font-semibold">Language:</span>
                  <span className="ml-2">{submission.languageName}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-gray-600" />
                  <span className="font-semibold">Submitted:</span>
                  <span className="ml-2">
                    {formatDate(submission.submittedAt)}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 text-gray-600" />
                  <span className="font-semibold">User:</span>
                  <span className="ml-2">
                    {submission.userName || "Anonymous"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Badge
                    className={`${getStatusColor(submission.status)} text-white`}
                  >
                    {submission.status}
                  </Badge>
                </div>
              </div>

              {/* Source Code Display with Syntax Highlighting */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Submitted Code:</h3>
                <SyntaxHighlighter
                  language={submission.languageName.toLowerCase()}
                  style={vs}
                >
                  {submission.sourceCode}
                </SyntaxHighlighter>
              </div>

              {/* Test Results Table */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Test Case</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Memory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submission.results.map((result, index) => (
                      <TableRow>
                        <TableCell className="font-medium">
                          Test {index + 1}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(result.statusDescription)} text-white`}
                          >
                            {result.statusDescription}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {result.time == null ? "0" : result.time}
                        </TableCell>
                        <TableCell>{result.memory} KB</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <p>Loading submission details...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionDetail;
