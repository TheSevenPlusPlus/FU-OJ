import React, { TextareaHTMLAttributes } from 'react';

// Define props for the Textarea component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string; // Optional label for the textarea
    error?: string; // Optional error message
    rows?: number; // Default number of rows
}

// Textarea component
const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    rows = 4,
    ...props
}) => {
    return (
        <div className="mb-4">
            {label && <label className="block mb-1 font-medium">{label}</label>}
            <textarea
                rows={rows}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Textarea;
