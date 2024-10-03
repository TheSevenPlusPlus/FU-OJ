import React from "react";
import { Link } from "react-router-dom";
import { Settings, FileQuestion, BookOpen, Users } from "lucide-react";
import {
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuItem,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

interface ManagerMenuProps {
    isManager: boolean;
}

const ManagerMenu: React.FC<ManagerMenuProps> = ({ isManager }) => {
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Manager</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuItem asChild>
                        <Link to="/manager/problems" className="flex items-center">
                            <FileQuestion className="mr-2 h-4 w-4" />
                            <span>Problem</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/manager/blogs" className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Blog</span>
                        </Link>
                    </DropdownMenuItem>
                    {!isManager && (
                        <DropdownMenuItem asChild>
                            <Link to="/manager/users" className="flex items-center">
                                <Users className="mr-2 h-4 w-4" />
                                <span>User</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
};

export default ManagerMenu;
