import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProblem } from '../../../api/problem';
import CreateProblemModel from '../models/ProblemModel';

const CreateProblem: React.FC = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState<CreateProblemModel>({
        code: '',
        title: '',
        description: '',
        constraints: '',
        exampleInput: '',
        exampleOutput: '',
        timeLimit: '',
        memoryLimit: '',
        createdAt: new Date().toISOString(),
        userName: '', // This should be populated with the current user's name
        difficulty: 'Easy'
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleDifficultyChange = (value: string) => {
        setFormState(prev => ({ ...prev, difficulty: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProblem(formState);
            navigate('/problems');
        } catch (err) {
            setError("Failed to create problem");
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
                    <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
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
                    <Select onValueChange={handleDifficultyChange} value={formState.difficulty}>
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
                <Button type="submit">Create Problem</Button>
            </form>
        </div>
    );
};

export default CreateProblem;