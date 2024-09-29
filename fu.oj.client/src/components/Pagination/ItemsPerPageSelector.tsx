import React, { useState } from "react";

interface ItemsPerPageSelectorProps {
    itemsPerPage: number;
    onItemsPerPageChange: (size: number) => void;
}

const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({ itemsPerPage, onItemsPerPageChange }) => {
    const [inputValue, setInputValue] = useState<number>(itemsPerPage);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (value > 0) {
            setInputValue(value);
            onItemsPerPageChange(value);
        }
    };

    return (
        <div className="flex items-center mb-4">
            <span className="mr-2">Items per page:</span>
            <input
                type="number"
                value={inputValue}
                onChange={handleChange}
                min={1} // Ensure at least 1 item per page
                className="border rounded-md w-[70px] text-center"
            />
        </div>
    );
};

export default ItemsPerPageSelector;
