"use client";
import { Card } from "@/components/ui/card";
import { Task } from "@/lib/types";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";

const STATUS = ["todo", "in-progress", "done"] as const;

type Props = {
  tasks: Task[];
  onDragEnd: (taskId: string, newstatus: Task["status"]) => void;
}

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4 px-6 pb-6">
        {STATUS.map((status) => (
          <div key={status} className="bg-gray-100 rounded p-3 min-h-[200px]">
            <h2 className="font-semibold mb-2 capitalize">{status.replace("-", " ")}</h2>
            {tasks.filter((t) => t.status === status).map((task) => (
              <Card key={task.id} className="p-4 mb-2">{task.title}</Card>
            ))}
          </div>
    </DndContext>
      ))}
    </div>
  );
}
