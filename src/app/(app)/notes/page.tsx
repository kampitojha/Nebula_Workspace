"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, User } from "lucide-react";
import { toast } from "sonner";
import Editor from "@/components/ui/editor";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: {
    name: string | null;
  };
  project: {
    name: string;
  };
}

interface Project {
  id: string;
  name: string;
}

export default function NotesPage() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace");
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    projectId: "",
  });

  useEffect(() => {
    if (workspaceId) {
      fetchData();
    }
  }, [workspaceId]);

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Workspace not specified. Please select a workspace.</p>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      const [notesRes, projectsRes] = await Promise.all([
        fetch(`/api/notes?workspaceId=${workspaceId}`),
        fetch(`/api/projects?workspaceId=${workspaceId}`)
      ]);

      if (notesRes.ok && projectsRes.ok) {
        const notesData = await notesRes.json();
        const projectsData = await projectsRes.json();
        setNotes(notesData.notes);
        setProjects(projectsData.projects);
      } else {
        toast.error("Failed to load data");
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.projectId) {
      toast.error("Title and Project are required");
      return;
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newNote, workspaceId }),
      });

      if (response.ok) {
        toast.success("Note created successfully!");
        setIsCreateOpen(false);
        setNewNote({ title: "", content: "", projectId: "" });
        fetchData();
      } else {
        toast.error("Failed to create note");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground mt-1">
            Capture ideas and documentation
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects with Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(notes.map(n => n.project.name)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {notes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Capture ideas, meeting minutes, and documentation. Create your first note to get started.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">All Notes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="mt-4 line-clamp-1">{note.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      Project: {note.project.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Created by {note.createdBy.name}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Add a new note to a project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                placeholder="Meeting Notes"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-project">Project</Label>
              <Select
                value={newNote.projectId}
                onValueChange={(value) => setNewNote({ ...newNote, projectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Editor
                content={newNote.content}
                onChange={(content) => setNewNote({ ...newNote, content })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNote}>Create Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
