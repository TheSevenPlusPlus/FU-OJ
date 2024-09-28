import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock API functions
const fetchUsers = async () => {
    // Simulating API call
    return [
        { id: 1, username: "john_doe", email: "john@example.com", role: "User" },
        { id: 2, username: "jane_smith", email: "jane@example.com", role: "Admin" },
        { id: 3, username: "bob_johnson", email: "bob@example.com", role: "User" },
    ];
};

const addUser = async (user: { username: string; email: string; role: string }) => {
    // Simulating API call
    console.log("Adding user:", user);
    return { id: Date.now(), ...user };
};

const updateUser = async (id: number, user: { username: string; email: string; role: string }) => {
    // Simulating API call
    console.log("Updating user:", id, user);
    return { id, ...user };
};

const deleteUser = async (id: number) => {
    // Simulating API call
    console.log("Deleting user:", id);
    return true;
};

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [formState, setFormState] = useState({
        username: "",
        email: "",
        role: "User",
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const updatedUser = await updateUser(editingUser.id, formState);
                setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
            } else {
                const newUser = await addUser(formState);
                setUsers([...users, newUser]);
            }
            setIsDialogOpen(false);
            resetForm();
            setEditingUser(null);
        } catch (err) {
            setError("Failed to save user");
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormState({
            username: user.username,
            email: user.email,
            role: user.role,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                setError("Failed to delete user");
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value: string) => {
        setFormState(prev => ({ ...prev, role: value }));
    };

    const resetForm = () => {
        setFormState({
            username: "",
            email: "",
            role: "User",
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => { setEditingUser(null); resetForm(); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add New User
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formState.username}
                                onChange={handleInputChange}
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formState.email}
                                onChange={handleInputChange}
                                placeholder="Enter email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={handleRoleChange} value={formState.role}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">{editingUser ? "Update" : "Add"} User</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(user)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit User</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleDelete(user.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete User</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Lock className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Reset Password</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserManagement;