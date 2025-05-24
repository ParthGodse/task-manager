"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Task } from "@/lib/types";

const STATUS = ["todo", "in-progress", "done"] as const;

type Props = {
  tasks: Task[];
  onDragEnd: (taskId: string, newStatus: Task["status"]) => void;
};

export function KanbanBoard({ tasks, onDragEnd }: Props) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {STATUS.map((status) => (
          <Column key={status} status={status} tasks={tasks.filter(t => t.status === status)} />
        ))}
      </div>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { over, active } = event;
    if (over && active && over.id !== active.data.current.status) {
      onDragEnd(active.id, over.id);
    }
  }
}

function Column({ status, tasks }: { status: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="p-4 bg-gray-100 rounded min-h-[300px]">
      <h2 className="font-semibold mb-3 capitalize">{status.replace("-", " ")}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      status: task.status,
    },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-3 cursor-grab bg-white shadow-sm"
    >
      {task.title}
    </Card>
  );
}
