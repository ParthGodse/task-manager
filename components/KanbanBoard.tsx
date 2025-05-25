"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
const STATUS = ["todo", "in-progress", "done"] as const;

type Props = {
  tasks: Task[];
  onDragEnd: (taskId: string, newStatus: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
};

export function KanbanBoard({ tasks, onDragEnd, onDeleteTask, onEditTask }: Props) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {STATUS.map((status) => (
          <Column key={status} status={status} tasks={tasks.filter(t => t.status === status)} onDelete={onDeleteTask} onEdit={onEditTask}/>
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

function Column({ status, tasks, onDelete, onEdit }: { status: string; tasks: Task[]; onDelete: (taskId: string) => void; onEdit: (task: Task) => void; }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="p-4 bg-gray-100 rounded min-h-[300px]">
      <h2 className="font-semibold mb-3 capitalize">{status.replace("-", " ")}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task}  onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)}/>
        ))}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
      className="p-3 cursor-grab bg-white shadow-sm relative"
    >
      <div className="flex justify-between items-start">
        <span>{task.title}</span>
        <div className="flex gap-1 text-gray-400">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent drag handler
              console.log("Edit clicked for", task.title);
              onEdit();
            }}
            title="Edit"
          >
            ✏️
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent drag handler
              onDelete();
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </Card>
  );
}
