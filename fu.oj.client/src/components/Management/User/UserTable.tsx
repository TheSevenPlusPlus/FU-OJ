import React from "react";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserView } from "../../../models/UserDTO";
import { Edit, Trash2, ExternalLink } from "lucide-react";

interface UserTableProps {
    users: UserView[];
    onEdit: (user: UserView) => void;
    onDelete: (id: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="font-semibold text-gray-700">
                            Username
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            Full Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            Email
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.userName}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <TableCell>
                                <Link
                                    to={`/profile/${user.userName}`}
                                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {user.userName}
                                    <ExternalLink className="ml-1 h-4 w-4" />
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium">
                                {user.fullName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(user)}
                                    className="mr-2 text-gray-600 hover:text-blue-600"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(user.userName)}
                                    className="text-gray-600 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
