import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock API functions
const fetchBlogs = async () => {
  // Simulating API call
  return [
    {
      id: 1,
      title: "Introduction to React",
      author: "John Doe",
      status: "Published",
      content: "React is a popular JavaScript library...",
    },
    {
      id: 2,
      title: "Advanced TypeScript Tips",
      author: "Jane Smith",
      status: "Draft",
      content: "TypeScript offers many advanced features...",
    },
    {
      id: 3,
      title: "CSS Grid Layout",
      author: "Bob Johnson",
      status: "Published",
      content: "CSS Grid is a powerful layout system...",
    },
  ];
};

const addBlog = async (blog: {
  title: string;
  author: string;
  status: string;
  content: string;
}) => {
  // Simulating API call
  console.log("Adding blog:", blog);
  return { id: Date.now(), ...blog };
};

const updateBlog = async (
  id: number,
  blog: { title: string; author: string; status: string; content: string },
) => {
  // Simulating API call
  console.log("Updating blog:", id, blog);
  return { id, ...blog };
};

const deleteBlog = async (id: number) => {
  // Simulating API call
  console.log("Deleting blog:", id);
  return true;
};

interface Blog {
  id: number;
  title: string;
  author: string;
  status: string;
  content: string;
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);

  const [formState, setFormState] = useState({
    title: "",
    author: "",
    status: "Draft",
    content: "",
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const fetchedBlogs = await fetchBlogs();
      setBlogs(fetchedBlogs);
    } catch (err) {
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        const updatedBlog = await updateBlog(editingBlog.id, formState);
        setBlogs(blogs.map((b) => (b.id === editingBlog.id ? updatedBlog : b)));
      } else {
        const newBlog = await addBlog(formState);
        setBlogs([...blogs, newBlog]);
      }
      setIsDialogOpen(false);
      resetForm();
      setEditingBlog(null);
    } catch (err) {
      setError("Failed to save blog");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormState({
      title: blog.title,
      author: blog.author,
      status: blog.status,
      content: blog.content,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter((b) => b.id !== id));
      } catch (err) {
        setError("Failed to delete blog");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormState((prev) => ({ ...prev, status: value }));
  };

  const resetForm = () => {
    setFormState({
      title: "",
      author: "",
      status: "Draft",
      content: "",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Management</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setEditingBlog(null);
              resetForm();
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Blog Post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formState.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={handleStatusChange}
                value={formState.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formState.content}
                onChange={handleInputChange}
                placeholder="Enter blog content"
                rows={10}
              />
            </div>
            <Button type="submit">
              {editingBlog ? "Update" : "Add"} Blog Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/*<Dialog>*/}
      {/*    <DialogContent className="sm:max-w-[600px]">*/}
      {/*        <DialogHeader>*/}
      {/*            <DialogTitle>{previewBlog?.title}</DialogTitle>*/}
      {/*        </DialogHeader>*/}
      {/*        <div>*/}
      {/*            <p><strong>Author:</strong> {previewBlog?.author}</p>*/}
      {/*            <p><strong>Status:</strong> {previewBlog?.status}</p>*/}
      {/*            <div className="mt-4 whitespace-pre-wrap">{previewBlog?.content}</div>*/}
      {/*        </div>*/}
      {/*    </DialogContent>*/}
      {/*</Dialog>*/}

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>{blog.id}</TableCell>
              <TableCell>{blog.title}</TableCell>
              <TableCell>{blog.author}</TableCell>
              <TableCell>{blog.status}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEdit(blog)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Blog Post</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Blog Post</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewBlog(blog)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <TooltipContent>
                      <p>Preview Blog Post</p>
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

export default BlogManagement;
