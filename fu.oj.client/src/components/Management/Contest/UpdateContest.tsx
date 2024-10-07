import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { getContestByCode, updateContest } from "../../../api/contest"; // API call to get and update contest
import { CreateContestRequest, CreateContestProblemRequest } from "../../../models/ContestModel";
import { X, Plus } from "lucide-react";
import { UpdateContestRequest } from '../../../models/ContestModel';

const UpdateContest: React.FC = () => {
    const navigate = useNavigate();
    const { contestCode } = useParams<{ contestCode: string }>(); // Get contestId from URL params
    const [formState, setFormState] = useState<UpdateContestRequest>({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        rules: "",
        problems: [],
    });

    const [problems, setProblems] = useState<CreateContestProblemRequest[]>([
        { problemCode: "", order: 1, point: 0 },
    ]);
    const [error, setError] = useState<string | null>(null);

    // Fetch existing contest data on component mount
    useEffect(() => {
        const fetchContestData = async () => {
            try {
                const contest = await getContestByCode(contestCode!); // Fetch contest data using contestId
                setFormState({
                    name: contest.data.name,
                    description: contest.data.description,
                    startTime: contest.data.startTime,
                    endTime: contest.data.endTime,
                    rules: contest.data.rules,
                    problems: contest.data.problems || [],
                });
                setProblems(contest.data.problems || []);
            } catch (err) {
                setError("Failed to load contest data");
            }
        };

        if (contestCode) {
            fetchContestData();
        }
    }, [contestCode]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleProblemChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        const updatedProblems = [...problems];
        updatedProblems[index] = { ...updatedProblems[index], [name]: value };
        setProblems(updatedProblems);
    };

    const addProblemField = () => {
        setProblems([...problems, { problemCode: "", order: problems.length + 1, point: 0 }]);
    };

    const removeProblemField = (index: number) => {
        const updatedProblems = problems.filter((_, i) => i !== index);
        setProblems(updatedProblems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure startTime and endTime are in ISO 8601 format
        const formattedStartTime = new Date(formState.startTime).toISOString();
        const formattedEndTime = new Date(formState.endTime).toISOString();

        const updatedFormState = {
            ...formState,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            problems,
        };

        try {
            await updateContest(contestCode!, updatedFormState); // API call to update contest
            navigate("/manager/contests");
        } catch (err) {
            setError("Failed to update contest");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Update Contest</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Contest Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="Enter contest name"
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
                        placeholder="Enter contest description"
                        rows={3}
                    />
                </div>
                <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                        id="startTime"
                        name="startTime"
                        type="datetime-local"
                        value={formState.startTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                        id="endTime"
                        name="endTime"
                        type="datetime-local"
                        value={formState.endTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="rules">Rules</Label>
                    <Textarea
                        id="rules"
                        name="rules"
                        value={formState.rules}
                        onChange={handleInputChange}
                        placeholder="Enter contest rules"
                        rows={3}
                    />
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Problems</h2>
                    {problems.map((problem, index) => (
                        <Card key={index} className="mb-4">
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <Label htmlFor={`problemCode_${index}`}>Problem Code</Label>
                                    <Input
                                        id={`problemCode_${index}`}
                                        name="problemCode"
                                        value={problem.problemCode}
                                        onChange={(e) => handleProblemChange(index, e)}
                                        placeholder="Enter problem code"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`order_${index}`}>Order</Label>
                                    <Input
                                        id={`order_${index}`}
                                        name="order"
                                        type="number"
                                        value={problem.order}
                                        onChange={(e) => handleProblemChange(index, e)}
                                        placeholder="Enter order"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`point_${index}`}>Point</Label>
                                    <Input
                                        id={`point_${index}`}
                                        name="point"
                                        type="number"
                                        value={problem.point}
                                        onChange={(e) => handleProblemChange(index, e)}
                                        placeholder="Enter point"
                                        required
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => removeProblemField(index)}
                                    className="text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                    Remove Problem
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    <Button
                        variant="outline"
                        type="button"
                        onClick={addProblemField}
                        className="flex items-center"
                    >
                        <Plus className="w-4 h-4" />
                        Add Problem
                    </Button>
                </div>
                <Button type="submit">Update Contest</Button>
            </form>
        </div>
    );
};

export default UpdateContest;
