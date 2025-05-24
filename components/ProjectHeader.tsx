"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function ProjectHeader({
  projects,
  selectedId,
  onSelect,
  onAddTask,
}: {
  projects: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddTask: (title: string) => void;
}) {

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground tracking-widest">PROJECT</p>

        {/* Combined project name + dropdown */}
        <Select onValueChange={onSelect} defaultValue={selectedId}>
          <SelectTrigger
            className="w-fit p-0 h-auto border-none bg-transparent text-2xl font-bold focus:ring-0 focus:ring-offset-0"
          >
            <SelectValue
              placeholder="Select Project"
              className="text-2xl font-bold"
            />
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

      <button
      onClick={() => {
        const title = prompt("Task title?");
        if (!title) return;
        onAddTask(title); // callback from parent
      }}
      className="bg-black text-white px-4 py-2 rounded text-sm"
    >
      + Add Task
    </button>
    </div>
  );
}
