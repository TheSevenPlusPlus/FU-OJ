import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock API functions
const fetchProblem = async (id: number) => {
    // Simulating API call
    return { id, title: "Sample Problem", difficulty: "Medium", description: "This is a sample problem description." };
};

const updateProblem = async (id: number, problem: { title: string; difficulty: string; description: string }) => {
    // Simulating API call
    console.log("Updating problem:", id, problem);
    return { id, ...problem };
};

const UpdateProblem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        title: "",
        difficulty: "Easy",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProblem = async () => {
            try {
                const problem = await fetchProblem(Number(id));
                setFormState(problem);
            } catch (err) {
                setError("Failed to load problem");
            } finally {
                setLoading(false);
            }
        };
        loadProblem();
    }, [id]);

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
            await updateProblem(Number(id), formState);
            navigate('/problems');
        } catch (err) {
            setError("Failed to update problem");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Update Problem</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formState.title}
                        onChange={handleInputChange}
                        placeholder="Enter problem title"
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
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        placeholder="Enter problem description"
                        rows={5}
                    />
                </div>
                <Button type="submit">Update Problem</Button>
            </form>
        </div>
    );
};

export default UpdateProblem;