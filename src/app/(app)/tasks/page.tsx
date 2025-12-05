"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  project: { name: string };
  assignee: { name: string } | null;
}

export default function TasksPage() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?workspaceId=${workspaceId}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        } else {
          toast.error("Failed to load tasks");
        }
      } catch (_e) {
        toast.error("Error fetching tasks");
      } finally {
        setIsLoading(false);
      }
    };

    if (workspaceId) {
      fetchTasks();
    }
  }, [workspaceId]);

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Workspace not specified. Please select a workspace.</p>
      </div>
    );
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.projectId) {
      toast.error("Title and Project are required");
      return;
    }
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        toast.success("Task created!");
        setIsCreateOpen(false);
        setNewTask({ title: "", description: "", projectId: "", assigneeId: "" });
        // Re-fetch tasks
        const fetchResponse = await fetch(`/api/tasks?workspaceId=${workspaceId}`);
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          setTasks(data.tasks);
        }
      } else {
        toast.error("Failed to create task");
      }
    } catch (_e) {
      toast.error("Error creating task");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </motion.div>
      {/* Summary Stats */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === "DONE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status !== "DONE").length}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {tasks.length === 0 ? (
        <motion.div variants={item}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                Track your work by creating tasks. Assign them to projects and team members.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold mb-4">All Tasks</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer h-full group border-primary/10">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="mt-4 text-lg">{task.title}</CardTitle>
                        <Badge 
                          variant={task.status === "DONE" ? "default" : "secondary"}
                          className={task.status === "DONE" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description || "No description provided"}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                            {task.project.name}
                          </span>
                          {task.assignee && (
                            <span className="text-xs text-muted-foreground">
                              {task.assignee.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Provide task details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-project">Project ID</Label>
              <Input
                id="task-project"
                value={newTask.projectId}
                onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assignee ID (optional)</Label>
              <Input
                id="task-assignee"
                value={newTask.assigneeId}
                onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-desc">Description</Label>
              <Input
                id="task-desc"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
