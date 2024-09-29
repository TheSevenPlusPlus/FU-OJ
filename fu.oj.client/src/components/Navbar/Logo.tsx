import React from "react";
import { Link } from "react-router-dom";
import { Code } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex-shrink-0 flex items-center">
      <Code className="h-8 w-8" />
      <span className="ml-1 text-xl font-bold">FPTU Online Judge</span>
    </Link>
  );
};

export default Logo;
