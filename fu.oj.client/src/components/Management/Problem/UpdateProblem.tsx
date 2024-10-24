import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, AlertCircle, Plus } from "lucide-react";
import { updateProblem, getProblemByCode } from "../../../api/problem";
import { createTestCase } from "../../../api/testcase";
import { Problem, UpdateProblemModel, ExampleInputOutput } from "../../../models/ProblemModel";
import { Helmet } from "react-helmet-async";
import Loading from "../../Loading"

const UpdateProblem: React.FC = () => {
    const navigate = useNavigate();
    const { problemCode } = useParams<{ problemCode: string }>();
    const [formState, setFormState] = useState<UpdateProblemModel>({
        code: "",
        title: "",
        description: "",
        constraints: "",
        input: "",
        output: "",
        examples: [{ input: "", output: "" }], // Initialize with one example
        timeLimit: "",
        memoryLimit: "",
        difficulty: "Easy",
    });
    const [testCaseFile, setTestCaseFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                if (problemCode) {
                    const response = await getProblemByCode(problemCode);
                    const problem: Problem = response.data;
                    setFormState({
                        code: problem.code,
                        title: problem.title,
                        description: problem.description,
                        constraints: problem.constraints,
                        input: problem.input,
                        output: problem.output,
                        examples: problem.examples || [{ input: "", output: "" }],
                        timeLimit: problem.timeLimit.toString(),
                        memoryLimit: problem.memoryLimit.toString(),
                        difficulty: problem.difficulty,
                    });
                }
            } catch (err) {
                setError("Failed to fetch problem details");
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemCode]);

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

    const handleExampleChange = (index: number, field: keyof ExampleInputOutput, value: string) => {
        const updatedExamples = [...formState.examples];
        updatedExamples[index][field] = value;
        setFormState((prev) => ({ ...prev, examples: updatedExamples }));
    };

    const handleAddExample = () => {
        setFormState((prev) => ({
            ...prev,
            examples: [...prev.examples, { input: "", output: "" }],
        }));
    };

    const handleRemoveExample = (index: number) => {
        const updatedExamples = formState.examples.filter((_, i) => i !== index);
        setFormState((prev) => ({ ...prev, examples: updatedExamples }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Update problem
            const problemResponse = await updateProblem(formState);

            // Update test case if a new file is selected
            if (testCaseFile) {
                const formData = new FormData();
                formData.append("TestcaseFile", testCaseFile);
                formData.append("ProblemCode", formState.code);
                await createTestCase(formData);
            }

            navigate("/manager/problems");
        } catch (err) {
            setError("Failed to update problem or test case");
        }
    };

    if (loading) {
        return < Loading />;
    }
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <Helmet>
                <title>Update Problem</title>
            </Helmet>
            <h1 className="text-2xl font-bold mb-4">Update Problem</h1>
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
                        disabled
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

                {/* Example Inputs/Outputs Section */}
                <div>
                    <Label>Examples</Label>
                    {formState.examples.map((example, index) => (
                        <div key={index} className="border p-4 rounded-lg my-2 bg-gray-50">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor={`exampleInput-${index}`}>Example Input</Label>
                                    <Textarea
                                        id={`exampleInput-${index}`}
                                        name={`exampleInput-${index}`}
                                        value={example.input}
                                        onChange={(e) =>
                                            handleExampleChange(index, "input", e.target.value)
                                        }
                                        placeholder="Enter example input"
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`exampleOutput-${index}`}>Example Output</Label>
                                    <Textarea
                                        id={`exampleOutput-${index}`}
                                        name={`exampleOutput-${index}`}
                                        value={example.output}
                                        onChange={(e) =>
                                            handleExampleChange(index, "output", e.target.value)
                                        }
                                        placeholder="Enter example output"
                                        rows={2}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExample(index)}
                                className="mt-2 flex items-center space-x-2"
                            >
                                <X className="h-4 w-4" />
                                <span>Remove Example</span>
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleAddExample}
                        className="mt-4 flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Example</span>
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
                    <Label>Difficulty</Label>
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

                {/* Test Case File Upload */}
                <div>
                    <Label>Test Case File (Optional)</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="testCaseFile"
                            type="file"
                            onChange={handleFileChange}
                            accept=".zip"
                        />
                        {testCaseFile && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveFile}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full">
                    Update Problem
                </Button>
            </form>
        </div>
    );
};

export default UpdateProblem;
