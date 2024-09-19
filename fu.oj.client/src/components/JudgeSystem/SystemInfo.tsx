import React, { useEffect, useState } from 'react';
import { getLanguages, getSystemInfo } from '../../api/system';

const SystemInfo: React.FC = () => {
    const [languages, setLanguages] = useState([]);
    const [systemInfo, setSystemInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const langResponse = await getLanguages();
            setLanguages(langResponse.data);

            const systemResponse = await getSystemInfo();
            setSystemInfo(systemResponse.data);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>System Information</h2>
            <pre>{JSON.stringify(systemInfo, null, 2)}</pre>

            <h3>Languages Supported</h3>
            <ul>
                {languages.map((lang: any) => (
                    <li key={lang.id}>{lang.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SystemInfo;
