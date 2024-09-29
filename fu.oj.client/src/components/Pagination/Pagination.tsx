import React from 'react';
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const renderPagination = () => {
        const paginationItems = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (startPage > 1) {
            paginationItems.push(
                <Button key={1} onClick={() => onPageChange(1)} variant="outline" size="sm">
                    1
                </Button>
            );
            if (startPage > 2) {
                paginationItems.push(
                    <Button key="ellipsis-start" variant="outline" size="sm" disabled>
                        ...
                    </Button>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <Button key={i} onClick={() => onPageChange(i)} variant={i === currentPage ? "default" : "outline"} size="sm">
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(
                    <Button key="ellipsis-end" variant="outline" size="sm" disabled>
                        ...
                    </Button>
                );
            }
            paginationItems.push(
                <Button key={totalPages} onClick={() => onPageChange(totalPages)} variant="outline" size="sm">
                    {totalPages}
                </Button>
            );
        }

        return paginationItems;
    };

    return (
        <div className="flex justify-center mt-4 space-x-2">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="sm">
                Previous
            </Button>
            {renderPagination()}
            <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" size="sm">
                Next
            </Button>
        </div>
    );
};

export default Pagination;
