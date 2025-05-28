"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AddTaskModal} from "@/components/modals/AddTaskModal";
import { Button } from "@/components/ui/button";

export function ProjectHeader({
  projects,
  selectedId,
  onSelect,
  onAddTask,
  onDeleteProject,
}: {
  projects: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddTask: (title: string, status: "todo" | "in-progress" | "done", description: string, priority: "low" | "medium" | "high") => void;
  onDeleteProject: (id: string) => void;
}) {

const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground tracking-widest">PROJECT</p>

        {/* Combined project name + dropdown */}
        <Select onValueChange={onSelect} value={selectedId}>
          <SelectTrigger
            className="w-fit p-0 h-auto border-none bg-transparent text-2xl font-bold focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder={selectedProject?.name || "Select Project"}/>
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AddTaskModal onAdd={onAddTask} />
    </div>
  );
}
