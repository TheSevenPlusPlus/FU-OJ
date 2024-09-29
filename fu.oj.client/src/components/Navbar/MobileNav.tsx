import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavProps {
  user: {
    userName: string;
    role?: string;
  } | null;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  user,
  isOpen,
  onToggle,
  onLogout,
}) => {
  const isManagerOrAdmin = user?.role === "Admin" || user?.role === "Manager";

  return (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetTrigger asChild>
        <Button
          className="text-black md:hidden"
          variant="outline"
          size="icon"
          onClick={onToggle}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-black text-white">
        <div className="flex flex-col space-y-4 mt-4">
          <Link
            to="/"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            onClick={onToggle}
          >
            Home
          </Link>
          <Link
            to="/problems"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            onClick={onToggle}
          >
            Problems
          </Link>
          <Link
            to="/contests"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            onClick={onToggle}
          >
            Contests
          </Link>
          <Link
            to="/rank"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            onClick={onToggle}
          >
            Rank
          </Link>
          <Link
            to="/blog"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            onClick={onToggle}
          >
            Blog
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                onClick={onToggle}
              >
                Profile
              </Link>
              <Link
                to="/profile/edit"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                onClick={onToggle}
              >
                Edit Profile
              </Link>
              {isManagerOrAdmin && (
                <>
                  <Link
                    to="/manager/problems"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                    onClick={onToggle}
                  >
                    Problem Management
                  </Link>
                  <Link
                    to="/manager/blogs"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                    onClick={onToggle}
                  >
                    Blog Management
                  </Link>
                  <Link
                    to="/manager/users"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                    onClick={onToggle}
                  >
                    User Management
                  </Link>
                </>
              )}
              <Button
                variant="outline"
                className="text-black w-full"
                onClick={() => {
                  onLogout();
                  onToggle();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                asChild
                className="text-black w-full"
                onClick={onToggle}
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full" onClick={onToggle}>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
