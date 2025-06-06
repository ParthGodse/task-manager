"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditTaskDialog } from "@/components/modals/EditTaskDialog";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowStack } from "./ArrowStack";


const STATUS = ["todo", "in-progress", "done"] as const;

type Props = {
  tasks: Task[];
  onDragEnd: (taskId: string, newStatus: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, newTitle: string, newStatus: Task["status"], newDescription: string, newPriority: "low" | "medium" | "high") => void;
  searchQuery?: string;
};

export function KanbanBoard({ tasks, onDragEnd, onDeleteTask, onEditTask, searchQuery }: Props) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {STATUS.map((status) => (
          <Column key={status} status={status} tasks={tasks.filter(t => t.status === status)} onDelete={onDeleteTask} onEdit={onEditTask} searchQuery={searchQuery}/>
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

function Column({ status, tasks, onDelete, onEdit, searchQuery }: { status: string; tasks: Task[]; onDelete: (taskId: string) => void; onEdit: (taskId: string, newTitle: string, newStatus: Task["status"], newDescription: string, newPriority: "low" | "medium" | "high") => void; searchQuery?: string; }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="p-4 bg-gray-50 rounded-lg shadow-sm min-h-[500px]">
      <h2 className={`text-lg font-semibold capitalize px-4 py-1 rounded-full shadow-sm inline-block mb-4 ${
        status === "todo"
          ? "bg-purple-100 text-purple-600"
          : status === "in-progress"
          ? "bg-blue-100 text-blue-600"
          : "bg-green-100 text-green-600"
          }`}
        >{status.replace("-", " ")}
      </h2>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task}  onEdit={(newTitle, newStatus, newDescription, newPriority) => onEdit(task.id, newTitle, newStatus, newDescription, newPriority)} onDelete={() => onDelete(task.id)} searchQuery={searchQuery ?? ""}/>
        ))}
      </div>
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query || !text.toLowerCase().includes(query.toLowerCase())) return text;


  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
    ) : (
      part
    )
  );
}


export function TaskCard({
  task,
  onEdit,
  onDelete,
  searchQuery,
}: {
  task: Task;
  onEdit: (newTitle: string, newStatus: Task["status"], newDescription: string, newPriority: "low" | "medium" | "high") => void;
  onDelete: () => void;
  searchQuery: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(task.description ?? "");


  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        ref={setNodeRef}
        style={style}
        className="bg-card text-card-foreground rounded-lg shadow-sm p-4 border border-border transition-shadow hover:shadow-md hover:bg-muted/40"
      ><div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-lg" />
        <div className="flex justify-between items-start">
          <div className="cursor-grab flex-1" {...listeners} {...attributes}>
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold leading-tight">
              {highlightMatch(task.title, searchQuery)}
              </h3>
              <ArrowStack level={task.priority} />
            </div>
            {task.description && (
              <p className="text-sm test-muted-foreground mt-1">
                {highlightMatch(task.description, searchQuery)}
              </p>
            )}
          </div>
          

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpen(true)}>
                ✏️ Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>🗑️ Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <EditTaskDialog
        task={task}
        open={open}
        setOpen={setOpen}
        onSave={(newTitle, newStatus, newDescription, newPriority) => {
          onEdit(newTitle, newStatus, newDescription, newPriority);
          setOpen(false);
        }}
        
      />
      </motion.div>
    </>
  );
}
