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
import { CreateProblemModel, ExampleInputOutput } from "../../../models/ProblemModel";
import { createTestCase } from "../../../api/testcase";
import { Alert, AlertDescription } from "../../ui/alert";
import { Helmet } from "react-helmet-async";

const CreateProblem: React.FC = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState<CreateProblemModel>({
        code: "",
        title: "",
        description: "",
        constraints: "",
        input: "",
        output: "",
        examples: [{ input: "", output: "" }], // Start with one example
        timeLimit: "",
        memoryLimit: "",
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

    const handleExampleChange = (index: number, field: string, value: string) => {
        const updatedExamples = formState.examples.map((example, i) =>
            i === index ? { ...example, [field]: value } : example
        );
        setFormState((prev) => ({ ...prev, examples: updatedExamples }));
    };

    const handleAddExample = () => {
        setFormState((prev) => ({
            ...prev,
            examples: [
                ...prev.examples,
                {
                    input: "",         // Ensure the input and output fields are present
                    output: ""
                }
            ]
        }));
    };


    const handleRemoveExample = (index: number) => {
        const updatedExamples = formState.examples.filter((_, i) => i !== index);
        setFormState((prev) => ({ ...prev, examples: updatedExamples }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTestCaseFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setTestCaseFile(null);
    };

    const handleDifficultyChange = (value: string) => {
        setFormState((prev) => ({ ...prev, difficulty: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const problemResponse = await createProblem(formState);
            const problemCode: string = formState.code;

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
            <Helmet>
                <title> Create a problem </title>
                <meta name="description" content="" />
            </Helmet>
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
                    <Label htmlFor="exampleInput">Example Input/Output</Label>
                    {formState.examples.map((example, index) => (
                        <div key={index} className="example-container space-y-2 mb-4 p-4 border border-gray-300 rounded-md">
                            <div>
                                <Label>Example Input {index + 1}</Label>
                                <Textarea
                                    value={example.input}
                                    onChange={(e) => handleExampleChange(index, 'exampleInput', e.target.value)}
                                    placeholder="Enter example input"
                                    rows={2}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Example Output {index + 1}</Label>
                                <Textarea
                                    value={example.output}
                                    onChange={(e) => handleExampleChange(index, 'exampleOutput', e.target.value)}
                                    placeholder="Enter example output"
                                    rows={2}
                                    required
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={() => handleRemoveExample(index)}
                                variant="destructive"
                            >
                                Remove Example
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={handleAddExample}>
                        Add Another Example
                    </Button>
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
                            Vui lòng nộp bài kiểm tra dưới dạng tệp nén ProblemCode.zip, là tệp nén của thư mục ProblemCode.
                            Bên trong chứa các thư mục theo dạng Test1, Test2, Test3, ... TestN-th.
                            Trong mỗi thư mục của từng test case sẽ có hai tệp ProblemCode.inp và ProblemCode.out, đây là các tệp đầu vào và đầu ra tương ứng.
                        </AlertDescription>
                    </Alert>
                </div>
                <Button type="submit">Create Problem</Button>
            </form>
        </div>
    );
};

export default CreateProblem;
