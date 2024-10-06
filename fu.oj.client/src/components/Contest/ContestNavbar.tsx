import { Link, useParams, useSearchParams } from 'react-router-dom'; // Import useSearchParams

const menuItems = [
    { name: 'HOME', path: (contestCode: string) => `/contests/${contestCode}` },
    { name: 'PROBLEM', path: (contestCode: string) => `/contests/${contestCode}/problems` },
    { name: 'RANK', path: (contestCode: string) => `/contests/${contestCode}/rank` }
];

export function ContestNavbar() {
    const { contestCode: contestCodeParam } = useParams<{ contestCode: string }>();  // Get contestCode from route params
    const [searchParams] = useSearchParams();  // Hook to get the search params from the URL

    // Get contestCode from query params if it's not available in route params
    const contestCodeQuery = searchParams.get('contestCode');

    // Prefer contestCode from params, fallback to query if not available
    const contestCode = contestCodeParam || contestCodeQuery;

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
                <ul className="flex items-center justify-start space-x-1 h-10">
                    {menuItems.map((item, index) => (
                        <li key={item.name} className="flex items-center h-full">
                            <Link
                                to={contestCode ? item.path(contestCode) : '#'}  // Use contestCode if available
                                className="px-2 h-full flex items-center text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                            {index < menuItems.length - 1 && (
                                <span className="h-4 w-px bg-gray-300" aria-hidden="true" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
