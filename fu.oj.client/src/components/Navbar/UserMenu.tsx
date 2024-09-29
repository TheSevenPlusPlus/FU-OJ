import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ManagerMenu from "./ManagerMenu";

interface UserMenuProps {
  user: {
    userName: string;
    avatarUrl: string;
    role?: string;
  };
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const isManagerOrAdmin = user.role === "Admin" || user.role === "Manager";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage
              className="rounded-full"
              src={
                user.avatarUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"
              }
              alt={user.userName}
            />
            <AvatarFallback>{user.userName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{user.userName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile/edit" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>
        {isManagerOrAdmin && <ManagerMenu />}
        <DropdownMenuItem onClick={onLogout} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
