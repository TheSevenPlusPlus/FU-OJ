import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContestByCode, registerContest, isRegisteredContest } from "../../api/contest";  // Import the isRegisteredContest API
import { ContestView } from "../../models/ContestModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ContestNavbar } from "./ContestNavbar";

export function ContestHome() {
    const { contestCode } = useParams<{ contestCode: string }>();
    const [contest, setContest] = useState<ContestView | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<string | null>(null);  // To handle registration error

    useEffect(() => {
        const fetchContest = async () => {
            if (!contestCode) {
                setError("No contest code provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getContestByCode(contestCode);
                setContest(response.data);

                // Check if the user is registered
                const registeredResponse = await isRegisteredContest(contestCode);
                setIsRegistered(registeredResponse.data);  // Assuming API returns { isRegistered: boolean }
            } catch (err) {
                setError("Failed to load contest");
            } finally {
                setLoading(false);
            }
        };

        fetchContest();
    }, [contestCode]);

    const handleRegister = async () => {
        if (!contestCode) return;

        try {
            setRegisterError(null);
            await registerContest(contestCode);  // Call the registerContest API
            setIsRegistered(true);  // Set as registered if API call is successful
        } catch (err) {
            setRegisterError("Failed to register for the contest. Please try again.");
        }
    };

    if (loading) return <div>Loading contest...</div>;
    if (error) return <div>{error}</div>;
    if (!contest) return <div>No contest found</div>;

    return (
        <>
            {isRegistered && <ContestNavbar />}

            {/* Contest title section */}
            <div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10">
                <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest.name}</h1>
            </div>

            <Card className="max-w-2xl mx-auto mt-8">
                <br />
                <CardContent className="space-y-4">
                    <p><strong>Description:</strong> {contest.description}</p>
                    <p><strong>Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(contest.endTime).toLocaleString()}</p>
                    <p><strong>Organization:</strong> {contest.organizationName}</p>
                    {contest.rules && (
                        <div>
                            <strong>Rules:</strong>
                            <pre className="mt-2 whitespace-pre-wrap bg-muted p-4 rounded-md">{contest.rules}</pre>
                        </div>
                    )}
                </CardContent>

                {!isRegistered && (
                    <CardFooter>
                        <Button className="w-full" onClick={handleRegister}>
                            Register for Contest
                        </Button>
                        {registerError && <p className="text-red-500 mt-2">{registerError}</p>}
                    </CardFooter>
                )}
            </Card>
        </>
    );
}
