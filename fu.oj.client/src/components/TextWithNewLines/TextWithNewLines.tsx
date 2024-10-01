import React from 'react';

const TextWithNewLines = ({ text }) => {
    return (
        <div>
            {text.split('\n').map((line, index) => (
                <p key={index} style={{ margin: 0 }}>
                    {line}
                </p>
            ))}
        </div>
    );
};

export default TextWithNewLines;
