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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
      {tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground text-center mb-4">Create a task to get started</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="mt-4">{task.title}</CardTitle>
                    <Badge variant="secondary">{task.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{task.project.name}</p>
                  {task.assignee && <p className="text-sm text-muted-foreground">Assignee: {task.assignee.name}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
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
    </div>
  );
}
