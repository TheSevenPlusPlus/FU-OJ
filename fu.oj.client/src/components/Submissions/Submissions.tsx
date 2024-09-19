import React, { useState } from 'react';
import { submitCode, getSubmissionStatus } from '../../api/submission';

const Submission: React.FC = () => {
    const [problemId, setProblemId] = useState('');
    const [code, setCode] = useState('');
    const [submissionToken, setSubmissionToken] = useState('');
    const [status, setStatus] = useState(null);

    const handleSubmit = async () => {
        const response = await submitCode({ problemId, code });
        setSubmissionToken(response.data.token);
    };

    const handleCheckStatus = async () => {
        const response = await getSubmissionStatus(submissionToken);
        setStatus(response.data);
    };

    return (
        <div>
            <h2>Submit Your Code</h2>
            <input
                type="text"
                placeholder="Problem ID"
                value={problemId}
                onChange={(e) => setProblemId(e.target.value)}
            />
            <textarea
                placeholder="Your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>

            {submissionToken && (
                <div>
                    <h3>Submission Token: {submissionToken}</h3>
                    <button onClick={handleCheckStatus}>Check Status</button>
                    {status && <pre>{JSON.stringify(status, null, 2)}</pre>}
                </div>
            )}
        </div>
    );
};

export default Submission;
