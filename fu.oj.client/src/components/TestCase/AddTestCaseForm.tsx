import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addTestCaseWithFile } from '../../api/testcase'; // API mới để gửi file lên backend

const AddTestCaseForm: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>();
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleSubmit = async () => {
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('problem_code', problemCode!);

        try {
            var respond = await addTestCaseWithFile(formData); // Gửi file lên backend
            console.log(respond);
            setMessage('Test cases added successfully');
            navigate(`/problems/${problemCode}`);
        } catch (err) {
            setMessage('Failed to upload file');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Add Test Case via File</h1>
            <div className="mb-6">
                <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">
                    Upload .zip or .rar file
                </label>
                <input
                    type="file"
                    accept=".zip,.rar"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Submit
                </button>
            </div>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default AddTestCaseForm;
