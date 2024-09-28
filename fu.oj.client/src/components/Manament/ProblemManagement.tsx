import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Sử dụng cho Description, Constraints, etc.
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { createProblem, updateProblem, deleteProblem, getAllProblems } from '@/api/problem';
import { Problem } from '../../models/ProblemModel';

const ProblemManagement: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
    const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

    const [formState, setFormState] = useState({
        code: "",
        title: "",
        description: "",
        constraints: "",
        exampleInput: "",
        exampleOutput: "",
        timeLimit: 1,
        memoryLimit: 256 * 1024,
    });
    const [formErrors, setFormErrors] = useState({
        code: "",
        title: "",
    });

    useEffect(() => {
        loadProblems();
    }, []);

    const loadProblems = async () => {
        try {
            setLoading(true);
            const fetchedProblems = await getAllProblems();
            setProblems(fetchedProblems);
        } catch (err) {
            setError("Failed to load problems");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { code: "", title: "" };

        if (!formState.code.trim()) {
            newErrors.code = "Code is required";
            isValid = false;
        }

        if (!formState.title.trim()) {
            newErrors.title = "Title is required";
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editingProblem) {
                await updateProblem(editingProblem.id, formState);
                setProblems(problems.map(p => p.id === editingProblem.id ? { ...p, ...formState } : p));
            } else {
                const newProblem = await createProblem(formState);
                setProblems([...problems, newProblem]);
            }
            setIsProblemDialogOpen(false);
            resetForm();
            setEditingProblem(null);
        } catch (err) {
            setError("Failed to save problem");
        }
    };

    const handleEdit = (problem: Problem) => {
        setEditingProblem(problem);
        setFormState({
            code: problem.code,
            title: problem.title,
            description: problem.description || "",
            constraints: problem.constraints || "",
            exampleInput: problem.exampleInput || "",
            exampleOutput: problem.exampleOutput || "",
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit,
        });
        setIsProblemDialogOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormState({
            code: "",
            title: "",
            description: "",
            constraints: "",
            exampleInput: "",
            exampleOutput: "",
            timeLimit: 1,
            memoryLimit: 256 * 1024,
        });
        setFormErrors({ code: "", title: "" });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Problem Management</h1>
            <Dialog open={isProblemDialogOpen} onOpenChange={setIsProblemDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => { setEditingProblem(null); resetForm(); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Problem
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingProblem ? "Edit Problem" : "Add New Problem"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="code">Code</Label>
                            <Input id="code" name="code" value={formState.code} onChange={handleInputChange} placeholder="Problem Code" />
                            {formErrors.code && <p className="text-red-500">{formErrors.code}</p>}
                        </div>
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={formState.title} onChange={handleInputChange} placeholder="Problem Title" />
                            {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formState.description} onChange={handleInputChange} placeholder="Problem Description" />
                        </div>
                        <div>
                            <Label htmlFor="constraints">Constraints</Label>
                            <Textarea id="constraints" name="constraints" value={formState.constraints} onChange={handleInputChange} placeholder="Problem Constraints" />
                        </div>
                        <div>
                            <Label htmlFor="exampleInput">Example Input</Label>
                            <Textarea id="exampleInput" name="exampleInput" value={formState.exampleInput} onChange={handleInputChange} placeholder="Example Input" />
                        </div>
                        <div>
                            <Label htmlFor="exampleOutput">Example Output</Label>
                            <Textarea id="exampleOutput" name="exampleOutput" value={formState.exampleOutput} onChange={handleInputChange} placeholder="Example Output" />
                        </div>
                        <div>
                            <Label htmlFor="timeLimit">Time Limit</Label>
                            <Input id="timeLimit" name="timeLimit" type="number" value={formState.timeLimit} onChange={handleInputChange} placeholder="Time Limit" />
                        </div>
                        <div>
                            <Label htmlFor="memoryLimit">Memory Limit (KB)</Label>
                            <Input id="memoryLimit" name="memoryLimit" type="number" value={formState.memoryLimit} onChange={handleInputChange} placeholder="Memory Limit (KB)" />
                        </div>
                        <Button type="submit">
                            {editingProblem ? "Update Problem" : "Create Problem"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem.id}>
                            <TableCell>{problem.code}</TableCell>
                            <TableCell>{problem.title}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleEdit(problem)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => deleteProblem(problem.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};


export default ProblemManagement;