"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function EditTaskDialog({
  task,
  onSave,
  open,
  setOpen,
}: {
  task: Task;
  open: boolean;
  setOpen: (v: boolean) => void;
  onSave: (title: string, status: Task["status"], description: string) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [description, setDescription] = useState(task.description ?? "");

  const handleSave = () => {
    onSave(title.trim(), status, description.trim());
    toast("Task updated");
    setOpen(false);
  };
  useEffect(() => {
  setTitle(task.title);
  setStatus(task.status);
  setDescription(task.description ?? "");
}, [task]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>{trigger}</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px]"
          />

          <Select value={status} onValueChange={(val) => setStatus(val as Task["status"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
