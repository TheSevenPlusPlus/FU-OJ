import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserView,
  CreateUserRequest,
  UpdateUserRequest,
} from "../../../models/UserDTO";
import { Eye, EyeOff } from "lucide-react";

interface UserFormProps {
  user?: UserView | null;
  initialRole?: string;
  onSubmit: (
    user: CreateUserRequest | UpdateUserRequest,
    role: string,
  ) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({
  user,
  initialRole,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [formData, setFormData] = useState<
    CreateUserRequest | UpdateUserRequest
  >({
    userName: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    password: "",
    city: "",
    description: "",
    facebookLink: "",
    githubLink: "",
    school: "",
    avatarUrl: "",
  });
  const [role, setRole] = useState<string>(initialRole || "User");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: "" });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "userName":
        if (value.length < 3) {
          error = "Username must be at least 3 characters long";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Invalid email address";
        }
        break;
      case "phoneNumber":
        if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be 10 digits";
        }
        break;
      case "password":
        if (!user) {
          if (value.length < 8) {
            error = "Password must be at least 8 characters long";
          } else if (!/(?=.*[a-z])/.test(value)) {
            error = "Password must contain at least one lowercase letter";
          } else if (!/(?=.*[A-Z])/.test(value)) {
            error = "Password must contain at least one uppercase letter";
          } else if (!/(?=.*\d)/.test(value)) {
            error = "Password must contain at least one number";
          } else if (!/(?=.*[!@#$%^&*])/.test(value)) {
            error =
              "Password must contain at least one special character (!@#$%^&*)";
          }
        }
        break;
      case "facebookLink":
      case "githubLink":
        if (value && !/^https?:\/\//.test(value)) {
          error = "Link must start with http:// or https://";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = Object.values(errors).filter((error) => error !== "");
    if (formErrors.length > 0) {
      alert("Please correct the errors before submitting");
      return;
    }
    await onSubmit(formData, role);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="userName">Username</Label>
        <Input
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
          minLength={3}
          disabled={!!user}
        />
        {errors.userName && (
          <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          pattern="\d{10}"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )}
      </div>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      {!user && (
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          <ul className="text-sm text-gray-600 mt-2">
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one lowercase letter</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character (!@#$%^&*)</li>
          </ul>
        </div>
      )}
      <div>
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={setRole} defaultValue={role}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="facebookLink">Facebook Link</Label>
        <Input
          id="facebookLink"
          name="facebookLink"
          value={formData.facebookLink}
          onChange={handleChange}
        />
        {errors.facebookLink && (
          <p className="text-red-500 text-sm mt-1">{errors.facebookLink}</p>
        )}
      </div>
      <div>
        <Label htmlFor="githubLink">GitHub Link</Label>
        <Input
          id="githubLink"
          name="githubLink"
          value={formData.githubLink}
          onChange={handleChange}
        />
        {errors.githubLink && (
          <p className="text-red-500 text-sm mt-1">{errors.githubLink}</p>
        )}
      </div>
      <div>
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{user ? "Update" : "Create"} User</Button>
      </div>
    </form>
  );
}
