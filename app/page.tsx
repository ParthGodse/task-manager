"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DonutChart } from "@/components/DonutChart";
import { ProjectHeader } from "@/components/ProjectHeader";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Project } from "@/lib/types";

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    tasks: [
      { id: "a", title: "Design Mockups", status: "todo" },
      { id: "b", title: "Set up Dev Env", status: "todo" },
      { id: "c", title: "Implement Header", status: "in-progress" },
    ],
  },
  {
    id: "2",
    name: "Marketing Campaign",
    tasks: [
      { id: "d", title: "Write Email Copy", status: "todo" },
      { id: "e", title: "Schedule Newsletter", status: "in-progress" },
      { id: "f", title: "Analyze Open Rates", status: "done" },
    ],
  },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = projects.find((p) => p.id === selectedId);

  const done = selected ? selected.tasks.filter((t) => t.status === "done").length : 0;
  const inProgress = selected ? selected.tasks.filter((t) => t.status === "in-progress").length : 0;
  const percent = selected && selected.tasks.length > 0
  ? Math.round((done / selected.tasks.length) * 100)
  : 0;

  const handleAddProject = (name: string) => {
  const newProject: Project = {
    id: Date.now().toString(),
    name,
    tasks: [],
    };
    setProjects((prev) => [...prev, newProject]);
    setSelectedId(newProject.id);
};

  const handleAddTask = (title: string) => {
  setProjects((prev) =>
    prev.map((proj) =>
      proj.id === selectedId
        ? {
            ...proj,
            tasks: [
              ...proj.tasks,
              { id: Date.now().toString(), title, status: "todo" },
            ],
          }
        : proj
    )
  );
};
  return (
    <div className="min-h-screen bg-white">
      <Navbar onAddProject={handleAddProject}/>

      <div className="grid grid-cols-5 gap-6 px-6 py-8">
        {/* Left: Donut Chart Column */}
        <div className="col-span-1 flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-sm">
          <DonutChart percent={percent} />
          <div className="mt-6 space-y-3 text-center w-full">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold">{selected?.tasks.length ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">In Progress</p>
              <p className="text-lg font-bold">{inProgress}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-lg font-bold">{done}</p>
            </div>
          </div>
        </div>

        {/* Right: Project Info + Task Board */}
        <div className="col-span-4 flex flex-col gap-6">
         {selected && (
          <>
            <ProjectHeader
              projects={projects}
              selectedId={selectedId ?? ""}
              onSelect={setSelectedId}
              onAddTask={handleAddTask}
            />
            <KanbanBoard tasks={selected.tasks} />
          </>
        )}
        </div>
      </div>
    </div>
  );
}
