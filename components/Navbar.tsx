"use client";

import { Input } from "@/components/ui/input";
import { AddProjectModal } from "@/components/modals/AddProjectModal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; 

export function Navbar({ onAddProject, 
  onDeleteProject, 
  selectedId,
  onSearch,
}: { 
  onAddProject: (name:string) => void; 
  onDeleteProject: (id: string) => void; 
  selectedId: string;
  onSearch: (query: string) => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      {/* Left: Header Title */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-red-500 ml-2 p-2 rounded hover:bg-red-100 transition-colors"
          title="Logout">
          <LogOut className="h-5 w-5" />
        </button>
      <h1 className="text-3xl font-extrabold font-serif ml-2">
        TaskManager
      </h1>
      {/* Middle: Search */}
      <Input
        type="text"
        placeholder="Search..."
        className="w-[400px] translate-y-1 ml-10" 
        onChange={(e) => onSearch(e.target.value)}
      />
      </div>
      {/* Right: Button */}
      <div className="flex items-right gap-4">
      <AddProjectModal onAdd={onAddProject} />
      <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90"
          onClick={() => {
            if (confirm("Delete this project?")) {
              onDeleteProject(selectedId);
            }
          }}
        >
          <Trash className="h-5 w-5 " />
        </Button>
      </div>
    </nav>
  );
}
