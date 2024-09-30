import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Upload, X } from "lucide-react";
import { createProblem } from "../../../api/problem";
import { CreateProblemModel } from "../../../models/ProblemModel";
import { createTestCase } from "../../../api/testcase";
import { Alert, AlertDescription } from "../../ui/alert";

interface User {
    userName: string;
    email: string;
    token: string;
    avatarUrl: string;
    role?: string;
}

const CreateProblem: React.FC = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState<CreateProblemModel>({
        code: "",
        title: "",
        description: "",
        constraints: "",
        input: "",
        output: "",
        exampleInput: "",
        exampleOutput: "",
        timeLimit: "",
        memoryLimit: "",
        userName: "",
        difficulty: "Easy",
    });
    const [testCaseFile, setTestCaseFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleDifficultyChange = (value: string) => {
        setFormState((prev) => ({ ...prev, difficulty: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTestCaseFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setTestCaseFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userInfo: User = JSON.parse(
                localStorage.getItem("user") || "{}",
            );
            const updatedFormState = {
                ...formState,
                userName: userInfo.userName,
            };

            const problemResponse = await createProblem(updatedFormState);
            const problemCode: string = updatedFormState.code;

            if (testCaseFile) {
                const formData = new FormData();
                formData.append("TestcaseFile", testCaseFile);
                formData.append("ProblemCode", problemCode);
                await createTestCase(formData);
            }

            navigate("/manager/problems");
        } catch (err) {
            setError("Failed to create problem or upload test case");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Problem</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="code">Problem Code</Label>
                    <Input
                        id="code"
                        name="code"
                        value={formState.code}
                        onChange={handleInputChange}
                        placeholder="Enter problem code"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formState.title}
                        onChange={handleInputChange}
                        placeholder="Enter problem title"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        placeholder="Enter problem description"
                        rows={5}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="constraints">Constraints</Label>
                    <Textarea
                        id="constraints"
                        name="constraints"
                        value={formState.constraints}
                        onChange={handleInputChange}
                        placeholder="Enter problem constraints"
                        rows={3}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="input">Input</Label>
                    <Textarea
                        id="input"
                        name="input"
                        value={formState.input}
                        onChange={handleInputChange}
                        placeholder="Enter input"
                        rows={2}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="output">Output</Label>
                    <Textarea
                        id="output"
                        name="output"
                        value={formState.output}
                        onChange={handleInputChange}
                        placeholder="Enter output"
                        rows={2}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="exampleInput">Example Input</Label>
                    <Textarea
                        id="exampleInput"
                        name="exampleInput"
                        value={formState.exampleInput}
                        onChange={handleInputChange}
                        placeholder="Enter example input"
                        rows={2}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="exampleOutput">Example Output</Label>
                    <Textarea
                        id="exampleOutput"
                        name="exampleOutput"
                        value={formState.exampleOutput}
                        onChange={handleInputChange}
                        placeholder="Enter example output"
                        rows={2}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                    <Input
                        id="timeLimit"
                        name="timeLimit"
                        type="number"
                        value={formState.timeLimit}
                        onChange={handleInputChange}
                        placeholder="Enter time limit"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="memoryLimit">Memory Limit (KB)</Label>
                    <Input
                        id="memoryLimit"
                        name="memoryLimit"
                        type="number"
                        value={formState.memoryLimit}
                        onChange={handleInputChange}
                        placeholder="Enter memory limit"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                        onValueChange={handleDifficultyChange}
                        value={formState.difficulty}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="testCase">Test Case File</Label>
                    <Card className="mt-2">
                        <CardContent className="p-4">
                            {testCaseFile ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {testCaseFile.name}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveFile}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <label
                                    htmlFor="testCase"
                                    className="flex flex-col items-center justify-center cursor-pointer"
                                >
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <span className="mt-2 text-sm text-gray-500">
                                        Click to upload test case file
                                    </span>
                                    <Input
                                        id="testCase"
                                        name="testCase"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </CardContent>
                    </Card>
                    <Alert className="mt-2 bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            Please submit the test case as ProblemCode.zip,
                            which is a compressed file of the ProblemCode
                            folder. <br />
                            Inside contains folders in the form Test1, Test2,
                            Test3, ... TestN-th. <br />
                            Inside each folder of each test case contains two
                            files ProblemCode.inp, ProblemCode.out, which are
                            input and output files.
                        </AlertDescription>
                    </Alert>
                </div>
                <Button type="submit">Create Problem</Button>
            </form>
        </div>
    );
};

export default CreateProblem;
