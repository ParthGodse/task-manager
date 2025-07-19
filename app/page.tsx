"use client";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
// import { DonutChart } from "@/components/DonutChart";
import { ProjectHeader } from "@/components/ProjectHeader";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Project, Task } from "@/lib/types";
import { toast } from "sonner";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";

const DonutChart = dynamic(() => import("@/components/DonutChart").then(mod => mod.DonutChart), {
  ssr: false,
});

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-md shadow px-4 py-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="text-lg font-bold text-foreground"><CountUp end={value} duration={0.8} /></span>
    </div>
  );
}


export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const selected = projects.find((p) => p.id === selectedId);

  const done = selected ? selected.tasks.filter((t) => t.status === "done").length : 0;
  const inProgress = selected ? selected.tasks.filter((t) => t.status === "in-progress").length : 0;
  const percent = selected && selected.tasks.length > 0
  ? Math.round((done / selected.tasks.length) * 100)
  : 0;
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      }
    };

    checkSession();
  }, []);
  
//   const handleAddProject = async (name: string) => {
//   if (!name.trim()) {
//     toast.error("Project name is required");
//     return;
//   }

//   const { data, error } = await supabase
//     .from("projects")
//     .insert({ name })
//     .select()
//     .single();

//   if (error) {
//     toast.error("Failed to add project");
//     console.error(error);
//     return;
//   }

//   setProjects((prev) => [...prev, { ...data, tasks: [] }]);
//   setSelectedId(data.id);

//   toast.success(`Project "${name}" created`,{duration: 2500});
// };
const handleAddProject = async (name: string) => {
  if (!name.trim()) {
    toast.error("Project name is required");
    return;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    toast.error("User not authenticated");
    return;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, user_id: userId }) // Add the user_id here
    .select()
    .single();

  if (error) {
    toast.error("Failed to add project");
    console.error(error);
    return;
  }

  setProjects((prev) => [...prev, { ...data, tasks: [] }]);
  setSelectedId(data.id);

  toast.success(`Project "${name}" created`, { duration: 2500 });
};


  const handleAddTask = async (
  title: string,
  status: Task["status"],
  description: string,
  priority: "low" | "medium" | "high"
) => {
  if (!title.trim()) {
    toast.error("Task title is required");
    return;
  }

  if (!selectedId) return;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    toast.error("User not authenticated");
    return;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      status,
      project_id: selectedId,
      priority,
      user_id: userId, // ✅ Add this
    })
    .select()
    .single();

  if (error) {
    toast.error("Failed to add task");
    console.error(error);
    return;
  }

  setProjects((prev) =>
    prev.map((proj) =>
      proj.id === selectedId
        ? { ...proj, tasks: [...proj.tasks, data] }
        : proj
    )
  );

  toast.success(`Task "${title}" added to ${status.replace("-", " ")}`, {
    duration: 2500,
  });
};



  const handleDragTask = async (taskId: string, newStatus: Task["status"]) => {
  const { error } = await supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", taskId);

  if (error) {
    toast.error("Failed to move task");
    console.error(error);
    return;
  }

  setProjects((prev) =>
    prev.map((proj) =>
      proj.id === selectedId
        ? {
            ...proj,
            tasks: proj.tasks.map((t) =>
              t.id === taskId ? { ...t, status: newStatus } : t
            ),
          }
        : proj
    )
  );

  toast.success(`📦 Task moved to ${newStatus.replace("-", " ")}`,{duration: 2500});
  // toast(`📦 Task moved to ${newStatus.replace("-", " ")}`,{duration: 2500});
};


const handleDeleteTask = async (taskId: string) => {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    toast.error("Failed to delete task");
    console.error(error);
    return;
  }

  setProjects((prev) =>
    prev.map((proj) =>
      proj.id === selectedId
        ? { ...proj, tasks: proj.tasks.filter((t) => t.id !== taskId) }
        : proj
    )
  );

  toast(`🗑️ Task deleted`);
};


const handleEditTask = async (
  taskId: string,
  newTitle: string,
  newStatus: Task["status"],
  newDescription: string,
  newPriority: "low" | "medium" | "high"
) => {
  const { error } = await supabase
    .from("tasks")
    .update({
      title: newTitle,
      status: newStatus,
      description: newDescription,
      priority: newPriority,
    })
    .eq("id", taskId);

  if (error) {
    toast.error("Failed to update task");
    console.error(error);
    return;
  }

  setProjects((prev) =>
    prev.map((proj) =>
      proj.id === selectedId
        ? {
            ...proj,
            tasks: proj.tasks.map((t) =>
              t.id === taskId
                ? { ...t, title: newTitle, status: newStatus, description: newDescription, priority: newPriority }
                : t
            ),
          }
        : proj
    )
  );

  toast.success("✅ Task updated",{duration: 2500});
};



const handleDeleteProject = async (id: string) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    toast.error("Failed to delete project");
    console.error(error);
    return;
  }

  const updated = projects.filter((p) => p.id !== id);
  setProjects(updated);
  setSelectedId(updated[0]?.id ?? null);

  toast(`🗑️ Project deleted`);
};

useEffect(() => {
  const fetchProjects = async () => {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, name, tasks(id, title, description, status, priority)")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch projects:", error.message);
      return;
    }

    setProjects(projects ?? []);
    setSelectedId(projects?.[0]?.id ?? null);
  };

  fetchProjects();
}, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onAddProject={handleAddProject} 
      onDeleteProject={handleDeleteProject}
      selectedId={selectedId ?? ""}
      onSearch={(query: string) => setSearchQuery(query)}
      />

      <div className="grid grid-cols-5 gap-6 px-6 py-8">
        {/* Left: Donut Chart Column */}
        <div className="col-span-1 flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl mb-4 text-center text-black font-bold">
            {selected?.name ?? "No Project"}
          </h2>
          <DonutChart percent={percent} />
          {/* <div className="mt-6 space-y-3 text-center w-full">
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
          </div> */}
          <div className="grid grid-cols-1 gap-3 w-full mt-6">
            <StatCard label="Total Tasks" value={selected?.tasks.length ?? 0} />
            <StatCard label="To Do" value={selected?.tasks.filter(t => t.status === "todo").length ?? 0} />
            <StatCard label="In Progress" value={inProgress} />
            <StatCard label="Completed" value={done} />
          </div>
        </div>

        {/* Right: Project Info + Task Board */}
        <div className="col-span-4 flex flex-col gap-6 ">
         {selected && (
          <>
            <ProjectHeader
              projects={projects}
              selectedId={selectedId ?? ""}
              onSelect={setSelectedId}
              onAddTask={handleAddTask}
              onDeleteProject={handleDeleteProject}
            />
            <KanbanBoard
              tasks={selected.tasks}
              onDragEnd={handleDragTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              searchQuery={searchQuery}
            />
          </>
        )}
        </div>
      </div>
    </div>
  );
}
