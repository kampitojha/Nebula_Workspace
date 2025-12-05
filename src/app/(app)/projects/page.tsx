"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderKanban, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdBy: { name: string | null };
  _count: { tasks: number };
}

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace");

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    if (!workspaceId) return;
    fetchProjects();
  }, [workspaceId]);

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Workspace not specified. Please select a workspace.</p>
      </div>
    );
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      } else {
        toast.error("Failed to load projects");
      }
    } catch (error) {
      toast.error("Error loading projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProject, workspaceId }),
      });
      if (response.ok) {
        toast.success("Project created successfully!");
        setIsCreateOpen(false);
        setNewProject({ name: "", description: "" });
        fetchProjects();
      } else {
        toast.error("Failed to create project");
      }
    } catch (error) {
      toast.error("Error creating project");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading projects...</p>
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
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your workspace projects</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((acc, p) => acc + p._count.tasks, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div variants={item}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FolderKanban className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                Projects help you organize tasks, notes, and team members. Create your first project to get started.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold mb-4">All Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer h-full group border-primary/10">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                          <FolderKanban className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{project._count.tasks} tasks</Badge>
                      </div>
                      <CardTitle className="mt-4">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        Created by {project.createdBy.name}
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
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to organize your tasks and collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Website Redesign"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Input
                id="project-description"
                placeholder="Redesign the company website with modern UI"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
